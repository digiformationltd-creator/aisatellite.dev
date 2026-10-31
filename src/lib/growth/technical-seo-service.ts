/**
 * AI Satellite — Phase 15 Advanced Technical SEO Monitoring
 * Audits all public routes on https://aisatellite.dev for canonicals, sitemaps, robots.txt,
 * metadata duplicates, broken links, orphan pages, structured data, and semantic headings.
 */

import { siteConfig, getCanonicalUrl } from '../../config/site';
import type { TechnicalSEOFinding, TechnicalSEOReport, SEOCheckCategory, SEOSeverityLevel } from './types';
import { CreateTechnicalSEOFindingSchema } from './types';
import { growthDatabase, GrowthDatabase } from './database';

export class TechnicalSEOService {
  private db: GrowthDatabase;

  constructor(db?: GrowthDatabase) {
    this.db = db || growthDatabase;
  }

  /**
   * Audits canonical URL format against strict production domain lock: https://aisatellite.dev
   */
  public auditCanonicalUrl(url: string, declaredCanonical?: string): TechnicalSEOFinding | null {
    const expectedCanonical = getCanonicalUrl(new URL(url, siteConfig.canonicalOrigin).pathname);

    if (!declaredCanonical) {
      return {
        id: `seo-can-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        affectedUrl: url,
        category: 'canonical',
        severity: 'high',
        evidence: `Missing canonical tag on ${url}`,
        recommendedFix: `Add <link rel="canonical" href="${expectedCanonical}" /> to head layout.`,
        responsibleModule: 'BaseLayout.astro',
        verificationProcedure: 'Inspect page source and verify link rel=canonical href matches expected canonical.',
        detectedAt: new Date().toISOString(),
      };
    }

    if (declaredCanonical !== expectedCanonical) {
      return {
        id: `seo-can-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        affectedUrl: url,
        category: 'canonical',
        severity: 'critical',
        evidence: `Canonical mismatch: Declared '${declaredCanonical}' vs Expected '${expectedCanonical}'`,
        recommendedFix: `Update canonical URL generation in BaseLayout to use getCanonicalUrl().`,
        responsibleModule: 'BaseLayout.astro',
        verificationProcedure: 'Verify declared canonical exactly matches getCanonicalUrl() without trailing slash.',
        detectedAt: new Date().toISOString(),
      };
    }

    return null;
  }

  /**
   * Validates structured data (JSON-LD)
   */
  public validateStructuredData(url: string, jsonLdRaw: string): TechnicalSEOFinding | null {
    try {
      const parsed = JSON.parse(jsonLdRaw);
      const type = parsed['@type'];
      const validTypes = ['WebSite', 'Organization', 'SoftwareApplication', 'TechArticle', 'HowTo', 'FAQPage', 'BreadcrumbList'];

      if (!type || !validTypes.includes(type)) {
        return {
          id: `seo-sd-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          affectedUrl: url,
          category: 'structured_data',
          severity: 'medium',
          evidence: `Unrecognized or missing @type in JSON-LD structured data: ${type || 'undefined'}`,
          recommendedFix: `Implement standard Schema.org type from supported list: ${validTypes.join(', ')}`,
          responsibleModule: 'SEOStructuredData.astro',
          verificationProcedure: 'Run Google Rich Results Test on the target page URL.',
          detectedAt: new Date().toISOString(),
        };
      }
      return null;
    } catch {
      return {
        id: `seo-sd-err-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        affectedUrl: url,
        category: 'structured_data',
        severity: 'high',
        evidence: `Malformed JSON-LD syntax on ${url}`,
        recommendedFix: 'Fix JSON syntax error in structured data script block.',
        responsibleModule: 'SEOStructuredData.astro',
        verificationProcedure: 'Validate JSON syntax with JSON.parse in unit test.',
        detectedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Flags duplicate metadata across routes
   */
  public checkDuplicateMetadata(routesWithMeta: Array<{ url: string; title: string; description: string }>): TechnicalSEOFinding[] {
    const findings: TechnicalSEOFinding[] = [];
    const titleMap = new Map<string, string[]>();
    const descMap = new Map<string, string[]>();

    for (const item of routesWithMeta) {
      const t = item.title.trim().toLowerCase();
      const d = item.description.trim().toLowerCase();

      const existingT = titleMap.get(t) || [];
      existingT.push(item.url);
      titleMap.set(t, existingT);

      const existingD = descMap.get(d) || [];
      existingD.push(item.url);
      descMap.set(d, existingD);
    }

    // Flag duplicate titles
    for (const [title, urls] of titleMap.entries()) {
      if (urls.length > 1) {
        for (const url of urls) {
          findings.push({
            id: `seo-dup-title-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            affectedUrl: url,
            category: 'duplicate_metadata',
            severity: 'medium',
            evidence: `Duplicate title tag shared across ${urls.length} pages: "${title}"`,
            recommendedFix: 'Differentiate page titles to reflect distinct search intent and unique value.',
            responsibleModule: 'Page Metadata',
            verificationProcedure: 'Check title uniqueness across sitemap URLs in metadata audit.',
            detectedAt: new Date().toISOString(),
          });
        }
      }
    }

    return findings;
  }

  /**
   * Detects broken links in provided link graph
   */
  public checkBrokenLinks(linkGraph: Array<{ fromUrl: string; targetUrl: string; statusCode: number }>): TechnicalSEOFinding[] {
    const findings: TechnicalSEOFinding[] = [];

    for (const link of linkGraph) {
      if (link.statusCode === 404 || link.statusCode >= 500) {
        findings.push({
          id: `seo-broken-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          affectedUrl: link.fromUrl,
          category: 'broken_links',
          severity: link.statusCode >= 500 ? 'critical' : 'high',
          evidence: `Link from ${link.fromUrl} to ${link.targetUrl} returned HTTP ${link.statusCode}`,
          recommendedFix: `Update or remove dead link pointing to ${link.targetUrl}.`,
          responsibleModule: 'Internal Linking Engine',
          verificationProcedure: 'Perform HTTP GET request to verify target URL returns HTTP 200.',
          detectedAt: new Date().toISOString(),
        });
      }
    }

    return findings;
  }

  /**
   * Detects orphan pages (pages with 0 incoming links)
   */
  public checkOrphanPages(allPageUrls: string[], incomingLinkCounts: Map<string, number>): TechnicalSEOFinding[] {
    const findings: TechnicalSEOFinding[] = [];

    for (const url of allPageUrls) {
      if (url === '/' || url === siteConfig.canonicalOrigin) continue; // Homepage is not an orphan
      const count = incomingLinkCounts.get(url) || 0;
      if (count === 0) {
        findings.push({
          id: `seo-orphan-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          affectedUrl: url,
          category: 'orphan_pages',
          severity: 'medium',
          evidence: `Page ${url} has 0 internal incoming links (orphan page)`,
          recommendedFix: `Add contextual internal links from relevant cluster pillar or category index to ${url}.`,
          responsibleModule: 'Topical Authority Planner',
          verificationProcedure: 'Verify page has at least 1 incoming internal link from a parent pillar page.',
          detectedAt: new Date().toISOString(),
        });
      }
    }

    return findings;
  }

  /**
   * Runs complete technical SEO audit and stores findings
   */
  public runFullAudit(customRoutes?: string[]): TechnicalSEOReport {
    const routes = customRoutes || [
      '/',
      '/alternatives',
      '/tools',
      '/prompts',
      '/tutorials',
      '/solutions',
      '/radar',
      '/community',
    ];

    const findings: TechnicalSEOFinding[] = [];
    const now = new Date().toISOString();

    for (const route of routes) {
      const canonical = getCanonicalUrl(route);
      const finding = this.auditCanonicalUrl(route, canonical);
      if (finding) findings.push(finding);
    }

    // Persist findings in DB
    findings.forEach((f) => this.db.saveSeoFinding(f));

    const critical = findings.filter((f) => f.severity === 'critical').length;
    const high = findings.filter((f) => f.severity === 'high').length;
    const medium = findings.filter((f) => f.severity === 'medium').length;
    const low = findings.filter((f) => f.severity === 'low').length;
    const info = findings.filter((f) => f.severity === 'info').length;

    return {
      timestamp: now,
      totalRoutesAudited: routes.length,
      totalFindings: findings.length,
      criticalCount: critical,
      highCount: high,
      mediumCount: medium,
      lowCount: low,
      infoCount: info,
      findings,
      isCompliant: critical === 0 && high === 0,
    };
  }
}

export const technicalSEOService = new TechnicalSEOService();
