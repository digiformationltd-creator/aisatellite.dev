import { describe, it, expect } from 'vitest';
import { RepositoryOptimizer } from '../../growth/github-community/repository-optimizer.js';

describe('Acceptance Tests 17-18: GitHub Community Growth Engine', () => {
  const optimizer = new RepositoryOptimizer();

  it('Test 17: GitHub repository health checks audit essential open-source files', () => {
    const audit = optimizer.auditRepository('ai-satellite');

    expect(audit.repository).toBe('ai-satellite');
    expect(audit.hasReadme).toBe(true);
    expect(audit.hasInstallationGuide).toBe(true);
    expect(audit.hasLicense).toBe(true);
    expect(audit.hasSecurityPolicy).toBe(true);
    expect(audit.healthScore).toBeGreaterThanOrEqual(60);
    expect(Array.isArray(audit.recommendations)).toBe(true);
  });

  it('Test 18: Zero automatic artificial stars or fake engagement mechanisms exist', () => {
    const releaseText = optimizer.generateReleaseAnnouncement('Developer Toolbox', '1.0.0', [
      'Base64 conversion',
      'JSON formatter',
    ]);

    expect(releaseText).toContain('AI Satellite');
    // Enforces zero deceptive star gating
    expect(releaseText).not.toContain('star to unlock');
    expect(releaseText).not.toContain('buy stars');
  });
});
