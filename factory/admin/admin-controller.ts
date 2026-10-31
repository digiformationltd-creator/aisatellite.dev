import { factoryDatabase } from '../storage/database';
import { auditLogger } from '../monitoring/audit-logger';
import { factoryOrchestrator } from '../orchestrator/orchestrator';
import { type FactoryProject, type AuditLog } from '../schemas';

export interface AdminAuthResult {
  authenticated: boolean;
  user?: string;
  error?: string;
}

export interface FactoryMetrics {
  totalProjects: number;
  activeProjects: number;
  completedReleases: number;
  emergencyStopped: boolean;
  auditLogsCount: number;
  passRatePercent: number;
}

export class FactoryAdminController {
  private adminToken: string;

  constructor(token?: string) {
    this.adminToken = token || process.env.FACTORY_ADMIN_TOKEN || 'satellite-factory-secret-token';
  }

  public setAdminToken(token: string): void {
    this.adminToken = token;
  }

  public authenticate(authHeaderOrToken?: string): AdminAuthResult {
    if (!authHeaderOrToken) {
      return { authenticated: false, error: 'Authorization header or token is missing.' };
    }

    const token = authHeaderOrToken.startsWith('Bearer ')
      ? authHeaderOrToken.slice(7).trim()
      : authHeaderOrToken.trim();

    if (token === this.adminToken) {
      return { authenticated: true, user: 'admin-lead' };
    }

    return { authenticated: false, error: 'Invalid factory authorization token.' };
  }

  public getMetrics(): FactoryMetrics {
    const projects = factoryDatabase.listProjects();
    const active = projects.filter((p) => p.status !== 'published' && p.status !== 'failed');
    const published = projects.filter((p) => p.status === 'published');
    const logs = auditLogger.getLogs();

    return {
      totalProjects: projects.length,
      activeProjects: active.length,
      completedReleases: published.length,
      emergencyStopped: factoryOrchestrator.isEmergencyStopped(),
      auditLogsCount: logs.length,
      passRatePercent: projects.length > 0 ? Math.round((published.length / projects.length) * 100) : 100,
    };
  }

  public approveProposal(projectId: string, user: string): FactoryProject {
    const project = factoryOrchestrator.approveProposal(projectId, user);
    return project;
  }

  public approveDevelopment(projectId: string, user: string): FactoryProject {
    const project = factoryOrchestrator.approveDevelopment(projectId, user);
    return project;
  }

  public approveRelease(projectId: string, releaseId: string, user: string, comments?: string) {
    return factoryOrchestrator.approveReleaseCandidate(projectId, releaseId, user, comments);
  }

  public triggerEmergencyStop(user: string): { emergencyStopped: boolean } {
    factoryOrchestrator.triggerEmergencyStop();
    auditLogger.log({
      actor: user,
      action: 'admin_emergency_stop',
    });
    return { emergencyStopped: true };
  }

  public resetEmergencyStop(user: string): { emergencyStopped: boolean } {
    factoryOrchestrator.resetEmergencyStop();
    auditLogger.log({
      actor: user,
      action: 'admin_emergency_reset',
    });
    return { emergencyStopped: false };
  }

  public getAuditTrail(projectId?: string): AuditLog[] {
    if (projectId) {
      return auditLogger.getLogsByProject(projectId);
    }
    return auditLogger.getLogs();
  }

  public verifyAuditIntegrity(): { valid: boolean; errors: string[] } {
    return auditLogger.verifyIntegrity();
  }
}

export const factoryAdminController = new FactoryAdminController();
