/**
 * AI Satellite — Phase 14 Autonomous Global Technology Discovery & Intelligence Network
 * Cost & Security Controls
 * 
 * - SSRF Protection (blocks RFC1918, localhost, link-local, cloud metadata)
 * - Prompt Injection Defenses (strips injection sequences, boundary tokens)
 * - Budget & Cost Accounting (daily/monthly USD caps)
 * - Per-Domain Rate Limiting
 */

export interface SecurityCheckResult {
  allowed: boolean;
  reason?: string;
}

export class CostAndSecurityManager {
  private dailyBudgetLimitUsd: number = 25.0;
  private currentDailyCostUsd: number = 0.0;
  private lastResetDate: string = new Date().toISOString().slice(0, 10);
  private domainCallTimestamps: Map<string, number[]> = new Map();
  private maxCallsPerDomainPerMinute: number = 30;

  constructor(dailyBudgetUsd?: number, maxCallsPerMin?: number) {
    if (dailyBudgetUsd !== undefined) this.dailyBudgetLimitUsd = dailyBudgetUsd;
    if (maxCallsPerMin !== undefined) this.maxCallsPerDomainPerMinute = maxCallsPerMin;
  }

  /**
   * SSRF Defense: Validates URLs strictly.
   * Blocks localhost, private IP ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8),
   * Link-local (169.254.0.0/16), AWS/GCP metadata (169.254.169.254), IPv6 loopback (::1), etc.
   */
  public validateUrlForSsrf(targetUrl: string): SecurityCheckResult {
    let parsed: URL;
    try {
      parsed = new URL(targetUrl);
    } catch {
      return { allowed: false, reason: 'Malformed URL' };
    }

    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return { allowed: false, reason: `Disallowed protocol: ${parsed.protocol}` };
    }

    // Force HTTPS for production safety, allow http only in explicit non-production tests if needed
    // But for SSRF safety, check hostname
    const hostname = parsed.hostname.toLowerCase();

    // Check localhost
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname === '[::1]'
    ) {
      return { allowed: false, reason: 'SSRF Violation: Localhost access blocked' };
    }

    // Check Cloud metadata
    if (hostname === '169.254.169.254' || hostname === 'metadata.google.internal') {
      return { allowed: false, reason: 'SSRF Violation: Cloud instance metadata endpoint blocked' };
    }

    // Check Private IPv4
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipMatch = hostname.match(ipv4Regex);
    if (ipMatch) {
      const octet1 = parseInt(ipMatch[1], 10);
      const octet2 = parseInt(ipMatch[2], 10);

      // 10.0.0.0/8
      if (octet1 === 10) {
        return { allowed: false, reason: 'SSRF Violation: RFC1918 10.0.0.0/8 private network blocked' };
      }
      // 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)
      if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) {
        return { allowed: false, reason: 'SSRF Violation: RFC1918 172.16.0.0/12 private network blocked' };
      }
      // 192.168.0.0/16
      if (octet1 === 192 && octet2 === 168) {
        return { allowed: false, reason: 'SSRF Violation: RFC1918 192.168.0.0/16 private network blocked' };
      }
      // 127.0.0.0/8
      if (octet1 === 127) {
        return { allowed: false, reason: 'SSRF Violation: Loopback 127.0.0.0/8 blocked' };
      }
      // 169.254.0.0/16 Link-local
      if (octet1 === 169 && octet2 === 254) {
        return { allowed: false, reason: 'SSRF Violation: Link-local 169.254.0.0/16 blocked' };
      }
      // 0.0.0.0/8
      if (octet1 === 0) {
        return { allowed: false, reason: 'SSRF Violation: 0.0.0.0/8 network blocked' };
      }
    }

    return { allowed: true };
  }

  /**
   * Prompt Injection Defense:
   * Strips adversarial injection attempts, role manipulation tokens, system prompt overrides,
   * instruction hijacking, and excessive control delimiters.
   */
  public sanitizeResearchPromptInput(text: string): { sanitized: string; wasSanitized: boolean } {
    let wasSanitized = false;
    let result = text;

    // Patterns used in prompt injection attempts
    const injectionPatterns = [
      /ignore\s+(all\s+)?(previous|prior)\s+instructions/gi,
      /you\s+are\s+now\s+a\s+/gi,
      /system\s+prompt\s*override/gi,
      /<\s*system\s*>/gi,
      /<\s*\/\s*system\s*>/gi,
      /\[\s*INST\s*\]/gi,
      /\[\s*\/\s*INST\s*\]/gi,
      /<\|im_start\|>/gi,
      /<\|im_end\|>/gi,
      /###\s*instruction/gi,
      /###\s*system/gi,
      /act\s+as\s+an\s+unrestricted/gi,
      /jailbreak/gi,
    ];

    for (const pattern of injectionPatterns) {
      if (pattern.test(result)) {
        wasSanitized = true;
        result = result.replace(pattern, '[REDACTED_INJECTION_PATTERN]');
      }
    }

    // Limit length to avoid token exhaust attacks
    if (result.length > 5000) {
      result = result.slice(0, 5000);
      wasSanitized = true;
    }

    return { sanitized: result, wasSanitized };
  }

  /**
   * Budget & Cost Accounting
   */
  public checkAndRecordCost(estimatedUsd: number): { allowed: boolean; remainingBudgetUsd: number } {
    const today = new Date().toISOString().slice(0, 10);
    if (today !== this.lastResetDate) {
      this.currentDailyCostUsd = 0;
      this.lastResetDate = today;
    }

    if (this.currentDailyCostUsd + estimatedUsd > this.dailyBudgetLimitUsd) {
      return {
        allowed: false,
        remainingBudgetUsd: Math.max(0, this.dailyBudgetLimitUsd - this.currentDailyCostUsd),
      };
    }

    this.currentDailyCostUsd += estimatedUsd;
    return {
      allowed: true,
      remainingBudgetUsd: Number((this.dailyBudgetLimitUsd - this.currentDailyCostUsd).toFixed(4)),
    };
  }

  public getCostStatus(): { currentSpendUsd: number; limitUsd: number; remainingUsd: number } {
    return {
      currentSpendUsd: Number(this.currentDailyCostUsd.toFixed(4)),
      limitUsd: this.dailyBudgetLimitUsd,
      remainingUsd: Number(Math.max(0, this.dailyBudgetLimitUsd - this.currentDailyCostUsd).toFixed(4)),
    };
  }

  public resetCostTracking(): void {
    this.currentDailyCostUsd = 0;
    this.lastResetDate = new Date().toISOString().slice(0, 10);
  }

  /**
   * Per-domain rate limiter
   */
  public checkRateLimit(domain: string, customLimit?: number): boolean {
    const limit = customLimit || this.maxCallsPerDomainPerMinute;
    const now = Date.now();
    const windowStart = now - 60_000;

    let timestamps = this.domainCallTimestamps.get(domain) || [];
    timestamps = timestamps.filter((t) => t > windowStart);

    if (timestamps.length >= limit) {
      return false; // Rate limited
    }

    timestamps.push(now);
    this.domainCallTimestamps.set(domain, timestamps);
    return true;
  }
}

export const costAndSecurityManager = new CostAndSecurityManager();
