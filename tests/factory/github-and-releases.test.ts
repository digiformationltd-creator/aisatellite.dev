import { describe, it, expect } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import { releaseManager } from '../../factory/releases/release-manager';
import { githubManager } from '../../factory/github/github-manager';
import { ReleaseCandidateSchema } from '../../factory/schemas';

describe('Requirement 20-25: GitHub Operations & Release Management', () => {
  const distDir = path.resolve(process.cwd(), 'data', 'factory', 'test-release-dist');

  it('validates and bumps SemVer versions correctly (Req 20)', () => {
    expect(releaseManager.isValidSemVer('1.0.0')).toBe(true);
    expect(releaseManager.isValidSemVer('2.1.4-beta.1')).toBe(true);
    expect(releaseManager.isValidSemVer('invalid-ver')).toBe(false);

    expect(releaseManager.bumpVersion('1.0.0', 'patch')).toBe('1.0.1');
    expect(releaseManager.bumpVersion('1.0.0', 'minor')).toBe('1.1.0');
    expect(releaseManager.bumpVersion('1.0.0', 'major')).toBe('2.0.0');
  });

  it('calculates 64-char SHA-256 and produces SHA256SUMS.txt manifest (Req 21, 22)', () => {
    if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

    // Create a dummy binary file
    const binFile = path.join(distDir, 'test-utility.tar.gz');
    fs.writeFileSync(binFile, 'simulated-binary-content-12345', 'utf8');

    const hash = releaseManager.calculateSha256(binFile);
    expect(hash).toHaveLength(64);
    expect(/^[a-f0-9]{64}$/.test(hash)).toBe(true);

    const candidate = releaseManager.prepareReleaseCandidate({
      projectId: 'test-release-pkg',
      projectName: 'Test Release Package',
      version: '1.2.0',
      distDir,
      filesToPackage: ['test-utility.tar.gz'],
      changelogNotes: ['Added high-speed hash calculation', 'Reduced memory overhead'],
    });

    expect(candidate.artifacts.length).toBe(1);
    expect(candidate.artifacts[0].sha256).toBe(hash);

    // Verify SHA256SUMS.txt was written
    const manifestPath = path.join(distDir, 'SHA256SUMS.txt');
    expect(fs.existsSync(manifestPath)).toBe(true);
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    expect(manifestContent).toContain(hash);
    expect(manifestContent).toContain('test-utility.tar.gz');

    // Cleanup
    fs.rmSync(distDir, { recursive: true, force: true });
  });

  it('enforces human approval on release candidates before publication (Req 23, 24)', () => {
    const rawCandidate = {
      releaseId: 'rel_test_v1_0_0',
      projectId: 'test-project',
      version: '1.0.0',
      gitTag: 'v1.0.0',
      changelog: '## [1.0.0] - 2026-10-31\n\n### Added\n- Initial release',
      artifacts: [
        {
          platform: 'universal',
          filename: 'test.zip',
          url: 'https://github.com/aisatellite-org/test/releases/v1.0.0/test.zip',
          sizeBytes: 1024,
          sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        },
      ],
      status: 'awaiting_approval' as const,
      createdAt: new Date().toISOString(),
    };

    const validated = ReleaseCandidateSchema.parse(rawCandidate);
    expect(validated.status).toBe('awaiting_approval');

    // Attempting approval without human name must throw
    expect(() => releaseManager.approveRelease(validated, '')).toThrow(
      /Release approval requires a valid human approver name/
    );

    // Valid human approval
    const approved = releaseManager.approveRelease(validated, 'Principal Lead Architect');
    expect(approved.status).toBe('approved');
    expect(approved.approvalRecord?.approvedBy).toBe('Principal Lead Architect');
  });

  it('executes GitHub repository and release staging operations in mock mode (Req 25)', async () => {
    githubManager.setMockMode(true);
    expect(githubManager.getMockMode()).toBe(true);

    const repo = await githubManager.createRepository({
      name: 'autonomous-test-repo',
      description: 'Factory generated repository',
    });
    expect(repo.success).toBe(true);
    expect(repo.repoFullName).toContain('autonomous-test-repo');

    const pr = await githubManager.createPullRequest(repo.repoFullName, {
      title: 'feat: initial architecture',
      body: 'Autonomous PR from AI Satellite Software Factory',
      head: 'factory-branch',
      base: 'main',
    });
    expect(pr.success).toBe(true);
    expect(pr.prNumber).toBeGreaterThan(0);

    const rel = await githubManager.createRelease(repo.repoFullName, {
      tagName: 'v1.0.0',
      name: 'Release v1.0.0',
      body: 'Verified release candidate',
      assets: [{ name: 'bundle.zip', path: '/mock/path', size: 1024 }],
    });
    expect(rel.success).toBe(true);
    expect(rel.tagName).toBe('v1.0.0');
  });
});
