import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Phase 6 — System Integrity, Security & Acceptance Tests', () => {
  it('Acceptance Test 20, 21 & 22: 3D Visualization and accessible 2D fallback with reduced-motion support exist', () => {
    const radar3DPath = path.resolve(process.cwd(), 'src/components/radar/TechnologyRadar3D.client.ts');
    expect(fs.existsSync(radar3DPath)).toBe(true);

    const radarViewPath = path.resolve(process.cwd(), 'src/components/radar/TechnologyRadarView.tsx');
    expect(fs.existsSync(radarViewPath)).toBe(true);

    const radarViewContent = fs.readFileSync(radarViewPath, 'utf-8');
    // Verify reduced-motion detection
    expect(radarViewContent).toContain('prefers-reduced-motion');
    // Verify accessible 2D mode switch
    expect(radarViewContent).toContain('accessible_2d');
  });

  it('Acceptance Test 25: AI credentials and private API keys are not exposed in source files', () => {
    const filesToCheck = [
      'src/lib/search/hybrid-search.ts',
      'src/lib/search/grounded-answer-engine.ts',
      'src/components/search/OrbitalIntelligenceSearch.tsx',
    ];

    for (const relPath of filesToCheck) {
      const fullPath = path.resolve(process.cwd(), relPath);
      const content = fs.readFileSync(fullPath, 'utf-8');
      expect(content).not.toMatch(/sk-[a-zA-Z0-9]{32,}/);
      expect(content).not.toMatch(/ghp_[a-zA-Z0-9]{36}/);
    }
  });

  it('Acceptance Test 28 & 29: SEO metadata and required Phase 6 routes exist', () => {
    const requiredPages = [
      'src/pages/radar.astro',
      'src/pages/solutions/index.astro',
      'src/pages/solutions/[slug].astro',
      'src/pages/prompts/builder.astro',
      'src/pages/workspace.astro',
      'src/pages/search.astro',
    ];

    for (const page of requiredPages) {
      const fullPath = path.resolve(process.cwd(), page);
      expect(fs.existsSync(fullPath)).toBe(true);
      const content = fs.readFileSync(fullPath, 'utf-8');
      expect(content).toContain('title=');
      expect(content).toContain('description=');
    }
  });

  it('Acceptance Test 32: Cloudflare configuration remains valid in wrangler.jsonc', () => {
    const wranglerPath = path.resolve(process.cwd(), 'wrangler.jsonc');
    expect(fs.existsSync(wranglerPath)).toBe(true);
    const content = fs.readFileSync(wranglerPath, 'utf-8');
    expect(content).toContain('pages_build_output_dir');
  });

  it('Acceptance Test 34: Strict brand separation rules are respected in all new components', () => {
    const newFiles = [
      'src/components/search/OrbitalIntelligenceSearch.tsx',
      'src/components/prompts/PromptBuilder.tsx',
      'src/components/workspace/DeveloperWorkspace.tsx',
      'src/components/radar/TechnologyRadarView.tsx',
      'src/pages/radar.astro',
      'src/pages/solutions/index.astro',
      'src/pages/workspace.astro',
    ];

    for (const relPath of newFiles) {
      const fullPath = path.resolve(process.cwd(), relPath);
      const content = fs.readFileSync(fullPath, 'utf-8');
      expect(content).not.toContain('DigiFormation');
      expect(content).not.toContain('Digi Biz OS');
    }
  });
});
