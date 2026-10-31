import fs from 'node:fs';
import path from 'node:path';
import {
  FactoryProjectSchema,
  AgentTaskSchema,
  ProductProposalSchema,
  PRDSchema,
  ArchitecturePlanSchema,
  BuildRunSchema,
  TestReportSchema,
  SecurityReportSchema,
  ReleaseCandidateSchema,
  MaintenanceTaskSchema,
  type FactoryProject,
  type FactoryProjectInput,
  type FactoryProjectStatus,
  type AgentTask,
  type ProductProposal,
  type ProductRequirementDocument,
  type ArchitecturePlan,
  type BuildRun,
  type TestReport,
  type SecurityReport,
  type ReleaseCandidate,
  type MaintenanceTask,
} from '../schemas/index.js';
import { auditLogger } from '../monitoring/audit-logger.js';

export class FactoryDatabase {
  private baseDir: string;

  constructor(customDir?: string) {
    this.baseDir = customDir || path.resolve(process.cwd(), 'data', 'factory');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  private getFilePath(collection: string): string {
    return path.join(this.baseDir, `${collection}.json`);
  }

  private readCollection<T>(collection: string): T[] {
    const file = this.getFilePath(collection);
    if (!fs.existsSync(file)) return [];
    try {
      const data = fs.readFileSync(file, 'utf-8');
      return JSON.parse(data) as T[];
    } catch {
      return [];
    }
  }

  private writeCollection<T>(collection: string, items: T[]): void {
    const file = this.getFilePath(collection);
    fs.writeFileSync(file, JSON.stringify(items, null, 2), 'utf-8');
  }

  // ==========================================
  // Project Management & State Transitions
  // ==========================================

  createProject(project: FactoryProjectInput): FactoryProject {
    const validated = FactoryProjectSchema.parse(project);
    const existing = this.readCollection<FactoryProject>('projects');
    const idx = existing.findIndex((p) => p.id === validated.id);
    if (idx >= 0) {
      existing[idx] = validated;
    } else {
      existing.push(validated);
    }
    this.writeCollection('projects', existing);

    auditLogger.log('System', 'CREATE_PROJECT', { projectId: validated.id, name: validated.name }, validated.id);
    return validated;
  }

  getProject(id: string): FactoryProject | undefined {
    let project = this.readCollection<FactoryProject>('projects').find((p) => p.id === id);
    if (!project) {
      project = this.readCollection<FactoryProject>('projects').find((p) => p.id === id);
    }
    return project;
  }

  getAllProjects(): FactoryProject[] {
    return this.readCollection<FactoryProject>('projects');
  }

  listProjects(): FactoryProject[] {
    return this.getAllProjects();
  }

  updateProject(projectId: string, patch: Partial<FactoryProject>): FactoryProject {
    let projects = this.readCollection<FactoryProject>('projects');
    let idx = projects.findIndex((p) => p.id === projectId);
    if (idx === -1) {
      projects = this.readCollection<FactoryProject>('projects');
      idx = projects.findIndex((p) => p.id === projectId);
      if (idx === -1) throw new Error(`Project ${projectId} not found`);
    }

    const current = projects[idx];
    const updated: FactoryProject = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    projects[idx] = updated;
    this.writeCollection('projects', projects);
    return updated;
  }

  updateProjectStatus(
    projectId: string,
    newStatus: FactoryProjectStatus,
    actor = 'System',
    extraMeta?: { approvedBy?: string; rejectionReason?: string }
  ): FactoryProject {
    const projects = this.readCollection<FactoryProject>('projects');
    const idx = projects.findIndex((p) => p.id === projectId);
    if (idx === -1) throw new Error(`Project ${projectId} not found`);

    const current = projects[idx];

    // State Transition Boundary Validation
    this.validateStateTransition(current.status, newStatus, current, extraMeta);

    const updated: FactoryProject = {
      ...current,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      approvedBy: extraMeta?.approvedBy || current.approvedBy,
      approvedAt: extraMeta?.approvedBy ? new Date().toISOString() : current.approvedAt,
      rejectionReason: extraMeta?.rejectionReason || current.rejectionReason,
    };

    FactoryProjectSchema.parse(updated);
    projects[idx] = updated;
    this.writeCollection('projects', projects);

    auditLogger.log(actor, 'UPDATE_PROJECT_STATUS', { from: current.status, to: newStatus, extraMeta }, projectId);
    return updated;
  }

  private validateStateTransition(
    current: FactoryProjectStatus,
    target: FactoryProjectStatus,
    project: FactoryProject,
    extraMeta?: { approvedBy?: string }
  ): void {
    if (current === target) return;

    // Paused / Failed can occur from any active state
    if (target === 'paused' || target === 'failed') return;
    if (current === 'paused') return; // Can resume

    // Strict Stage Gates
    if (target === 'planning' || target === 'developing') {
      if (!project.approvedBy && !extraMeta?.approvedBy && current !== 'approved') {
        throw new Error(`Security Gate Blocked: Project ${project.id} must be approved by an authorized human before development.`);
      }
    }

    if (target === 'published') {
      if (current !== 'release_approval') {
        throw new Error(`Release Gate Blocked: Cannot publish project directly from "${current}". Must be in "release_approval" state.`);
      }
      if (!project.approvedBy && !extraMeta?.approvedBy) {
        throw new Error(`Release Gate Blocked: Human authorization required before public release.`);
      }
    }
  }

  // ==========================================
  // Agent Tasks
  // ==========================================

  saveTask(task: AgentTask): AgentTask {
    const validated = AgentTaskSchema.parse(task);
    const tasks = this.readCollection<AgentTask>('tasks');
    const idx = tasks.findIndex((t) => t.taskId === validated.taskId);
    if (idx >= 0) {
      tasks[idx] = validated;
    } else {
      tasks.push(validated);
    }
    this.writeCollection('tasks', tasks);
    return validated;
  }

  getTasksByProject(projectId: string): AgentTask[] {
    return this.readCollection<AgentTask>('tasks').filter((t) => t.projectId === projectId);
  }

  getTask(taskId: string): AgentTask | undefined {
    return this.readCollection<AgentTask>('tasks').find((t) => t.taskId === taskId);
  }

  // ==========================================
  // Proposals & PRDs
  // ==========================================

  saveProposal(proposal: ProductProposal): ProductProposal {
    const validated = ProductProposalSchema.parse(proposal);
    const list = this.readCollection<ProductProposal>('proposals');
    const idx = list.findIndex((p) => p.proposalId === validated.proposalId);
    if (idx >= 0) list[idx] = validated;
    else list.push(validated);
    this.writeCollection('proposals', list);
    return validated;
  }

  getProposal(id: string): ProductProposal | undefined {
    return this.readCollection<ProductProposal>('proposals').find((p) => p.proposalId === id || p.projectId === id);
  }

  savePRD(prd: ProductRequirementDocument): ProductRequirementDocument {
    const validated = PRDSchema.parse(prd);
    const list = this.readCollection<ProductRequirementDocument>('prds');
    const idx = list.findIndex((p) => p.prdId === validated.prdId);
    if (idx >= 0) list[idx] = validated;
    else list.push(validated);
    this.writeCollection('prds', list);
    return validated;
  }

  getPRD(id: string): ProductRequirementDocument | undefined {
    return this.readCollection<ProductRequirementDocument>('prds').find((p) => p.prdId === id || p.projectId === id);
  }

  getPRDByProject(projectId: string): ProductRequirementDocument | undefined {
    return this.getPRD(projectId);
  }

  // ==========================================
  // Architecture & Implementation Plans
  // ==========================================

  saveArchitecture(arch: ArchitecturePlan): ArchitecturePlan {
    const validated = ArchitecturePlanSchema.parse(arch);
    const list = this.readCollection<ArchitecturePlan>('architectures');
    const idx = list.findIndex((a) => a.planId === validated.planId);
    if (idx >= 0) list[idx] = validated;
    else list.push(validated);
    this.writeCollection('architectures', list);
    return validated;
  }

  getArchitecture(id: string): ArchitecturePlan | undefined {
    return this.readCollection<ArchitecturePlan>('architectures').find((a) => a.planId === id || a.projectId === id);
  }

  getArchitectureByProject(projectId: string): ArchitecturePlan | undefined {
    return this.getArchitecture(projectId);
  }

  // ==========================================
  // Builds, Tests & Security Reports
  // ==========================================

  saveBuild(build: BuildRun): BuildRun {
    const validated = BuildRunSchema.parse(build);
    const list = this.readCollection<BuildRun>('builds');
    const idx = list.findIndex((b) => b.buildId === validated.buildId);
    if (idx >= 0) list[idx] = validated;
    else list.push(validated);
    this.writeCollection('builds', list);
    return validated;
  }

  saveTestReport(report: TestReport): TestReport {
    const validated = TestReportSchema.parse(report);
    const list = this.readCollection<TestReport>('test-reports');
    const idx = list.findIndex((r) => r.testId === validated.testId);
    if (idx >= 0) list[idx] = validated;
    else list.push(validated);
    this.writeCollection('test-reports', list);
    return validated;
  }

  getTestReport(id: string): TestReport | undefined {
    return this.readCollection<TestReport>('test-reports').find((r) => r.testId === id || r.projectId === id);
  }

  saveSecurityReport(report: SecurityReport): SecurityReport {
    const validated = SecurityReportSchema.parse(report);
    const list = this.readCollection<SecurityReport>('security-reports');
    const idx = list.findIndex((r) => r.reportId === validated.reportId);
    if (idx >= 0) list[idx] = validated;
    else list.push(validated);
    this.writeCollection('security-reports', list);
    return validated;
  }

  getSecurityReport(id: string): SecurityReport | undefined {
    return this.readCollection<SecurityReport>('security-reports').find((r) => r.reportId === id || r.projectId === id);
  }

  getLatestSecurityReport(projectId: string): SecurityReport | undefined {
    return this.getSecurityReport(projectId);
  }

  // ==========================================
  // Release Candidates
  // ==========================================

  saveReleaseCandidate(candidate: ReleaseCandidate): ReleaseCandidate {
    const validated = ReleaseCandidateSchema.parse(candidate);
    const list = this.readCollection<ReleaseCandidate>('release-candidates');
    const idx = list.findIndex((r) => r.releaseId === validated.releaseId);
    if (idx >= 0) list[idx] = validated;
    else list.push(validated);
    this.writeCollection('release-candidates', list);
    return validated;
  }

  getReleaseCandidate(id: string): ReleaseCandidate | undefined {
    return this.readCollection<ReleaseCandidate>('release-candidates').find((r) => r.releaseId === id || r.projectId === id);
  }

  getLatestReleaseCandidate(projectId: string): ReleaseCandidate | undefined {
    const list = this.readCollection<ReleaseCandidate>('release-candidates')
      .filter((r) => r.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list[0];
  }

  // ==========================================
  // Maintenance Tasks
  // ==========================================

  saveMaintenanceTask(task: MaintenanceTask): MaintenanceTask {
    const validated = MaintenanceTaskSchema.parse(task);
    const list = this.readCollection<MaintenanceTask>('maintenance');
    const idx = list.findIndex((m) => m.maintenanceId === validated.maintenanceId);
    if (idx >= 0) list[idx] = validated;
    else list.push(validated);
    this.writeCollection('maintenance', list);
    return validated;
  }

  getAllMaintenanceTasks(): MaintenanceTask[] {
    return this.readCollection<MaintenanceTask>('maintenance');
  }
}

export const factoryDb = new FactoryDatabase();
export const factoryDatabase = factoryDb;
