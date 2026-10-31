import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Acceptance Tests 1-3: Brand Separation & Statutory Disclosure Compliance', () => {
  const srcPagesDir = path.join(process.cwd(), 'src', 'pages');

  it('Test 1: AI Satellite public branding is consistent across core pages', () => {
    const indexContent = fs.readFileSync(path.join(srcPagesDir, 'index.astro'), 'utf8');
    expect(indexContent).toContain('AI Satellite');
    const heroContent = fs.readFileSync(path.join(process.cwd(), 'src', 'components', 'hero', 'CosmicHero.astro'), 'utf8');
    expect(heroContent).toContain('Free Universe');
    expect(heroContent).toContain('Open Source & Development');
  });

  it('Test 2: No prohibited affiliated-company promotional components appear site-wide', () => {
    const prohibitedFiles = [
      'index.astro',
      'founder-hub.astro',
      'global-payments.astro',
      'company-formation.astro',
    ];

    for (const file of prohibitedFiles) {
      const filePath = path.join(srcPagesDir, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        expect(content).not.toContain('<PartnerRecommendation');
        expect(content).not.toContain('<PartnerDisclosure />');
      }
    }
  });

  it('Test 3: Contextual blog recommendations display mandatory commercial affiliation disclosures', () => {
    const blogLayoutPath = path.join(srcPagesDir, 'blog', '[slug].astro');
    expect(fs.existsSync(blogLayoutPath)).toBe(true);

    const content = fs.readFileSync(blogLayoutPath, 'utf8');
    expect(content).toContain('Commercially associated partner resource');
  });
});
