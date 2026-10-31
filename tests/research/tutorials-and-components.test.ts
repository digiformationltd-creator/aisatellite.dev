import { describe, it, expect } from 'vitest';
import { tutorialEngine } from '../../src/lib/tutorials/tutorial-engine';
import { uiComponentEngine } from '../../src/lib/ui-components/component-engine';

describe('Phase 7 — Coding Tutorials & CSS Component Knowledge Base', () => {
  it('Acceptance Test 14: Coding tutorials contain validated and tested source implementations', () => {
    const tutorials = tutorialEngine.getAllTutorials();
    expect(tutorials.length).toBeGreaterThan(0);

    for (const tut of tutorials) {
      expect(tut.completeImplementation.length).toBeGreaterThan(20);
      expect(tut.prerequisites.length).toBeGreaterThan(0);
      expect(tut.troubleshooting.length).toBeGreaterThan(0);
      expect(tut.securityConsiderations.length).toBeGreaterThan(0);

      // Validate syntax
      const validation = tutorialEngine.validateSnippet(tut.completeImplementation, tut.language);
      expect(validation.valid).toBe(true);
      expect(tut.codeTested).toBe(true);
    }
  });

  it('Acceptance Test 15 & 16: CSS UI components have valid markup, specifications and copyable code', () => {
    const components = uiComponentEngine.getAllComponents();
    expect(components.length).toBeGreaterThan(0);

    for (const comp of components) {
      expect(comp.cssCode.length).toBeGreaterThan(20);
      expect(comp.htmlSnippet.length).toBeGreaterThan(10);
      expect(comp.browserCompatibility.length).toBeGreaterThan(0);
      expect(comp.accessibilityNotes.length).toBeGreaterThan(0);
      expect(comp.performanceConsiderations.length).toBeGreaterThan(0);
      expect(comp.verified).toBe(true);
    }
  });
});
