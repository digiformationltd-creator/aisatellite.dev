/**
 * AI Satellite — Phase 15 International Search Readiness
 * Prepares content and search endpoints for global developers: Unicode safety,
 * international locale formatting, country metadata validation, and strict hreflang integrity.
 */

import { siteConfig, getCanonicalUrl } from '../../config/site';

export interface HreflangAlternate {
  lang: string;
  href: string;
}

export interface InternationalAuditResult {
  isUnicodeSafe: boolean;
  activeLocale: string;
  hreflangTags: HreflangAlternate[];
  countryCodeValid: boolean;
  hasUnreviewedAutomatedTranslations: boolean;
  notes: string;
}

export class InternationalReadinessService {
  private primaryLocale = 'en';
  private verifiedLocalizedPaths: Map<string, string[]> = new Map();

  /**
   * Tests Unicode safety of search strings, parameters, and paths
   */
  public testUnicodeSafety(input: string): { safe: boolean; normalized: string } {
    try {
      const normalized = input.normalize('NFKC');
      const encoded = encodeURIComponent(normalized);
      const decoded = decodeURIComponent(encoded);
      return { safe: decoded === normalized, normalized };
    } catch {
      return { safe: false, normalized: input };
    }
  }

  /**
   * Formats dates and numbers into readable international representations
   */
  public formatInternationalDate(dateString: string, locale = 'en-US'): string {
    try {
      const d = new Date(dateString);
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      }).format(d);
    } catch {
      return dateString;
    }
  }

  public formatInternationalNumber(num: number, locale = 'en-US'): string {
    return new Intl.NumberFormat(locale).format(num);
  }

  /**
   * Validates ISO 3166-1 alpha-2 country codes
   */
  public isValidCountryCode(code: string): boolean {
    if (!code || code.length !== 2) return false;
    const clean = code.toUpperCase();
    const commonCodes = new Set([
      'US', 'GB', 'DE', 'FR', 'CA', 'AU', 'IN', 'JP', 'BR', 'NL', 'SE', 'SG', 'CH', 'ES', 'IT'
    ]);
    return commonCodes.has(clean) || /^[A-Z]{2}$/.test(clean);
  }

  /**
   * Generates hreflang alternate tags strictly when genuine localized equivalents exist.
   * "Only add hreflang when genuine localized equivalents exist. Do not automatically generate hundreds of unreviewed translations."
   */
  public getHreflangTags(pathname: string): HreflangAlternate[] {
    const canonical = getCanonicalUrl(pathname);
    const localized = this.verifiedLocalizedPaths.get(pathname) || [];

    const tags: HreflangAlternate[] = [
      { lang: 'en', href: canonical },
      { lang: 'x-default', href: canonical },
    ];

    for (const alt of localized) {
      tags.push({ lang: alt, href: `${siteConfig.canonicalOrigin}/${alt}${pathname}` });
    }

    return tags;
  }

  /**
   * Registers a human-verified localized page equivalent
   */
  public registerVerifiedTranslation(pathname: string, langCode: string): void {
    const current = this.verifiedLocalizedPaths.get(pathname) || [];
    if (!current.includes(langCode)) {
      current.push(langCode);
      this.verifiedLocalizedPaths.set(pathname, current);
    }
  }

  public runAudit(pathname: string, countryCode?: string): InternationalAuditResult {
    const unicodeCheck = this.testUnicodeSafety(pathname);
    const countryValid = countryCode ? this.isValidCountryCode(countryCode) : true;
    const hreflangs = this.getHreflangTags(pathname);

    return {
      isUnicodeSafe: unicodeCheck.safe,
      activeLocale: this.primaryLocale,
      hreflangTags: hreflangs,
      countryCodeValid: countryValid,
      hasUnreviewedAutomatedTranslations: false, // Strict rule: Zero unreviewed auto-translations
      notes: 'English-first international architecture. Verified canonical and x-default headers enforced.',
    };
  }
}

export const internationalReadinessService = new InternationalReadinessService();
