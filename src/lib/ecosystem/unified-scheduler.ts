/**
 * AI Satellite — Phase 19 Unified Automation Scheduler
 * Consolidates background jobs across discovery, verification, SEO, reliability,
 * and search indexing into an idempotent, conflict-free scheduler.
 * Permanent Canonical Domain: https://aisatellite.dev
 */

import type { ScheduledJobConfig } from './types';
import { ecosystemDatabase, EcosystemDatabase } from './database';
import { platformEventBus } from './event-bus';

export class UnifiedScheduler {
  private db: EcosystemDatabase;
  private runningJobs: Set<string> = new Set();

  constructor(db?: EcosystemDatabase) {
    this.db = db || ecosystemDatabase;
  }

  public getJobs(): ScheduledJobConfig[] {
    return this.db.getScheduledJobs();
  }

  public async triggerJob(jobId: string): Promise<{ success: boolean; job?: ScheduledJobConfig; error?: string }> {
    const jobs = this.db.getScheduledJobs();
    const job = jobs.find((j) => j.id === jobId);
    if (!job) {
      return { success: false, error: 'JOB_NOT_FOUND' };
    }

    // Idempotency: Prevent concurrent execution of the exact same job
    if (this.runningJobs.has(jobId) || job.status === 'running') {
      return { success: false, error: 'JOB_ALREADY_RUNNING' };
    }

    this.runningJobs.add(jobId);
    job.status = 'running';
    job.lastRun = new Date().toISOString();
    this.db.updateScheduledJob(job);

    try {
      // Simulate specialized job execution
      switch (job.category) {
        case 'discovery':
          platformEventBus.publish('ResourceUpdated', { jobId, action: 'discovery_scanned' }, 'Scheduler');
          break;
        case 'search':
          platformEventBus.publish('SearchIndexRefreshRequested', { jobId }, 'Scheduler');
          break;
        case 'verification':
          platformEventBus.publish('ResourceVerified', { jobId, action: 'licenses_audited' }, 'Scheduler');
          break;
        default:
          break;
      }

      job.status = 'completed';
      job.retryCount = 0;
      job.nextRun = new Date(Date.now() + job.cronIntervalMinutes * 60000).toISOString();
      this.db.updateScheduledJob(job);

      return { success: true, job };
    } catch (err: any) {
      job.status = 'failed';
      job.retryCount += 1;
      this.db.updateScheduledJob(job);
      return { success: false, job, error: err.message };
    } finally {
      this.runningJobs.delete(jobId);
    }
  }

  public scheduleNextRun(jobId: string, delayMinutes: number): void {
    const jobs = this.db.getScheduledJobs();
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      job.nextRun = new Date(Date.now() + delayMinutes * 60000).toISOString();
      this.db.updateScheduledJob(job);
    }
  }
}

export const unifiedScheduler = new UnifiedScheduler();
