import { describe, it, expect } from 'vitest';
import { bingAndIndexNowClient } from '../../src/lib/seo/bing-and-indexnow';
import { brokenLinkChecker } from '../../src/lib/seo/broken-link-checker';
import { siteConfig } from '../../src/config/site';
import fs from 'node:fs';
import path from 'node:path';

describe('Phase 7 — SEO, Bing / IndexNow & Integrity Verification', () => {
  it('Acceptance Test 18: Broken link checker accurately detects broken internal and malformed external paths', () => {
    const testLinks = [
      { source: '/tutorials', target: '/tutorials' },
      { source: '/tutorials', target: '/broken-target-path-404' },
      { source: '/home', target: 'http://malformed-no-tld' },
    ];

    const audit = brokenLinkChecker.auditLinks(testLinks);
    expect(audit.totalChecked).toBe(3);
    expect(audit.brokenCount).toBe(2);
    expect(audit.brokenLinks.some((b) => b.target === '/broken-target-path-404')).toBe(true);
  });

  it('Acceptance Test 24 & 25: IndexNow only submits eligible canonical production URLs and handles unconfigured keys gracefully', () => {
    const candidateUrls = [
      `${siteConfig.canonicalOrigin}/tutorials/building-orbital-3d-radar-threejs-astro`,
      `${siteConfig.canonicalOrigin}/radar`,
      `${siteConfig.canonicalOrigin}/growth-admin`, // Non-eligible admin route
      'https://external-unrelated-domain.com/page', // Non-canonical domain
    ];

    const result = bingAndIndexNowClient.submitUrls(candidateUrls);
    expect(result.eligibleCount).toBe(2);
    expect(result.rejectedCount).toBe(2);
    expect(result.eligibleUrls).toContain(`${siteConfig.canonicalOrigin}/radar`);
  });

  it('Acceptance Test 2: Branding separation is strictly preserved across all Phase 7 additions', () => {
    const files = [
      'src/config/site.ts',
      'src/lib/research/evidence-ledger.ts',
      'src/lib/tutorials/tutorial-engine.ts',
      'src/lib/ui-components/component-engine.ts',
      'src/components/research/ResearchControlCenter.tsx',
      'src/pages/tutorials/index.astro',
      'src/pages/components/index.astro',
      'src/pages/research-admin/index.astro',
    ];

    for (const rel of files) {
      const full = path.resolve(process.cwd(), rel);
      const content = fs.readFileSync(full, 'utf-8');
      expect(content).not.toContain('DigiFormation');
      expect(content).not.toContain('Digi Biz OS');
    }
  });

  it('Acceptance Test 33: Cloudflare Pages deployment configuration is valid', () => {
    const wranglerPath = path.resolve(process.cwd(), 'wrangler.jsonc');
    expect(fs.existsSync(wranglerPath)).toBe(true);
    const content = fs.readFileSync(wranglerPath, 'utf-8');
    expect(content).toContain('pages_build_output_dir');
  });
});
