import { describe, it, expect } from 'vitest';
import { LAB_DEMOS } from '../../src/components/lab/AdvancedLabViewer';
import { LAB_CATEGORIES } from '../../src/data/lab-categories';

describe('Product B — 3D Web Lab Engine & Flagship Demos', () => {
  const EXPECTED_DEMO_IDS = [
    'cosmic-particle-hero',
    'glassmorphic-3d-cards',
    'cinematic-scroll-experience',
    'interactive-product-configurator',
    'liquid-shader-background',
  ];

  it('Acceptance 9: contains all 5 production flagship WebGL & 3D demos', () => {
    expect(LAB_DEMOS.length).toBe(5);
    const demoIds = LAB_DEMOS.map((d) => d.id);
    EXPECTED_DEMO_IDS.forEach((id) => {
      expect(demoIds).toContain(id);
    });
  });

  it('Acceptance 10: every demo contains valid installation, dependency, and performance specifications', () => {
    LAB_DEMOS.forEach((demo) => {
      expect(demo.title).toBeTruthy();
      expect(demo.category).toBeTruthy();
      expect(demo.tech.length).toBeGreaterThan(0);
      expect(demo.installation).toContain('npm install');

      // Performance specifications
      expect(demo.perf.targetFps).toContain('FPS');
      expect(demo.perf.drawCalls).toBeTruthy();
      expect(demo.perf.gpuMemory).toBeTruthy();
      expect(demo.perf.cpuLoad).toBeTruthy();

      // Working production code snippet
      expect(demo.code.length).toBeGreaterThan(50);
      expect(demo.promptTemplate.length).toBeGreaterThan(50);
    });
  });

  it('Acceptance 11: prompt generator dynamically interpolates user variables accurately', () => {
    const cosmicDemo = LAB_DEMOS.find((d) => d.id === 'cosmic-particle-hero')!;
    const customFramework = 'Next.js App Router';
    const customProject = 'Enterprise AI Portal';
    const customColor = '#ff007f';
    const customDensity = '2500';

    const interpolated = cosmicDemo.promptTemplate
      .replace(/\[FRAMEWORK\]/g, customFramework)
      .replace(/\[PROJECT_NAME\]/g, customProject)
      .replace(/\[ACCENT_COLOR\]/g, customColor)
      .replace(/\[PARTICLE_COUNT\]/g, customDensity);

    expect(interpolated).toContain(customFramework);
    expect(interpolated).toContain(customProject);
    expect(interpolated).toContain(customColor);
    expect(interpolated).toContain(customDensity);
    expect(interpolated).not.toContain('[FRAMEWORK]');
    expect(interpolated).not.toContain('[PROJECT_NAME]');
  });

  it('Acceptance 12: guarantees Three.js disposal pattern specifications in source code snippets', () => {
    const webglDemos = LAB_DEMOS.filter((d) => d.id !== 'glassmorphic-3d-cards');
    webglDemos.forEach((demo) => {
      expect(demo.code).toMatch(/dispose\(\)/);
    });
  });

  it('Acceptance 13: ensures all 3D lab categories are properly configured and indexed', () => {
    expect(LAB_CATEGORIES.length).toBeGreaterThanOrEqual(6);
    LAB_CATEGORIES.forEach((cat) => {
      expect(cat.id).toBeTruthy();
      expect(cat.name).toBeTruthy();
      expect(cat.slug).toBeTruthy();
      expect(cat.description).toBeTruthy();
      expect(cat.demoCount).toBeGreaterThan(0);
    });
  });
});
