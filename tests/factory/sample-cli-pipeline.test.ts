import { describe, it, expect } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import { factoryOrchestrator } from '../../factory/orchestrator/orchestrator';
import { factoryDatabase } from '../../factory/storage/database';
import { auditLogger } from '../../factory/monitoring/audit-logger';

describe('Requirement 33-35: End-to-End Autonomous Software Factory Simulation', () => {
  const projectId = `e2e-developer-toolbox-${Date.now()}`;
  const approver = 'Sarah Chen (Lead Systems Architect)';

  it('executes the complete multi-agent lifecycle from discovery to release and publishing', async () => {
    // -------------------------------------------------------------
    // STEP 1: Research & Opportunity Discovery
    // -------------------------------------------------------------
    const brief = {
      projectId,
      name: 'AI Satellite Developer Toolbox CLI',
      problemStatement: 'Engineers switch to untrusted third-party web apps to format JSON, hash strings, and convert timestamps, exposing private tokens.',
      targetUsers: ['Full-stack Developers', 'DevOps Engineers', 'Security Researchers'],
      proposedDifferentiation: '100% offline, zero-telemetry local execution with deterministic test vectors.',
      mvpFeatures: [
        'Local JSON formatting & minification',
        'Base64 encode / decode',
        'UUID v4 generation',
        'SHA-256 and MD5 hashing',
        'Unix epoch timestamp parsing',
        'Text metrics and case conversions',
      ],
      suggestedStack: ['TypeScript', 'Node.js LTS (Native APIs)'],
      rawScores: {
        usefulness: 92,
        feasibility: 95,
        ecosystemGap: 88,
        sustainability: 85,
        distribution: 80,
        originality: 78,
      },
    };

    const discovery = await factoryOrchestrator.discoverOpportunity(brief);
    expect(discovery.proposal.scores.weightedTotal).toBeGreaterThanOrEqual(85);
    expect(discovery.project.status).toBe('awaiting_approval');

    // -------------------------------------------------------------
    // STEP 2: Human Approval Gate 1 (Proposal Approval)
    // -------------------------------------------------------------
    const approvedProj = factoryOrchestrator.approveProposal(projectId, approver);
    expect(approvedProj.status).toBe('planning');
    expect(approvedProj.approvedBy).toBe(approver);

    // -------------------------------------------------------------
    // STEP 3 & 4: Requirements PRD & Architecture Design
    // -------------------------------------------------------------
    const { prd, architecture } = await factoryOrchestrator.planProject(projectId);
    expect(prd.executiveSummary).toBeDefined();
    expect(prd.acceptanceTests.length).toBeGreaterThan(0);
    expect(architecture.implementationTasks.length).toBeGreaterThanOrEqual(3);

    // -------------------------------------------------------------
    // STEP 5: Human Approval Gate 2 (Architecture Approval)
    // -------------------------------------------------------------
    const devApprovedProj = factoryOrchestrator.approveDevelopment(projectId, approver);
    expect(devApprovedProj.status).toBe('developing');

    // -------------------------------------------------------------
    // STEP 6: Coding Agent Implementation in Isolated Sandbox
    // -------------------------------------------------------------
    const updatedProj = await factoryOrchestrator.developTasks(projectId, [
      {
        taskIndex: 0,
        files: [
          {
            relativePath: 'package.json',
            content: JSON.stringify({
              name: projectId,
              version: '1.0.0',
              scripts: { test: 'node --test' },
            }),
          },
          {
            relativePath: 'LICENSE',
            content: `MIT License\n\nCopyright (c) 2026 AI Satellite Engineering Team\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal...`,
          },
        ],
      },
      {
        taskIndex: 1,
        files: [
          {
            relativePath: 'src/index.ts',
            content: 'export const status = "healthy";',
          },
        ],
      },
    ]);
    expect(updatedProj.budgetConfig.consumedIterations).toBeGreaterThan(0);

    // -------------------------------------------------------------
    // STEP 7 & 8: Automated Verification (Tests & Security Audits)
    // -------------------------------------------------------------
    const { testReport, securityReport } = await factoryOrchestrator.verifySoftware(
      projectId,
      {
        customSuites: [
          { name: 'JSON Formatter Unit Suite', status: 'passed', durationMs: 12 },
          { name: 'Cryptographic Hash Unit Suite', status: 'passed', durationMs: 8 },
          { name: 'Base64 & UUID Unit Suite', status: 'passed', durationMs: 15 },
        ],
      }
    );
    expect(testReport.status).toBe('passed');
    expect(testReport.failed).toBe(0);
    expect(securityReport.isBlocked).toBe(false);

    // -------------------------------------------------------------
    // STEP 9 & 10: Documentation & Release Candidate Packaging
    // -------------------------------------------------------------
    const docContext = {
      projectId,
      projectName: 'Developer Toolbox CLI',
      tagline: 'Fast, Zero-Telemetry Offline Developer Utilities',
      description: 'Local developer utilities without cloud dependencies.',
      license: 'MIT',
      author: 'AI Satellite Software Factory',
      version: '1.0.0',
      commands: [
        { name: 'json', description: 'Format or minify JSON', usage: 'developer-toolbox json \'{"a":1}\'' },
        { name: 'hash', description: 'SHA-256 or MD5 hash', usage: 'developer-toolbox hash sha256 text' },
      ],
      features: [
        'Local JSON formatting',
        'Cryptographic hashing',
        'Zero network calls',
      ],
    };

    const candidate = await factoryOrchestrator.stageRelease(
      projectId,
      docContext,
      '1.0.0',
      ['toolbox-v1.0.0.tar.gz']
    );

    expect(candidate.status).toBe('awaiting_approval');
    expect(candidate.artifacts.length).toBe(1);
    expect(candidate.artifacts[0].sha256).toHaveLength(64);

    // -------------------------------------------------------------
    // STEP 11: Human Approval Gate 3 (Release Candidate Approval)
    // -------------------------------------------------------------
    const approvedCandidate = factoryOrchestrator.approveReleaseCandidate(
      projectId,
      candidate.releaseId,
      approver,
      'Cryptographic checksums verified against sandbox build.'
    );
    expect(approvedCandidate.status).toBe('approved');
    expect(approvedCandidate.approvalRecord?.approvedBy).toBe(approver);

    // -------------------------------------------------------------
    // STEP 12: Publishing Bridge to Astro
    // -------------------------------------------------------------
    const testContentDir = path.resolve(process.cwd(), 'data', 'factory', 'test-e2e-content');
    const publishResult = await factoryOrchestrator.publishProject({
      project: factoryDatabase.getProject(projectId)!,
      releaseCandidate: approvedCandidate,
      tagline: docContext.tagline,
      techStack: ['TypeScript', 'Node.js', 'CLI'],
      features: docContext.features,
      projectsContentDir: testContentDir,
    });

    expect(fs.existsSync(publishResult.publishedFilePath)).toBe(true);
    const publishedContent = fs.readFileSync(publishResult.publishedFilePath, 'utf8');
    expect(publishedContent).toContain('title: "AI Satellite Developer Toolbox CLI"');
    expect(publishedContent).toContain(approvedCandidate.artifacts[0].sha256);

    // -------------------------------------------------------------
    // STEP 13: Cryptographic Audit Chain Verification
    // -------------------------------------------------------------
    const chainIntegrity = auditLogger.verifyIntegrity();
    expect(chainIntegrity.valid).toBe(true);
    expect(chainIntegrity.errors).toHaveLength(0);

    // Cleanup ephemeral content
    fs.rmSync(testContentDir, { recursive: true, force: true });
  });
});
