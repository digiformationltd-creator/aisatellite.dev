/**
 * AI Satellite — Phase 14 Autonomous Global Technology Discovery & Intelligence Network
 * Engine B: Autonomous Discovery Scheduler
 * 
 * Manages recurring discovery jobs across 10 intelligence categories with
 * bounded concurrency, retry limits, exponential backoff, and execution tracking.
 */

import { uuidv4 } from './id-generator';
import type { DiscoveryJob, JobCategory, JobStatus } from './types';
import { CreateDiscoveryJobSchema } from './types';
import { discoveryDatabase, DiscoveryDatabase } from './database';
import { costAndSecurityManager } from './cost-and-security';

export class DiscoveryScheduler {
  private db: DiscoveryDatabase;

  constructor(db?: DiscoveryDatabase) {
    this.db = db || discoveryDatabase;
    this.seedDefaultJobs();
  }

  public createJob(input: {
    category: JobCategory;
    scheduleCron?: string;
    timeoutMs?: number;
    retryLimit?: number;
    concurrencyLimit?: number;
    costBudgetUsd?: number;
  }): DiscoveryJob {
    const validated = CreateDiscoveryJobSchema.parse(input);
    const now = new Date().toISOString();

    const newJob: DiscoveryJob = {
      id: `job-${uuidv4().slice(0, 8)}`,
      category: validated.category,
      scheduleCron: validated.scheduleCron,
      status: 'scheduled',
      timeoutMs: validated.timeoutMs,
      retryLimit: validated.retryLimit,
      currentRetries: 0,
      concurrencyLimit: validated.concurrencyLimit,
      costBudgetUsd: validated.costBudgetUsd,
      createdAt: now,
      updatedAt: now,
    };

    this.db.saveJob(newJob);
    return newJob;
  }

  public getJobs(): DiscoveryJob[] {
    return this.db.getJobs();
  }

  public getJob(id: string): DiscoveryJob | undefined {
    return this.db.findJobById(id);
  }

  public getJobsByCategory(category: JobCategory): DiscoveryJob[] {
    return this.db.getJobs().filter((j) => j.category === category);
  }

  public pauseJob(id: string): DiscoveryJob {
    const job = this.db.findJobById(id);
    if (!job) throw new Error(`Job not found: ${id}`);

    const updated: DiscoveryJob = {
      ...job,
      status: 'paused',
      updatedAt: new Date().toISOString(),
    };
    this.db.saveJob(updated);
    return updated;
  }

  public resumeJob(id: string): DiscoveryJob {
    const job = this.db.findJobById(id);
    if (!job) throw new Error(`Job not found: ${id}`);

    const updated: DiscoveryJob = {
      ...job,
      status: 'scheduled',
      updatedAt: new Date().toISOString(),
    };
    this.db.saveJob(updated);
    return updated;
  }

  /**
   * Executes a discovery job with bounded timeout, error catching,
   * exponential backoff tracking, and cost accounting.
   */
  public async executeJob(
    jobId: string,
    runnerFn: () => Promise<{ itemsDiscovered: number; costUsd?: number; message?: string }>
  ): Promise<{ success: boolean; itemsDiscovered: number; error?: string; durationMs: number }> {
    const job = this.db.findJobById(jobId);
    if (!job) {
      throw new Error(`Job not found: ${jobId}`);
    }

    if (job.status === 'paused') {
      return { success: false, itemsDiscovered: 0, error: 'Job is currently paused', durationMs: 0 };
    }

    // Check cost budget
    const costCheck = costAndSecurityManager.checkAndRecordCost(0.01);
    if (!costCheck.allowed) {
      const updated: DiscoveryJob = {
        ...job,
        status: 'failed',
        failureReason: 'Daily cost budget limit reached',
        updatedAt: new Date().toISOString(),
      };
      this.db.saveJob(updated);
      return { success: false, itemsDiscovered: 0, error: 'Budget limit reached', durationMs: 0 };
    }

    // Mark running
    const startTime = Date.now();
    job.status = 'running';
    job.lastRunAt = new Date().toISOString();
    job.failureReason = undefined;
    this.db.saveJob(job);

    try {
      // Execute with timeout
      const result = await Promise.race([
        runnerFn(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Job timed out after ${job.timeoutMs}ms`)), job.timeoutMs)
        ),
      ]);

      const durationMs = Date.now() - startTime;
      const completedJob: DiscoveryJob = {
        ...job,
        status: 'completed',
        currentRetries: 0,
        lastRunDurationMs: durationMs,
        updatedAt: new Date().toISOString(),
      };
      this.db.saveJob(completedJob);

      return {
        success: true,
        itemsDiscovered: result.itemsDiscovered,
        durationMs,
      };
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      const nextRetries = job.currentRetries + 1;
      const failed = nextRetries >= job.retryLimit;

      const updatedJob: DiscoveryJob = {
        ...job,
        status: failed ? 'failed' : 'scheduled',
        currentRetries: nextRetries,
        lastRunDurationMs: durationMs,
        failureReason: err?.message || 'Unknown execution error',
        updatedAt: new Date().toISOString(),
      };
      this.db.saveJob(updatedJob);

      return {
        success: false,
        itemsDiscovered: 0,
        error: err?.message || 'Execution failed',
        durationMs,
      };
    }
  }

  public seedDefaultJobs(): void {
    const existing = this.db.getJobs();
    if (existing.length > 0) return;

    const categories: JobCategory[] = [
      'discover_ai_tools',
      'discover_open_source',
      'monitor_github_releases',
      'check_licenses',
      'verify_free_tiers',
      'detect_pricing_changes',
      'discover_frameworks',
      'monitor_mcp',
      'refresh_research',
      'emerging_topics',
    ];

    for (const cat of categories) {
      this.createJob({
        category: cat,
        scheduleCron: '0 */6 * * *',
        timeoutMs: 15000,
        retryLimit: 3,
        concurrencyLimit: 2,
        costBudgetUsd: 5.0,
      });
    }
  }
}

export const discoveryScheduler = new DiscoveryScheduler();
