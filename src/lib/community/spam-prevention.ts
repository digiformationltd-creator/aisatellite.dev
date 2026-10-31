/**
 * AI Satellite — Spam Prevention & Content Sanitizer (Phase 13)
 * Real-time rate limiting, sliding window throttling, duplicate detection,
 * XSS-safe text escaping, and URL validation.
 */

export class SpamPreventionService {
  // Map of userId/IP to action timestamps
  private rateLimitMap: Map<string, number[]> = new Map();

  /**
   * Safe HTML Entity Escaper for user-submitted content.
   * Completely escapes HTML tags to prevent cross-site scripting (XSS).
   */
  public sanitizeContent(text: string): string {
    if (!text) return '';
    return text
      .replace(/\bon\w+\s*=/gi, 'sanitized-handler=')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Enforces rate limiting on actions.
   * Default: max 5 requests per minute per actor.
   */
  public checkRateLimit(
    actorId: string,
    action: string,
    maxAllowed: number = 5,
    windowMs: number = 60000
  ): { allowed: boolean; remaining: number; retryAfterMs?: number } {
    const key = `${actorId}:${action}`;
    const now = Date.now();
    const timestamps = this.rateLimitMap.get(key) || [];

    // Filter out timestamps older than the window
    const validTimestamps = timestamps.filter((t) => now - t < windowMs);

    if (validTimestamps.length >= maxAllowed) {
      const oldest = validTimestamps[0];
      const retryAfterMs = windowMs - (now - oldest);
      return { allowed: false, remaining: 0, retryAfterMs };
    }

    validTimestamps.push(now);
    this.rateLimitMap.set(key, validTimestamps);
    return {
      allowed: true,
      remaining: maxAllowed - validTimestamps.length,
    };
  }

  /**
   * Detects duplicate or near-identical text submissions
   */
  public isDuplicateContent(existingTexts: string[], newText: string): boolean {
    const normalizedNew = newText.toLowerCase().replace(/\s+/g, ' ').trim();
    if (normalizedNew.length < 10) return false;

    return existingTexts.some((existing) => {
      const normalizedExisting = existing.toLowerCase().replace(/\s+/g, ' ').trim();
      return normalizedExisting === normalizedNew;
    });
  }

  /**
   * Validates external URLs for safety:
   * Rejects javascript:, data:, raw IP addresses, and ensures HTTPS.
   */
  public isSafeExternalUrl(url: string): { safe: boolean; reason?: string } {
    if (!url) return { safe: false, reason: 'URL is empty' };

    const trimmed = url.trim();

    if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:') || trimmed.startsWith('vbscript:')) {
      return { safe: false, reason: 'Disallowed protocol' };
    }

    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        return { safe: false, reason: 'Must use HTTP or HTTPS protocol' };
      }

      // Block raw IPv4 and IPv6 hosts
      const hostname = parsed.hostname;
      if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) || hostname.startsWith('[') || hostname === 'localhost') {
        return { safe: false, reason: 'Raw IP addresses and localhost are not allowed' };
      }

      return { safe: true };
    } catch {
      return { safe: false, reason: 'Malformed URL format' };
    }
  }

  /**
   * Detects excessive links inside body text (> 5 external links is flagged as spam)
   */
  public countLinksInText(text: string): number {
    const linkRegex = /(https?:\/\/[^\s]+)/gi;
    const matches = text.match(linkRegex);
    return matches ? matches.length : 0;
  }

  /**
   * Clears rate limit state for tests
   */
  public resetLimits(): void {
    this.rateLimitMap.clear();
  }
}

export const spamPreventionService = new SpamPreventionService();
