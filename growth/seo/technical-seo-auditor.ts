import fs from 'node:fs';
import path from 'node:path';
import type { SEOAuditFinding, SEOAuditReport } from '../schemas/index.js';
import { GrowthLogger } from '../monitoring/growth-logger.js';
import { GROWTH_CONFIG } from '../config/growth-config.js';
import { growthStorage } from '../storage/growth-storage.js';

export interface RouteInspection {
  url: string;
  filePath: string;
  htmlContent: string;
}

export class TechnicalSEOAuditor {
  private baseDir: string;
  private distDir: string;
  private logger: GrowthLogger;

  constructor(baseDir = process.cwd()) {
    this.baseDir = baseDir;
    this.distDir = path.join(baseDir, 'dist');
    this.logger = new GrowthLogger('TechnicalSEOAuditor', baseDir);
  }

  /**
   * Discovers all static HTML pages in dist/ (or falls back to mock routes if dist not built yet)
   */
  private discoverRoutes(): RouteInspection[] {
    const routes: RouteInspection[] = [];

    if (!fs.existsSync(this.distDir)) {
      this.logger.warn(`Dist directory ${this.distDir} not found. Running against mock/fallback routes.`);
      return this.getFallbackRoutes();
    }

    const walk = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
          const relativePath = path.relative(this.distDir, fullPath).replace(/\\/g, '/');
          let urlPath = '/' + relativePath.replace(/index\.html$/, '').replace(/\.html$/, '');
          if (!urlPath.startsWith('/')) urlPath = '/' + urlPath;
          if (urlPath !== '/' && urlPath.endsWith('/')) urlPath = urlPath.slice(0, -1);

          try {
            const htmlContent = fs.readFileSync(fullPath, 'utf8');
            routes.push({
              url: urlPath,
              filePath: fullPath,
              htmlContent,
            });
          } catch {
            // ignore unreadable
          }
        }
      }
    };

    walk(this.distDir);
    return routes.length > 0 ? routes : this.getFallbackRoutes();
  }

  private getFallbackRoutes(): RouteInspection[] {
    return [
      {
        url: '/',
        filePath: 'src/pages/index.astro',
        htmlContent: '<title>AI Satellite</title><link rel="canonical" href="https://aisatellite.pages.dev/" /><meta name="description" content="AI Satellite Hub" /><h1>AI Satellite</h1><a href="/tools/ollama">Ollama</a>',
      },
      {
        url: '/tools/ollama',
        filePath: 'src/pages/tools/ollama.html',
        htmlContent: '<title>Ollama - AI Satellite</title><link rel="canonical" href="https://aisatellite.pages.dev/tools/ollama" /><meta name="description" content="Ollama local LLM" /><h1>Ollama</h1>',
      },
    ];
  }

  /**
   * Executes complete technical SEO audit
   */
  runAudit(targetRoutes?: RouteInspection[]): SEOAuditReport {
    this.logger.info('Starting Technical SEO Audit');
    const routes = targetRoutes || this.discoverRoutes();
    const findings: SEOAuditFinding[] = [];
    const passedChecks: string[] = [];

    const existingUrls = new Set(routes.map((r) => r.url));
    const titleMap = new Map<string, string[]>();
    const descMap = new Map<string, string[]>();
    const inlinks = new Map<string, number>();

    for (const r of routes) {
      inlinks.set(r.url, 0);
    }

    // 1. Robots.txt check
    const robotsPath = path.join(this.distDir, 'robots.txt');
    const publicRobots = path.join(this.baseDir, 'public', 'robots.txt');
    const robotsExists = fs.existsSync(robotsPath) || fs.existsSync(publicRobots);
    if (!robotsExists) {
      findings.push({
        id: `seo-rob-${Date.now()}-1`,
        severity: 'high',
        category: 'robots',
        affectedUrl: '/robots.txt',
        problem: 'robots.txt file missing from public build',
        evidence: 'File not found in dist/ or public/',
        recommendedFix: 'Create public/robots.txt with User-agent: * and Sitemap directive',
        detectedAt: new Date().toISOString(),
        status: 'detected',
      });
    } else {
      passedChecks.push('robots_txt_present');
    }

    // 2. Sitemap check
    const sitemapPath = path.join(this.distDir, 'sitemap-index.xml');
    const sitemap0Path = path.join(this.distDir, 'sitemap-0.xml');
    if (!fs.existsSync(sitemapPath) && !fs.existsSync(sitemap0Path)) {
      findings.push({
        id: `seo-sm-${Date.now()}-1`,
        severity: 'high',
        category: 'sitemap',
        affectedUrl: '/sitemap-index.xml',
        problem: 'XML sitemap missing from build distribution',
        evidence: 'sitemap-index.xml not found in dist/',
        recommendedFix: 'Ensure @astrojs/sitemap integration runs during build',
        detectedAt: new Date().toISOString(),
        status: 'detected',
      });
    } else {
      passedChecks.push('sitemap_present');
    }

    // 3. Inspect each route
    for (const route of routes) {
      const html = route.htmlContent;

      // Canonical check
      const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
                             html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
      if (!canonicalMatch) {
        findings.push({
          id: `seo-can-${Date.now()}-${findings.length}`,
          severity: 'critical',
          category: 'canonical',
          affectedUrl: route.url,
          problem: 'Missing canonical URL link tag',
          evidence: `No <link rel="canonical"> tag found on page ${route.url}`,
          recommendedFix: `Add <link rel="canonical" href="${GROWTH_CONFIG.brand.canonicalBase}${route.url}">`,
          detectedAt: new Date().toISOString(),
          status: 'detected',
        });
      } else {
        const canonicalHref = canonicalMatch[1];
        if (!canonicalHref.startsWith(GROWTH_CONFIG.brand.canonicalBase)) {
          findings.push({
            id: `seo-can-inv-${Date.now()}-${findings.length}`,
            severity: 'critical',
            category: 'canonical',
            affectedUrl: route.url,
            problem: 'Invalid canonical URL domain or protocol',
            evidence: `Canonical href is "${canonicalHref}", expected to start with "${GROWTH_CONFIG.brand.canonicalBase}"`,
            recommendedFix: `Update canonical tag to use ${GROWTH_CONFIG.brand.canonicalBase}`,
            detectedAt: new Date().toISOString(),
            status: 'detected',
          });
        }
      }

      // Title check
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      if (!titleMatch || !titleMatch[1].trim()) {
        findings.push({
          id: `seo-title-${Date.now()}-${findings.length}`,
          severity: 'high',
          category: 'metadata',
          affectedUrl: route.url,
          problem: 'Missing page <title> tag',
          evidence: 'No non-empty <title> element discovered',
          recommendedFix: 'Provide a descriptive title for this route',
          detectedAt: new Date().toISOString(),
          status: 'detected',
        });
      } else {
        const titleText = titleMatch[1].trim();
        const existingPages = titleMap.get(titleText) || [];
        existingPages.push(route.url);
        titleMap.set(titleText, existingPages);
      }

      // Description check
      const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
      if (!descMatch || !descMatch[1].trim()) {
        findings.push({
          id: `seo-desc-${Date.now()}-${findings.length}`,
          severity: 'medium',
          category: 'metadata',
          affectedUrl: route.url,
          problem: 'Missing meta description tag',
          evidence: 'No <meta name="description"> tag found',
          recommendedFix: 'Add a concise 120-160 character meta description tag',
          detectedAt: new Date().toISOString(),
          status: 'detected',
        });
      } else {
        const descText = descMatch[1].trim();
        const existingDescPages = descMap.get(descText) || [];
        existingDescPages.push(route.url);
        descMap.set(descText, existingDescPages);
      }

      // Heading hierarchy (h1 check)
      const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
      if (!h1Matches || h1Matches.length === 0) {
        findings.push({
          id: `seo-h1-${Date.now()}-${findings.length}`,
          severity: 'medium',
          category: 'heading',
          affectedUrl: route.url,
          problem: 'Page is missing primary <h1> heading',
          evidence: '0 <h1> elements found in page HTML',
          recommendedFix: 'Include a single clear <h1> representing the main topic',
          detectedAt: new Date().toISOString(),
          status: 'detected',
        });
      } else if (h1Matches.length > 1) {
        findings.push({
          id: `seo-multih1-${Date.now()}-${findings.length}`,
          severity: 'low',
          category: 'heading',
          affectedUrl: route.url,
          problem: 'Multiple <h1> tags found on a single page',
          evidence: `Found ${h1Matches.length} <h1> elements`,
          recommendedFix: 'Structure page with a single primary <h1> followed by <h2> and <h3> subheadings',
          detectedAt: new Date().toISOString(),
          status: 'detected',
        });
      }

      // Image alt text check
      const imgRegex = /<img\s+([^>]*?)>/gi;
      let imgMatch: RegExpExecArray | null;
      while ((imgMatch = imgRegex.exec(html)) !== null) {
        const imgAttrs = imgMatch[1];
        if (!/alt=["'][^"']*["']/i.test(imgAttrs)) {
          findings.push({
            id: `seo-alt-${Date.now()}-${findings.length}`,
            severity: 'low',
            category: 'alt_text',
            affectedUrl: route.url,
            problem: 'Image missing required alt text attribute',
            evidence: imgMatch[0].substring(0, 80),
            recommendedFix: 'Add an informative alt="..." attribute for accessibility and image search indexing',
            detectedAt: new Date().toISOString(),
            status: 'detected',
          });
        }
      }

      // Structured data JSON-LD validation
      const jsonLdRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
      let jsonLdMatch: RegExpExecArray | null;
      while ((jsonLdMatch = jsonLdRegex.exec(html)) !== null) {
        try {
          const parsed = JSON.parse(jsonLdMatch[1]);
          if (!parsed['@context'] || !parsed['@type']) {
            findings.push({
              id: `seo-jsonld-${Date.now()}-${findings.length}`,
              severity: 'medium',
              category: 'structured_data',
              affectedUrl: route.url,
              problem: 'Invalid Schema.org JSON-LD structured data payload',
              evidence: 'Missing @context or @type property',
              recommendedFix: 'Ensure Schema.org JSON-LD contains valid @context and @type properties',
              detectedAt: new Date().toISOString(),
              status: 'detected',
            });
          }
        } catch (err) {
          findings.push({
            id: `seo-jsonld-syn-${Date.now()}-${findings.length}`,
            severity: 'high',
            category: 'structured_data',
            affectedUrl: route.url,
            problem: 'Malformed JSON syntax in application/ld+json script',
            evidence: String(err),
            recommendedFix: 'Correct JSON syntax in structured data template',
            detectedAt: new Date().toISOString(),
            status: 'detected',
          });
        }
      }

      // Internal links & broken link audit
      const hrefRegex = /href=["']([^"'#?]+)["']/gi;
      let hrefMatch: RegExpExecArray | null;
      while ((hrefMatch = hrefRegex.exec(html)) !== null) {
        const rawHref = hrefMatch[1];
        if (rawHref.startsWith('/') && !rawHref.startsWith('//')) {
          let normalizedTarget = rawHref;
          if (normalizedTarget !== '/' && normalizedTarget.endsWith('/')) {
            normalizedTarget = normalizedTarget.slice(0, -1);
          }

          // Count inlink
          if (inlinks.has(normalizedTarget)) {
            inlinks.set(normalizedTarget, (inlinks.get(normalizedTarget) || 0) + 1);
          } else if (
            !normalizedTarget.startsWith('/pagefind') &&
            !normalizedTarget.startsWith('/_pagefind') &&
            !normalizedTarget.startsWith('/api') &&
            !normalizedTarget.endsWith('.xml') &&
            !normalizedTarget.endsWith('.png') &&
            !normalizedTarget.endsWith('.svg') &&
            !normalizedTarget.endsWith('.ico') &&
            !normalizedTarget.endsWith('.css') &&
            !normalizedTarget.endsWith('.js')
          ) {
            findings.push({
              id: `seo-brk-${Date.now()}-${findings.length}`,
              severity: 'critical',
              category: 'broken_link',
              affectedUrl: route.url,
              problem: `Broken internal link detected to non-existent route: ${normalizedTarget}`,
              evidence: `href="${rawHref}" references route not found in indexable routes`,
              recommendedFix: `Update link destination or implement redirect for ${normalizedTarget}`,
              detectedAt: new Date().toISOString(),
              status: 'detected',
            });
          }
        }
      }
    }

    // 4. Duplicate title audit
    for (const [title, pages] of titleMap.entries()) {
      if (pages.length > 1) {
        findings.push({
          id: `seo-duptitle-${Date.now()}-${findings.length}`,
          severity: 'high',
          category: 'metadata',
          affectedUrl: pages.join(', '),
          problem: `Duplicate title tag across multiple pages: "${title}"`,
          evidence: `Appears on ${pages.length} URLs: ${pages.slice(0, 3).join(', ')}`,
          recommendedFix: 'Provide unique, intent-focused title tags for each distinct page',
          detectedAt: new Date().toISOString(),
          status: 'detected',
        });
      }
    }

    // 5. Duplicate description audit
    for (const [desc, pages] of descMap.entries()) {
      if (pages.length > 2) {
        findings.push({
          id: `seo-dupdesc-${Date.now()}-${findings.length}`,
          severity: 'medium',
          category: 'metadata',
          affectedUrl: pages.join(', '),
          problem: `Duplicate meta description shared across ${pages.length} pages`,
          evidence: `Description preview: "${desc.substring(0, 60)}..."`,
          recommendedFix: 'Generate unique, page-specific meta descriptions to improve SERP CTR',
          detectedAt: new Date().toISOString(),
          status: 'detected',
        });
      }
    }

    // 6. Orphan page detection (pages with 0 inlinks, excluding homepage)
    for (const [url, count] of inlinks.entries()) {
      if (url !== '/' && count === 0) {
        findings.push({
          id: `seo-orph-${Date.now()}-${findings.length}`,
          severity: 'low',
          category: 'orphan',
          affectedUrl: url,
          problem: 'Potential orphan page: No internal incoming links found',
          evidence: `Inlink count is 0 for ${url}`,
          recommendedFix: 'Add contextual links from related topic hubs or pillar pages',
          detectedAt: new Date().toISOString(),
          status: 'detected',
        });
      }
    }

    // Tally severities
    const summary = {
      critical: findings.filter((f) => f.severity === 'critical').length,
      high: findings.filter((f) => f.severity === 'high').length,
      medium: findings.filter((f) => f.severity === 'medium').length,
      low: findings.filter((f) => f.severity === 'low').length,
      info: findings.filter((f) => f.severity === 'info').length,
    };

    const report: SEOAuditReport = {
      timestamp: new Date().toISOString(),
      routesAudited: routes.length,
      summary,
      findings,
      passedChecks,
    };

    growthStorage.saveSEOFindings(findings);
    this.logger.info(`Technical SEO Audit complete: ${findings.length} findings across ${routes.length} routes`, summary);

    return report;
  }
}

export const technicalSEOAuditor = new TechnicalSEOAuditor();
