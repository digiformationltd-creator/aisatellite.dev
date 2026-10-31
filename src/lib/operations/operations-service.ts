/**
 * AI Satellite — Operations Service Orchestrator (Phase 10)
 * Unified administrative backend for the Operations Command Center, integrating health,
 * intelligence, verification, freshness, SEO/AEO/GEO, DevEx, security, tickets, and costs.
 */

import { websiteHealthMonitor } from './health-monitor';
import { technologyIntelligenceMonitor } from './technology-intelligence';
import { freeAlternativesVerificationEngine } from './alternatives-verification';
import { contentFreshnessEngine } from './content-freshness';
import { searchOptimizationEngine } from './search-optimization';
import { devExMonitor } from './devex-monitor';
import { securityMonitor } from './security-monitor';
import { autonomousImprovementPlanner } from './improvement-planner';
import { controlledFixesEngine } from './controlled-fixes';
import { costAndSchedulerEngine } from './cost-and-scheduler';
import { domainVerificationManager } from '../domain/domain-verification';

export interface OperationsAdminReport {
  timestamp: string;
  domainStatus: ReturnType<typeof domainVerificationManager.evaluateStatus>;
  systemHealth: ReturnType<typeof websiteHealthMonitor.evaluateSystemHealth>;
  unresolvedIncidents: ReturnType<typeof websiteHealthMonitor.getIncidents>;
  pendingTechnologyChanges: ReturnType<typeof technologyIntelligenceMonitor.getPendingReviews>;
  alternativeVerifications: ReturnType<typeof freeAlternativesVerificationEngine.getAllVerifications>;
  freshnessAlerts: ReturnType<typeof contentFreshnessEngine.auditFreshness>;
  seoAuditFindings: ReturnType<typeof searchOptimizationEngine.getAllFindings>;
  searchConsoleStatus: ReturnType<typeof searchOptimizationEngine.getSearchConsoleStatus>;
  bingStatus: ReturnType<typeof searchOptimizationEngine.getBingStatus>;
  devexSignals: ReturnType<typeof devExMonitor.getUnresolvedIncidents>;
  securityFindings: ReturnType<typeof securityMonitor.getAllFindings>;
  improvementTickets: ReturnType<typeof autonomousImprovementPlanner.getTicketsByPriority>;
  rollbackSnapshots: ReturnType<typeof controlledFixesEngine.getAllSnapshots>;
  scheduledJobs: ReturnType<typeof costAndSchedulerEngine.getJobs>;
  costBudget: ReturnType<typeof costAndSchedulerEngine.getBudget>;
}

export class OperationsService {
  private validSessionTokens: Set<string> = new Set([
    'ops-session-root-token',
    'lead-architect-token',
    'lead-editor-token',
  ]);

  /**
   * Validates authentication for private operations routes.
   */
  public authenticateSession(token?: string): { isAuthenticated: boolean; role?: string } {
    if (!token) {
      return { isAuthenticated: false };
    }

    if (token === 'ops-session-root-token') {
      return { isAuthenticated: true, role: 'Site Administrator' };
    }
    if (token === 'lead-architect-token') {
      return { isAuthenticated: true, role: 'Principal Architect' };
    }
    if (token === 'lead-editor-token') {
      return { isAuthenticated: true, role: 'Lead Technical Editor' };
    }

    return { isAuthenticated: false };
  }

  /**
   * Generates a unified operations report.
   */
  public generateFullReport(): OperationsAdminReport {
    // Run automated audits
    searchOptimizationEngine.runTechnicalSEOAudit();
    securityMonitor.auditSecurityHeaders();
    contentFreshnessEngine.auditFreshness(30);

    return {
      timestamp: new Date().toISOString(),
      domainStatus: domainVerificationManager.evaluateStatus(),
      systemHealth: websiteHealthMonitor.evaluateSystemHealth(),
      unresolvedIncidents: websiteHealthMonitor.getIncidents('detected'),
      pendingTechnologyChanges: technologyIntelligenceMonitor.getPendingReviews(),
      alternativeVerifications: freeAlternativesVerificationEngine.getAllVerifications(),
      freshnessAlerts: contentFreshnessEngine.auditFreshness(30),
      seoAuditFindings: searchOptimizationEngine.getAllFindings(),
      searchConsoleStatus: searchOptimizationEngine.getSearchConsoleStatus(),
      bingStatus: searchOptimizationEngine.getBingStatus(),
      devexSignals: devExMonitor.getUnresolvedIncidents(),
      securityFindings: securityMonitor.getAllFindings(),
      improvementTickets: autonomousImprovementPlanner.getTicketsByPriority(),
      rollbackSnapshots: controlledFixesEngine.getAllSnapshots(),
      scheduledJobs: costAndSchedulerEngine.getJobs(),
      costBudget: costAndSchedulerEngine.getBudget(),
    };
  }
}

export const operationsService = new OperationsService();
