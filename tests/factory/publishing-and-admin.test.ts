import { describe, it, expect } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import { factoryAdminController } from '../../factory/admin/admin-controller';
import { publishingAgent } from '../../factory/agents/publishing/publishing-agent';
import type { FactoryProject, ReleaseCandidate } from '../../factory/schemas';

describe('Requirement 26-27, 31-32: Admin Controller & Astro Publishing Bridge', () => {
  it('validates admin authorization tokens and aggregates metrics (Req 26, 27)', () => {
    factoryAdminController.setAdminToken('test-secret-admin-token-12345');

    // Missing token
    const unauth1 = factoryAdminController.authenticate();
    expect(unauth1.authenticated).toBe(false);

    // Invalid token
    const unauth2 = factoryAdminController.authenticate('Bearer wrong-token');
    expect(unauth2.authenticated).toBe(false);

    // Valid token
    const auth = factoryAdminController.authenticate('Bearer test-secret-admin-token-12345');
    expect(auth.authenticated).toBe(true);
    expect(auth.user).toBe('admin-lead');

    // Metrics
    const metrics = factoryAdminController.getMetrics();
    expect(metrics.totalProjects).toBeGreaterThanOrEqual(0);
    expect(metrics.passRatePercent).toBeGreaterThanOrEqual(0);
    expect(metrics.passRatePercent).toBeLessThanOrEqual(100);
  });

  it('rejects publishing of unapproved release candidates (Req 31)', async () => {
    const unapprovedCandidate: ReleaseCandidate = {
      releaseId: 'rel_unapproved_1',
      projectId: 'unapproved-project',
      version: '1.0.0',
      gitTag: 'v1.0.0',
      changelog: '## [1.0.0] - 2026-10-31\n\n- Unapproved release notes',
      artifacts: [
        {
          platform: 'universal',
          filename: 'pkg.tar.gz',
          url: 'https://example.com/pkg.tar.gz',
          sizeBytes: 1024,
          sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        },
      ],
      status: 'awaiting_approval',
      createdAt: new Date().toISOString(),
    };

    const project: FactoryProject = {
      id: 'unapproved-project',
      name: 'Unapproved Proj',
      slug: 'unapproved-project',
      description: 'Test project description',
      projectType: 'cli',
      status: 'release_approval',
      license: 'MIT',
      targetPlatforms: ['universal'],
      budgetConfig: {
        maxIterations: 25,
        maxTokens: 500000,
        maxBuildMinutes: 15,
        maxRetries: 3,
        consumedTokens: 0,
        consumedIterations: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await expect(
      publishingAgent.publishToAstro({
        project,
        releaseCandidate: unapprovedCandidate,
        tagline: 'Unapproved project tagline',
        techStack: ['TypeScript'],
        features: ['Feature 1'],
      })
    ).rejects.toThrow(/Human approval gate violation/);
  });

  it('publishes approved release candidate into Astro content collection with valid frontmatter (Req 31, 32)', async () => {
    const testDir = path.resolve(process.cwd(), 'data', 'factory', 'test-astro-content');
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

    const approvedCandidate: ReleaseCandidate = {
      releaseId: 'rel_approved_bridge_1',
      projectId: 'bridge-project',
      version: '1.0.0',
      gitTag: 'v1.0.0',
      changelog: '## [1.0.0] - 2026-10-31\n\n- Verified production package',
      artifacts: [
        {
          platform: 'universal',
          filename: 'bridge-project-1.0.0.tar.gz',
          url: 'https://github.com/aisatellite-org/bridge-project/releases/download/v1.0.0/bridge-project-1.0.0.tar.gz',
          sizeBytes: 24576,
          sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        },
      ],
      status: 'approved',
      approvalRecord: {
        approvedBy: 'Lead Release Engineer',
        approvedAt: new Date().toISOString(),
        comments: 'Release signed off for deployment.',
      },
      createdAt: new Date().toISOString(),
    };

    const project: FactoryProject = {
      id: 'bridge-project',
      name: 'Bridge Project Utility',
      slug: 'bridge-project',
      description: 'High performance bridge utility from software factory',
      projectType: 'cli',
      status: 'approved',
      license: 'MIT',
      targetPlatforms: ['universal'],
      budgetConfig: {
        maxIterations: 25,
        maxTokens: 500000,
        maxBuildMinutes: 15,
        maxRetries: 3,
        consumedTokens: 0,
        consumedIterations: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await publishingAgent.publishToAstro({
      project,
      releaseCandidate: approvedCandidate,
      tagline: 'High performance bridge utility',
      techStack: ['TypeScript', 'Node.js'],
      features: ['Automated file generation', 'SHA-256 verification'],
      projectsContentDir: testDir,
    });

    expect(fs.existsSync(result.publishedFilePath)).toBe(true);
    const content = fs.readFileSync(result.publishedFilePath, 'utf8');
    expect(content).toContain('title: "Bridge Project Utility"');
    expect(content).toContain('openSourceLicense: "MIT"');
    expect(content).toContain('sha256: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"');
    expect(content).toContain('published: true');

    // Cleanup
    fs.rmSync(testDir, { recursive: true, force: true });
  });
});
