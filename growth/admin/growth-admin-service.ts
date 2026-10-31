import { GROWTH_CONFIG } from '../config/growth-config.js';
import { GrowthLogger } from '../monitoring/growth-logger.js';
import { growthStorage } from '../storage/growth-storage.js';
import { technicalSEOAuditor } from '../seo/technical-seo-auditor.js';
import { searchConsoleClient } from '../search-console/search-console-client.js';
import { contentClusterPlanner } from '../content-clusters/cluster-planner.js';
import { distributionQueue } from '../distribution/queue/distribution-queue.js';
import { repositoryOptimizer } from '../github-community/repository-optimizer.js';
import { subscriberManager } from '../newsletter/subscriber-manager.js';
import { newsletterDigestGenerator } from '../newsletter/digest-generator.js';
import { communitySubmissionManager } from '../submissions/submission-manager.js';
import { privacyAnalytics } from '../analytics/privacy-analytics.js';
import type {
  DistributionJob,
  SubmissionStatus,
} from '../schemas/index.js';

export interface AdminAuthResult {
  isAuthenticated: boolean;
  user?: { username: string; role: 'admin' | 'editor' | 'viewer' };
  error?: string;
}

export class GrowthAdminService {
  private logger: GrowthLogger;

  constructor(baseDir = process.cwd()) {
    this.logger = new GrowthLogger('GrowthAdminService', baseDir);
  }

  /**
   * Verifies admin authentication token or credentials
   */
  authenticate(token?: string): AdminAuthResult {
    if (!token) {
      return { isAuthenticated: false, error: 'Authentication token required' };
    }

    if (token === GROWTH_CONFIG.admin.adminToken) {
      return {
        isAuthenticated: true,
        user: { username: 'lead-growth-architect', role: 'admin' },
      };
    }

    return { isAuthenticated: false, error: 'Invalid or expired administration credentials' };
  }

  /**
   * Aggregates all growth systems status for the dashboard
   */
  async getDashboardOverview(token: string) {
    const auth = this.authenticate(token);
    if (!auth.isAuthenticated) {
      throw new Error(`Unauthorized: ${auth.error}`);
    }

    const gscStatus = searchConsoleClient.getConnectionStatus();
    const seoFindings = growthStorage.getSEOFindings();
    const searchPerf = await searchConsoleClient.fetchSearchPerformance();
    const opportunities = growthStorage.getOpportunities();
    const clusters = growthStorage.getClusters();
    const queue = growthStorage.getDistributionQueue();
    const repoHealth = growthStorage.getRepoHealth();
    const subscribers = growthStorage.getSubscribers();
    const submissions = growthStorage.getSubmissions();
    const analytics = privacyAnalytics.generateSummaryReport();
    const connectedAccounts = growthStorage.getConnectedAccounts();

    return {
      status: 'healthy',
      auth: auth.user,
      metrics: {
        totalIndexedRoutes: 162,
        openSeoFindings: seoFindings.filter((f) => f.status === 'detected').length,
        searchImpressions: searchPerf.reduce((acc, r) => acc + r.impressions, 0),
        searchClicks: searchPerf.reduce((acc, r) => acc + r.clicks, 0),
        activeSubscribers: subscribers.filter((s) => s.status === 'active').length,
        pendingDistributions: queue.filter((j) => j.status === 'draft' || j.status === 'awaiting_review').length,
        pendingSubmissions: submissions.filter((s) => s.status === 'pending').length,
        githubHealthScore: repoHealth[0]?.healthScore ?? 90,
      },
      sections: {
        gscStatus,
        seoFindings: seoFindings.slice(0, 10),
        opportunities: opportunities.slice(0, 5),
        clusters: clusters.slice(0, 6),
        queue: queue.slice(0, 8),
        connectedAccounts,
        recentSubmissions: submissions.slice(0, 5),
        analyticsSummary: analytics,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Administrative Actions
   */
  approveDistribution(jobId: string, token: string): DistributionJob {
    const auth = this.authenticate(token);
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      throw new Error('Forbidden: Administrative role required to approve distribution jobs');
    }
    return distributionQueue.approveJob(jobId, auth.user.username);
  }

  rejectDistribution(jobId: string, reason: string, token: string): DistributionJob {
    const auth = this.authenticate(token);
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      throw new Error('Forbidden: Administrative role required to reject distribution jobs');
    }
    return distributionQueue.rejectJob(jobId, reason, auth.user.username);
  }

  async processDistribution(jobId: string, token: string): Promise<DistributionJob> {
    const auth = this.authenticate(token);
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      throw new Error('Forbidden: Administrative role required to dispatch distribution jobs');
    }
    return distributionQueue.processJob(jobId);
  }

  async retryDistribution(jobId: string, token: string): Promise<DistributionJob> {
    const auth = this.authenticate(token);
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      throw new Error('Forbidden: Administrative role required to retry distribution jobs');
    }
    return distributionQueue.retryJob(jobId);
  }

  moderateSubmission(submissionId: string, action: SubmissionStatus, notes: string, token: string) {
    const auth = this.authenticate(token);
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      throw new Error('Forbidden: Administrative role required to moderate submissions');
    }
    return communitySubmissionManager.moderateSubmission(submissionId, action, auth.user.username, notes);
  }

  runFullSEOAudit(token: string) {
    const auth = this.authenticate(token);
    if (!auth.isAuthenticated || auth.user?.role !== 'admin') {
      throw new Error('Forbidden: Administrative role required to execute SEO audits');
    }
    return technicalSEOAuditor.runAudit();
  }
}

export const growthAdminService = new GrowthAdminService();
