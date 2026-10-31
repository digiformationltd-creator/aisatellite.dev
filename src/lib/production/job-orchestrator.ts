/**
 * AI SATELLITE — PHASE 23 CONTENT PRODUCTION JOB ORCHESTRATOR
 * Reliable background job queue, retry policies, failure handling, and concurrency governance.
 * Canonical Domain: https://aisatellite.dev
 */

import type { EditorialProductionJob, JobStatus } from './types';
import type { ArticleBrief } from '../editorial/types';
import { editorialPipeline, type PipelineExecutionResult } from './pipeline';

export class ProductionJobOrchestrator {
  private static instance: ProductionJobOrchestrator;

  private jobStore: Map<string, EditorialProductionJob> = new Map();
  private maxRetries = 3;

  public static getInstance(): ProductionJobOrchestrator {
    if (!ProductionJobOrchestrator.instance) {
      ProductionJobOrchestrator.instance = new ProductionJobOrchestrator();
    }
    return ProductionJobOrchestrator.instance;
  }

  /**
   * Enqueues or executes an article production job with idempotency.
   */
  public async submitJob(brief: ArticleBrief): Promise<PipelineExecutionResult> {
    const existingJob = Array.from(this.jobStore.values()).find(
      (j) => j.articleId === brief.articleId && (j.status === 'RUNNING' || j.status === 'PAUSED' || j.status === 'COMPLETED')
    );

    if (existingJob && existingJob.status === 'COMPLETED') {
      return {
        job: existingJob,
        isCompleted: true,
        isAwaitingHumanApproval: false,
      };
    }

    const result = await editorialPipeline.executePipeline(brief);
    this.jobStore.set(result.job.jobId, result.job);
    return result;
  }

  /**
   * Retries a failed job safely adhering to maxRetries.
   */
  public async retryJob(jobId: string): Promise<PipelineExecutionResult> {
    const job = this.jobStore.get(jobId);
    if (!job) {
      throw new Error(`Job not found: ${jobId}`);
    }

    if (job.retryCount >= this.maxRetries) {
      job.status = 'FAILED';
      job.errorLog.push(`Max retry limit of ${this.maxRetries} exceeded. Manual inspection required.`);
      return {
        job,
        isCompleted: false,
        isAwaitingHumanApproval: false,
        errorMessage: 'Max retries exceeded',
      };
    }

    job.retryCount++;
    job.status = 'RUNNING';
    const result = await editorialPipeline.executePipeline(job.brief);
    result.job.jobId = job.jobId;
    result.job.retryCount = job.retryCount;
    this.jobStore.set(job.jobId, result.job);
    return result;
  }

  /**
   * Cancels a job cleanly.
   */
  public cancelJob(jobId: string, reason = 'Cancelled by administrator'): EditorialProductionJob {
    const job = this.jobStore.get(jobId);
    if (!job) {
      throw new Error(`Job not found: ${jobId}`);
    }

    job.status = 'CANCELLED';
    job.auditHistory.push({
      stage: job.currentStage,
      agent: 'Agent L — Publishing Coordinator',
      timestamp: new Date().toISOString(),
      action: `Job cancelled: ${reason}`,
    });
    job.updatedAt = new Date().toISOString();
    return job;
  }

  public getJob(jobId: string): EditorialProductionJob | undefined {
    return this.jobStore.get(jobId);
  }

  public getAllJobs(): EditorialProductionJob[] {
    return Array.from(this.jobStore.values());
  }

  public getJobsByStatus(status: JobStatus): EditorialProductionJob[] {
    return Array.from(this.jobStore.values()).filter((j) => j.status === status);
  }

  public clearAll(): void {
    this.jobStore.clear();
  }
}

export const jobOrchestrator = ProductionJobOrchestrator.getInstance();
