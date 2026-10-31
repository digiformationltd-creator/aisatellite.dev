import {
  type FactoryProject,
  type ProductProposal,
  type ProductRequirementDocument,
  type ArchitecturePlan,
  type TestReport,
  type SecurityReport,
  type ReleaseCandidate,
} from '../schemas';
import { factoryDatabase } from '../storage/database';
import { auditLogger } from '../monitoring/audit-logger';
import { researchAgent, type ResearchBrief } from '../agents/research/research-agent';
import { productAgent } from '../agents/product/product-agent';
import { architectureAgent } from '../agents/architecture/architecture-agent';
import { codingAgent, type CodeFilePayload } from '../agents/coding/coding-agent';
import { testingAgent, type RunTestsOptions } from '../agents/testing/testing-agent';
import { securityAgent } from '../agents/security/security-agent';
import { documentationAgent, type ProjectDocContext } from '../agents/documentation/docs-agent';
import { releaseAgent } from '../agents/release/release-agent';
import { publishingAgent, type PublishProjectArgs } from '../agents/publishing/publishing-agent';
import { maintenanceAgent } from '../agents/maintenance/maintenance-agent';
import { sandboxEngine } from '../sandbox/sandbox-engine';

export class FactoryOrchestrator {
  private emergencyStopped = false;

  public triggerEmergencyStop(): void {
    this.emergencyStopped = true;
    auditLogger.log({
      actor: 'admin',
      action: 'emergency_stop_triggered',
      details: { timestamp: new Date().toISOString() },
    });
  }

  public resetEmergencyStop(): void {
    this.emergencyStopped = false;
    auditLogger.log({
      actor: 'admin',
      action: 'emergency_stop_reset',
      details: { timestamp: new Date().toISOString() },
    });
  }

  public isEmergencyStopped(): boolean {
    return this.emergencyStopped;
  }

  private checkEmergencyStop(): void {
    if (this.emergencyStopped) {
      throw new Error('Factory execution halted: Emergency stop active.');
    }
  }

  private checkBudget(project: FactoryProject): void {
    const budget = project.budgetConfig;
    if (budget.consumedIterations >= budget.maxIterations) {
      throw new Error(`Budget exceeded: consumed ${budget.consumedIterations} of ${budget.maxIterations} iterations.`);
    }
    if (budget.consumedTokens >= budget.maxTokens) {
      throw new Error(`Budget exceeded: consumed ${budget.consumedTokens} of ${budget.maxTokens} tokens.`);
    }
  }

  /**
   * Phase 1: Research and Proposal creation
   */
  public async discoverOpportunity(brief: ResearchBrief): Promise<{
    project: FactoryProject;
    proposal: ProductProposal;
  }> {
    this.checkEmergencyStop();

    // Create or retrieve project in database
    let project = factoryDatabase.getProject(brief.projectId);
    if (!project) {
      project = factoryDatabase.createProject({
        id: brief.projectId,
        name: brief.name,
        slug: brief.projectId,
        description: brief.problemStatement,
        projectType: 'cli',
        status: 'idea',
      });
    }

    const proposal = await researchAgent.evaluateIdea(brief);
    factoryDatabase.saveProposal(proposal);

    // Update project state to proposal
    project = factoryDatabase.updateProject(project.id, {
      status: 'awaiting_approval',
    });

    return { project, proposal };
  }

  /**
   * Human Gate 1: Approve Proposal to start planning
   */
  public approveProposal(projectId: string, approver: string): FactoryProject {
    this.checkEmergencyStop();
    const project = factoryDatabase.getProject(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);

    const updated = factoryDatabase.updateProject(projectId, {
      status: 'planning',
      approvedBy: approver,
      approvedAt: new Date().toISOString(),
    });

    auditLogger.log({
      actor: approver,
      action: 'approve_proposal_for_planning',
      projectId,
      details: { approvedAt: new Date().toISOString() },
    });

    return updated;
  }

  /**
   * Phase 2: Requirements & Architecture Planning
   */
  public async planProject(projectId: string): Promise<{
    prd: ProductRequirementDocument;
    architecture: ArchitecturePlan;
  }> {
    this.checkEmergencyStop();
    const project = factoryDatabase.getProject(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);

    if (project.status !== 'planning' && project.status !== 'approved') {
      throw new Error(`Project must be in 'planning' or 'approved' state, current state: ${project.status}`);
    }

    const proposal = factoryDatabase.getProposal(projectId);
    if (!proposal) throw new Error(`Proposal not found for project: ${projectId}`);

    // Generate PRD
    const prd = await productAgent.generatePRD(proposal);
    factoryDatabase.savePRD(prd);

    // Generate Architecture
    const architecture = await architectureAgent.designArchitecture(prd, project.projectType);
    factoryDatabase.saveArchitecture(architecture);

    return { prd, architecture };
  }

  /**
   * Human Gate 2: Approve Architecture to start development
   */
  public approveDevelopment(projectId: string, approver: string): FactoryProject {
    this.checkEmergencyStop();
    return factoryDatabase.updateProject(projectId, {
      status: 'developing',
      approvedBy: approver,
      approvedAt: new Date().toISOString(),
    });
  }

  /**
   * Phase 3: Coding and Sandbox Execution
   */
  public async developTasks(
    projectId: string,
    tasksToRun: Array<{
      taskIndex: number;
      files: CodeFilePayload[];
    }>
  ): Promise<FactoryProject> {
    this.checkEmergencyStop();
    const project = factoryDatabase.getProject(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);

    if (project.status !== 'developing') {
      throw new Error(`Project must be in 'developing' state, current state: ${project.status}`);
    }

    const arch = factoryDatabase.getArchitecture(projectId);
    if (!arch) throw new Error(`Architecture plan not found for project: ${projectId}`);

    const workspace = sandboxEngine.createWorkspace(projectId);

    for (const item of tasksToRun) {
      this.checkBudget(project);

      const taskItem = arch.implementationTasks[item.taskIndex];
      if (!taskItem) continue;

      await codingAgent.executeTask(projectId, workspace.workspaceDir, taskItem, item.files);

      // Increment consumed iterations & tokens
      project.budgetConfig.consumedIterations += 1;
      project.budgetConfig.consumedTokens += 1500;
      factoryDatabase.updateProject(projectId, { budgetConfig: project.budgetConfig });
    }

    return factoryDatabase.getProject(projectId)!;
  }

  /**
   * Phase 4: Testing & Security Audits
   */
  public async verifySoftware(
    projectId: string,
    testOptions?: Partial<RunTestsOptions>
  ): Promise<{
    testReport: TestReport;
    securityReport: SecurityReport;
  }> {
    this.checkEmergencyStop();
    const project = factoryDatabase.getProject(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);

    factoryDatabase.updateProject(projectId, { status: 'testing' });

    const workspace = sandboxEngine.createWorkspace(projectId);

    // 1. Run Tests
    const testReport = await testingAgent.runTests({
      projectId,
      workspaceDir: workspace.workspaceDir,
      ...testOptions,
    });
    factoryDatabase.saveTestReport(testReport);

    if (testReport.status !== 'passed' || testReport.failed > 0) {
      factoryDatabase.updateProject(projectId, { status: 'failed' });
      throw new Error(`Automated testing failed: ${testReport.failed} failed test suites.`);
    }

    // 2. Run Security & Licensing Audit
    factoryDatabase.updateProject(projectId, { status: 'security_review' });
    const securityReport = await securityAgent.performAudit(
      projectId,
      workspace.workspaceDir,
      project.license
    );
    factoryDatabase.saveSecurityReport(securityReport);

    if (securityReport.isBlocked) {
      factoryDatabase.updateProject(projectId, { status: 'failed' });
      throw new Error(`Security review blocked project release.`);
    }

    return { testReport, securityReport };
  }

  /**
   * Phase 5: Documentation & Release Candidate Packaging
   */
  public async stageRelease(
    projectId: string,
    docContext: ProjectDocContext,
    version: string,
    filesToPackage: string[]
  ): Promise<ReleaseCandidate> {
    this.checkEmergencyStop();
    const project = factoryDatabase.getProject(projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);

    const testReport = factoryDatabase.getTestReport(projectId);
    if (!testReport) throw new Error(`TestReport missing for project: ${projectId}`);

    const securityReport = factoryDatabase.getSecurityReport(projectId);
    if (!securityReport) throw new Error(`SecurityReport missing for project: ${projectId}`);

    const workspace = sandboxEngine.createWorkspace(projectId);

    // Generate documentation package
    documentationAgent.generateDocs(workspace.workspaceDir, docContext);

    // Stage release candidate
    const candidate = await releaseAgent.prepareRelease({
      projectId,
      projectName: project.name,
      version,
      distDir: workspace.distDir,
      filesToPackage,
      changelogNotes: docContext.features,
      testReport,
      securityReport,
      repoUrl: project.repositoryUrl,
    });

    factoryDatabase.saveReleaseCandidate(candidate);
    factoryDatabase.updateProject(projectId, { status: 'release_approval' });

    return candidate;
  }

  /**
   * Human Gate 3: Approve Release Candidate
   */
  public approveReleaseCandidate(
    projectId: string,
    releaseId: string,
    approver: string,
    comments?: string
  ): ReleaseCandidate {
    this.checkEmergencyStop();
    const candidate = factoryDatabase.getReleaseCandidate(releaseId);
    if (!candidate) throw new Error(`Release candidate not found: ${releaseId}`);

    const approvedCandidate: ReleaseCandidate = {
      ...candidate,
      status: 'approved',
      approvalRecord: {
        approvedBy: approver,
        approvedAt: new Date().toISOString(),
        comments: comments || 'Approved by human reviewer.',
      },
    };

    factoryDatabase.saveReleaseCandidate(approvedCandidate);
    factoryDatabase.updateProject(projectId, {
      status: 'approved',
      approvedBy: approver,
      approvedAt: new Date().toISOString(),
    });

    return approvedCandidate;
  }

  /**
   * Phase 6: Publish Verified Project to Astro
   */
  public async publishProject(
    publishArgs: PublishProjectArgs
  ): Promise<{ publishedSlug: string; publishedFilePath: string }> {
    this.checkEmergencyStop();

    const candidate = publishArgs.releaseCandidate;
    if (candidate.status !== 'approved' || !candidate.approvalRecord) {
      throw new Error('Cannot publish unapproved release candidate.');
    }

    const res = await publishingAgent.publishToAstro(publishArgs);

    factoryDatabase.updateProject(publishArgs.project.id, {
      status: 'published',
    });

    return res;
  }
}

export const factoryOrchestrator = new FactoryOrchestrator();
