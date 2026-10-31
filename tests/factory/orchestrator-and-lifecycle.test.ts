import { describe, it, expect, beforeEach } from 'vitest';
import { factoryOrchestrator } from '../../factory/orchestrator/orchestrator';
import { factoryDatabase } from '../../factory/storage/database';
import { auditLogger } from '../../factory/monitoring/audit-logger';
import { researchAgent } from '../../factory/agents/research/research-agent';
import { productAgent } from '../../factory/agents/product/product-agent';
import { architectureAgent } from '../../factory/agents/architecture/architecture-agent';
import { maintenanceAgent } from '../../factory/agents/maintenance/maintenance-agent';

describe('Requirement 1-8, 28-30: Factory Orchestrator, Multi-Agent Lifecycle & Audit Logs', () => {
  const projectId = 'test-audit-pipeline-proj';

  beforeEach(() => {
    factoryOrchestrator.resetEmergencyStop();
  });

  it('calculates weighted OpportunityScore correctly (Req 4)', () => {
    // Weights: usefulness 30%, feasibility 20%, ecosystemGap 20%, sustainability 15%, distribution 10%, originality 5%
    const score = researchAgent.calculateOpportunityScore({
      usefulness: 100,
      feasibility: 100,
      ecosystemGap: 100,
      sustainability: 100,
      distribution: 100,
      originality: 100,
    });

    expect(score.weightedTotal).toBe(100);

    const customScore = researchAgent.calculateOpportunityScore({
      usefulness: 80,   // 24
      feasibility: 90,  // 18
      ecosystemGap: 70, // 14
      sustainability: 60, // 9
      distribution: 50, // 5
      originality: 40,  // 2 -> total = 72
    });
    expect(customScore.weightedTotal).toBe(72);
  });

  it('produces valid proposal via ResearchAgent (Req 1, 4)', async () => {
    const brief = {
      projectId,
      name: 'Test CLI Tool',
      problemStatement: 'Developers need fast local CLI transformations.',
      targetUsers: ['Engineers', 'DevOps'],
      proposedDifferentiation: 'Zero telemetry and sub-second startup.',
      mvpFeatures: ['JSON formatting', 'Base64 conversion'],
      suggestedStack: ['TypeScript', 'Node.js'],
    };

    const res = await factoryOrchestrator.discoverOpportunity(brief);
    expect(res.project.id).toBe(projectId);
    expect(res.project.status).toBe('awaiting_approval');
    expect(res.proposal.proposalId).toBeDefined();
    expect(res.proposal.scores.weightedTotal).toBeGreaterThan(0);
  });

  it('enforces Human Gate 1: cannot plan without human approval (Req 2, 3)', async () => {
    const unapprovedId = `unapproved-plan-${Date.now()}`;
    // If not approved, planning should fail
    factoryDatabase.createProject({
      id: unapprovedId,
      name: 'Unapproved Proj',
      slug: unapprovedId,
      description: 'Test description',
      projectType: 'cli',
      status: 'awaiting_approval',
    });

    await expect(factoryOrchestrator.planProject(unapprovedId)).rejects.toThrow(
      /must be in 'planning' or 'approved' state/
    );

    // After approval, status is 'planning' and approver recorded
    const approved = factoryOrchestrator.approveProposal(unapprovedId, 'Senior Lead Engineer');
    expect(approved.status).toBe('planning');
    expect(approved.approvedBy).toBe('Senior Lead Engineer');
  });

  it('generates complete 15-section PRD via ProductAgent (Req 5)', async () => {
    const proposal = await researchAgent.evaluateIdea({
      projectId: 'prd-test-proj',
      name: 'PRD Test Project',
      problemStatement: 'Solving developer context switching problems.',
      targetUsers: ['Full-stack Developers'],
      proposedDifferentiation: 'Pure local execution without telemetry.',
      mvpFeatures: ['Format', 'Hash'],
      suggestedStack: ['TypeScript'],
    });

    const prd = await productAgent.generatePRD(proposal);
    expect(prd.executiveSummary).toBeDefined();
    expect(prd.problemDefinition).toBeDefined();
    expect(prd.targetUsers.length).toBeGreaterThan(0);
    expect(prd.userStories.length).toBeGreaterThan(0);
    expect(prd.coreFeatures.length).toBeGreaterThan(0);
    expect(prd.nonGoals.length).toBeGreaterThan(0);
    expect(prd.technicalRequirements.length).toBeGreaterThan(0);
    expect(prd.securityRequirements.length).toBeGreaterThan(0);
    expect(prd.privacyRequirements.length).toBeGreaterThan(0);
    expect(prd.accessibilityRequirements.length).toBeGreaterThan(0);
    expect(prd.performanceRequirements.length).toBeGreaterThan(0);
    expect(prd.acceptanceTests.length).toBeGreaterThan(0);
    expect(prd.releaseCriteria.length).toBeGreaterThan(0);
    expect(prd.knownRisks.length).toBeGreaterThan(0);
    expect(prd.futureRoadmap.length).toBeGreaterThan(0);
  });

  it('designs structured ArchitecturePlan with implementation tasks (Req 6)', async () => {
    const proposal = await researchAgent.evaluateIdea({
      projectId: 'arch-test-proj',
      name: 'Arch Test Project',
      problemStatement: 'Architecture test specification problem.',
      targetUsers: ['Developers'],
      proposedDifferentiation: 'Simple modular design.',
      mvpFeatures: ['Module 1'],
      suggestedStack: ['TypeScript'],
    });
    const prd = await productAgent.generatePRD(proposal);

    const arch = await architectureAgent.designArchitecture(prd, 'cli');
    expect(arch.selectedStack.language).toBe('TypeScript');
    expect(arch.implementationTasks.length).toBeGreaterThanOrEqual(3);
    expect(arch.implementationTasks[0].targetFiles.length).toBeGreaterThan(0);
  });

  it('enforces Emergency Stop immediately (Req 8)', () => {
    factoryOrchestrator.triggerEmergencyStop();
    expect(factoryOrchestrator.isEmergencyStopped()).toBe(true);

    expect(() =>
      factoryOrchestrator.approveProposal('any-id', 'Lead')
    ).toThrow(/Emergency stop active/);

    factoryOrchestrator.resetEmergencyStop();
    expect(factoryOrchestrator.isEmergencyStopped()).toBe(false);
  });

  it('maintains tamper-evident cryptographically signed audit logs (Req 28, 29)', () => {
    const log = auditLogger.log({
      actor: 'qa-tester',
      action: 'verification_benchmark',
      projectId: 'audit-proj-test',
      details: { benchmarkScore: 99.4 },
    });

    expect(log.signature).toBeDefined();
    expect(log.signature).toHaveLength(64); // SHA-256 signature

    const integrity = auditLogger.verifyIntegrity();
    expect(integrity.valid).toBe(true);
    expect(integrity.errors).toHaveLength(0);
  });

  it('executes MaintenanceAgent health scan (Req 30)', async () => {
    const tasks = await maintenanceAgent.scanForMaintenance({
      projectId: 'maintenance-test-proj',
      dependencies: {
        'lodash': '^0.9.0',
        'typescript': '^5.7.0',
      },
    });

    expect(tasks.length).toBeGreaterThan(0);
    const preOneDep = tasks.find((t) => t.type === 'dependency_update');
    expect(preOneDep).toBeDefined();
    expect(preOneDep?.title).toContain('lodash');
  });
});
