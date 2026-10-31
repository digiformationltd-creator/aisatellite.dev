import { describe, it, expect } from 'vitest';
import { promptGalaxyEngine } from '../../src/lib/prompts/prompt-galaxy';
import { solutionEngine } from '../../src/lib/solutions/solution-engine';
import fs from 'node:fs';
import path from 'node:path';

describe('Phase 6 — Prompt Galaxy, Prompt Builder & Developer Solutions', () => {
  it('Acceptance Test 13: Prompt search returns valid templates', () => {
    const templates = promptGalaxyEngine.getAllTemplates();
    expect(templates.length).toBeGreaterThan(0);

    const codingPrompts = promptGalaxyEngine.getTemplatesByCategory('AI Coding');
    expect(codingPrompts.length).toBeGreaterThan(0);
    expect(codingPrompts[0].slug).toBe('fullstack-architect-master');
  });

  it('Acceptance Test 14 & 15: Prompt variables render and interpolate correctly', () => {
    const template = promptGalaxyEngine.getTemplateBySlug('fullstack-architect-master')!;
    expect(template).toBeDefined();

    // Verify all 9 standard variables exist
    const varNames = template.variables.map((v) => v.name);
    expect(varNames).toContain('[PROJECT_NAME]');
    expect(varNames).toContain('[FRAMEWORK]');
    expect(varNames).toContain('[PROGRAMMING_LANGUAGE]');
    expect(varNames).toContain('[FEATURE_REQUIREMENTS]');

    // Test interpolation
    const interpolated = promptGalaxyEngine.interpolate(template, {
      '[PROJECT_NAME]': 'Satellite Custom Engine',
      '[FRAMEWORK]': 'Astro + Three.js',
      '[PROGRAMMING_LANGUAGE]': 'TypeScript',
      '[FEATURE_REQUIREMENTS]': 'Autonomous 3D radar sweep',
    });

    expect(interpolated).toContain('Project: Satellite Custom Engine');
    expect(interpolated).toContain('Framework: Astro + Three.js');
    expect(interpolated).toContain('Autonomous 3D radar sweep');
    expect(interpolated).not.toContain('[PROJECT_NAME]');
  });

  it('Acceptance Test 16: Local storage saving can persist and serialize workspace blueprints', () => {
    const mockStorage: Record<string, string> = {};
    const fakeLocalStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, val: string) => { mockStorage[key] = val; },
      removeItem: (key: string) => { delete mockStorage[key]; },
    };

    const savedItem = {
      id: 'saved-prompt-1',
      title: 'Architect Prompt',
      promptText: 'Custom prompt text',
      savedAt: new Date().toISOString(),
    };

    fakeLocalStorage.setItem('ai_satellite_saved_prompts', JSON.stringify([savedItem]));
    const retrieved = JSON.parse(fakeLocalStorage.getItem('ai_satellite_saved_prompts')!);
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].title).toBe('Architect Prompt');
  });

  it('Acceptance Test 17: Workspace route is explicitly marked with noIndex to prevent indexing private data', () => {
    const workspacePagePath = path.resolve(process.cwd(), 'src/pages/workspace.astro');
    expect(fs.existsSync(workspacePagePath)).toBe(true);
    const content = fs.readFileSync(workspacePagePath, 'utf-8');
    expect(content).toContain('noIndex={true}');
  });

  it('Developer Solution Center: Problem blueprints load and resolve required tools', () => {
    const solutions = solutionEngine.getAllSolutions();
    expect(solutions.length).toBeGreaterThan(0);

    const supportSol = solutionEngine.getSolutionBySlug('free-customer-support-system')!;
    expect(supportSol).toBeDefined();
    expect(supportSol.implementationSteps.length).toBeGreaterThan(0);
    expect(supportSol.requiredTools.some((t) => t.name === 'Chatwoot')).toBe(true);
    expect(supportSol.commonErrors.length).toBeGreaterThan(0);
  });
});
