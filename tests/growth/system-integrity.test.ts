import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Acceptance Tests 30-33: System Integrity & Deployment Configuration', () => {
  it('Test 30: Existing Astro routes remain functional', () => {
    const requiredPages = [
      'index.astro',
      'about.astro',
      'ai-agents.astro',
      'mcp-servers.astro',
      'founder-hub.astro',
      'company-formation.astro',
      'global-payments.astro',
      'partner-disclosure.astro',
      'growth-admin/index.astro',
    ];

    for (const page of requiredPages) {
      const pagePath = path.join(process.cwd(), 'src', 'pages', page);
      expect(fs.existsSync(pagePath)).toBe(true);
    }
  });

  it('Test 31: Pagefind search configuration remains functional', () => {
    const searchPage = path.join(process.cwd(), 'src', 'pages', 'search.astro');
    expect(fs.existsSync(searchPage)).toBe(true);

    const content = fs.readFileSync(searchPage, 'utf8');
    expect(content).toContain('pagefind');
  });

  it('Test 32: Production build package scripts exist and are configured', () => {
    const pkgPath = path.join(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    expect(pkg.scripts.build).toContain('astro check');
    expect(pkg.scripts.build).toContain('astro build');
    expect(pkg.scripts.build).toContain('pagefind');
    expect(pkg.scripts['growth:seo']).toBeDefined();
    expect(pkg.scripts['growth:distribute']).toBeDefined();
    expect(pkg.scripts['growth:newsletter']).toBeDefined();
  });

  it('Test 33: Cloudflare Pages deployment configuration remains valid', () => {
    // Check package deploy script or wrangler config
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    expect(pkg.scripts.deploy).toContain('wrangler pages deploy dist');
    expect(pkg.scripts.deploy).toContain('--project-name aisatellite');
  });
});
