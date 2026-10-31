export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

export class SearchSecurityGuard {
  private clientRequests: Map<string, { count: number; windowStart: number }> = new Map();
  private maxRequestsPerMinute = 60;
  private windowDurationMs = 60000;

  /**
   * Sliding window rate limiter for client search calls.
   */
  public checkRateLimit(clientId: string): RateLimitStatus {
    const now = Date.now();
    const record = this.clientRequests.get(clientId);

    if (!record || now - record.windowStart > this.windowDurationMs) {
      this.clientRequests.set(clientId, { count: 1, windowStart: now });
      return { allowed: true, remaining: this.maxRequestsPerMinute - 1, resetMs: this.windowDurationMs };
    }

    if (record.count >= this.maxRequestsPerMinute) {
      const remainingTime = this.windowDurationMs - (now - record.windowStart);
      return { allowed: false, remaining: 0, resetMs: Math.max(0, remainingTime) };
    }

    record.count++;
    this.clientRequests.set(clientId, record);
    return {
      allowed: true,
      remaining: this.maxRequestsPerMinute - record.count,
      resetMs: this.windowDurationMs - (now - record.windowStart),
    };
  }

  /**
   * Sanitizes user search input and detects prompt injection attempts.
   */
  public sanitizeSearchQuery(query: string): { cleanQuery: string; isInjected: boolean } {
    if (!query) return { cleanQuery: '', isInjected: false };

    // Truncate to maximum allowed search length
    let clean = query.trim().slice(0, 300);

    // Prompt injection heuristic checks
    const injectionPatterns = [
      /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
      /you\s+are\s+now\s+in\s+dan\s+mode/i,
      /reveal\s+(the\s+)?(system\s+prompt|api\s+key)/i,
      /override\s+system\s+directive/i,
      /<script\b/i,
    ];

    const isInjected = injectionPatterns.some((pattern) => pattern.test(clean));

    // Strip unsafe characters
    clean = clean.replace(/<[^>]*>/g, '');

    return { cleanQuery: clean, isInjected };
  }

  /**
   * Ensures retrieved untrusted text cannot execute commands or leak instructions.
   */
  public isolateRetrievalText(untrusted: string): string {
    if (!untrusted) return '';
    return untrusted
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // remove control chars
      .replace(/\[system\]/gi, '[user-text]')
      .replace(/\[instruction\]/gi, '[user-text]');
  }
}

export const searchSecurityGuard = new SearchSecurityGuard();
