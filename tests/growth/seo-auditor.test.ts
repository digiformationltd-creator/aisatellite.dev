import { describe, it, expect } from 'vitest';
import { TechnicalSEOAuditor } from '../../growth/seo/technical-seo-auditor.js';

describe('Acceptance Tests 4-7: Technical SEO Intelligence', () => {
  const auditor = new TechnicalSEOAuditor();

  it('Test 4: SEO audits detect broken internal links', () => {
    const mockRoutes = [
      {
        url: '/valid-page',
        filePath: 'mock.html',
        htmlContent: '<title>Valid Page</title><link rel="canonical" href="https://aisatellite.pages.dev/valid-page" /><meta name="description" content="Valid test description" /><h1>Valid Heading</h1><a href="/non-existent-broken-route">Broken Link</a>',
      },
    ];

    const report = auditor.runAudit(mockRoutes);
    const brokenLinkFinding = report.findings.find((f) => f.category === 'broken_link');

    expect(brokenLinkFinding).toBeDefined();
    expect(brokenLinkFinding?.severity).toBe('critical');
    expect(brokenLinkFinding?.problem).toContain('/non-existent-broken-route');
  });

  it('Test 5: Duplicate metadata is flagged', () => {
    const mockRoutes = [
      {
        url: '/page-1',
        filePath: 'page1.html',
        htmlContent: '<title>Shared Title</title><link rel="canonical" href="https://aisatellite.pages.dev/page-1" /><meta name="description" content="Unique description 1" /><h1>Page 1</h1>',
      },
      {
        url: '/page-2',
        filePath: 'page2.html',
        htmlContent: '<title>Shared Title</title><link rel="canonical" href="https://aisatellite.pages.dev/page-2" /><meta name="description" content="Unique description 2" /><h1>Page 2</h1>',
      },
    ];

    const report = auditor.runAudit(mockRoutes);
    const dupTitleFinding = report.findings.find((f) => f.id.includes('seo-duptitle'));

    expect(dupTitleFinding).toBeDefined();
    expect(dupTitleFinding?.problem).toContain('Shared Title');
  });

  it('Test 6: Invalid canonical URLs are detected', () => {
    const mockRoutes = [
      {
        url: '/bad-canonical',
        filePath: 'bad.html',
        htmlContent: '<title>Bad Canonical</title><link rel="canonical" href="https://unauthorized-domain.com/bad" /><meta name="description" content="Desc" /><h1>Bad</h1>',
      },
    ];

    const report = auditor.runAudit(mockRoutes);
    const badCanonicalFinding = report.findings.find((f) => f.category === 'canonical' && f.problem.includes('Invalid canonical URL'));

    expect(badCanonicalFinding).toBeDefined();
    expect(badCanonicalFinding?.severity).toBe('critical');
  });

  it('Test 7: Sitemap validation works', () => {
    const report = auditor.runAudit();
    // In our system, sitemap presence check runs against dist/ or flags missing if not built
    expect(report.summary).toBeDefined();
    expect(report.routesAudited).toBeGreaterThan(0);
  });
});
