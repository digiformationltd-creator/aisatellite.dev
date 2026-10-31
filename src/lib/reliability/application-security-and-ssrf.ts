/**
 * AI SATELLITE — APPLICATION SECURITY & SSRF PROTECTION ENGINE
 * Implements strict SSRF defenses, private IP range blocking, input sanitization, and rate limiting.
 */

import type { SSRFValidationResult } from './types';

export class ApplicationSecurityAndSsrf {
  private rateLimits: Map<string, { count: number; windowStart: number }> = new Map();

  /**
   * Evaluates external URLs for Server-Side Request Forgery (SSRF) vulnerabilities.
   * Strictly blocks private IP ranges, cloud metadata endpoints, loopback, and non-HTTP protocols.
   */
  public validateUrlForSsrf(targetUrl: string): SSRFValidationResult {
    let parsed: URL;
    try {
      parsed = new URL(targetUrl);
    } catch {
      return {
        isSafe: false,
        targetUrl,
        hostname: '',
        blockedReason: 'Malformed or unparseable URL.',
      };
    }

    // Protocol validation: Only http and https permitted
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        isSafe: false,
        targetUrl,
        hostname: parsed.hostname,
        blockedReason: `Prohibited protocol "${parsed.protocol}". Only HTTP and HTTPS are permitted.`,
      };
    }

    const host = parsed.hostname.toLowerCase();

    // 1. Localhost and Loopback Hostnames
    if (
      host === 'localhost' ||
      host.endsWith('.localhost') ||
      host === '127.0.0.1' ||
      host.startsWith('127.') ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host === '[::1]'
    ) {
      return {
        isSafe: false,
        targetUrl,
        hostname: host,
        blockedReason: 'SSRF Block: Loopback and localhost addresses are prohibited.',
      };
    }

    // 2. Cloud Metadata Endpoints (AWS, GCP, Azure, Cloudflare)
    if (host === '169.254.169.254' || host === 'metadata.google.internal' || host.startsWith('169.254.')) {
      return {
        isSafe: false,
        targetUrl,
        hostname: host,
        blockedReason: 'SSRF Block: Cloud instance metadata service endpoints are prohibited.',
      };
    }

    // 3. RFC 1918 Private IPv4 Ranges
    if (this.isPrivateIpv4(host)) {
      return {
        isSafe: false,
        targetUrl,
        hostname: host,
        blockedReason: 'SSRF Block: Private internal network addresses (RFC 1918) are prohibited.',
      };
    }

    // 4. Prohibited TLDs (.internal, .local, .onion)
    if (host.endsWith('.internal') || host.endsWith('.local') || host.endsWith('.onion')) {
      return {
        isSafe: false,
        targetUrl,
        hostname: host,
        blockedReason: 'SSRF Block: Internal and non-routable top-level domains are prohibited.',
      };
    }

    return {
      isSafe: true,
      targetUrl,
      hostname: host,
    };
  }

  /**
   * Checks if an IP string belongs to RFC 1918 private subnets.
   */
  private isPrivateIpv4(ip: string): boolean {
    const parts = ip.split('.').map((p) => parseInt(p, 10));
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
      return false;
    }

    // 10.0.0.0/8
    if (parts[0] === 10) return true;

    // 172.16.0.0/12 (172.16.0.0 to 172.31.255.255)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

    // 192.168.0.0/16
    if (parts[0] === 192 && parts[1] === 168) return true;

    // 100.64.0.0/10 (Carrier-Grade NAT)
    if (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) return true;

    return false;
  }

  /**
   * Validates Content Security Policy directives against XSS vulnerabilities.
   */
  public validateCspHeader(cspString: string): { isValid: boolean; warnings: string[] } {
    const warnings: string[] = [];

    if (!cspString.includes("default-src 'self'")) {
      warnings.push("CSP should contain explicit default-src 'self'.");
    }

    if (cspString.includes("'unsafe-inline'") && !cspString.includes('script-src')) {
      warnings.push("Unsafe inline detected without script-src restriction.");
    }

    if (cspString.includes('http://')) {
      warnings.push('Insecure HTTP origins detected in CSP directives.');
    }

    return {
      isValid: warnings.length === 0,
      warnings,
    };
  }

  /**
   * In-memory sliding-window rate limiter for sensitive endpoints.
   */
  public checkRateLimit(
    clientIdentifier: string,
    maxRequests: number = 60,
    windowSeconds: number = 60
  ): { allowed: boolean; currentCount: number; retryAfterSeconds?: number } {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const record = this.rateLimits.get(clientIdentifier);

    if (!record || now - record.windowStart > windowMs) {
      this.rateLimits.set(clientIdentifier, { count: 1, windowStart: now });
      return { allowed: true, currentCount: 1 };
    }

    if (record.count >= maxRequests) {
      const remainingSeconds = Math.ceil((record.windowStart + windowMs - now) / 1000);
      return { allowed: false, currentCount: record.count, retryAfterSeconds: remainingSeconds };
    }

    record.count += 1;
    return { allowed: true, currentCount: record.count };
  }
}

export const applicationSecurityAndSsrf = new ApplicationSecurityAndSsrf();
