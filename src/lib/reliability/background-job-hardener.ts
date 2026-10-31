/**
 * AI SATELLITE — BACKGROUND JOB RELIABILITY & IDEMPOTENCY ENGINE
 * Enforces idempotency keys, exponential backoff retries, dead-letter queues (DLQ), and timeout controls.
 */

import crypto from 'node:crypto';
import type {
  BackgroundJob,
  BackgroundJobType,
  DeadLetterJob,
  JobStatus,
} from './types';
import { RegisterJobSchema } from './types';
import { reliabilityDb } from './database';

export class BackgroundJobHardener {
  private activeJobs: Map<string, BackgroundJob> = new Map();

  /**
   * Registers and executes a background job with strict idempotency and retry safeguards.
   */
  public async submitJob(
    jobType: BackgroundJobType,
    idempotencyKey: string,
    payload: Record<string, any>,
    options?: { maxRetries?: number; timeoutMs?: number; backoffFactorMs?: number }
  ): Promise<{ job: BackgroundJob; isIdempotentReplay: boolean }> {
    // Validate schema
    RegisterJobSchema.parse({
      jobType,
      idempotencyKey,
      payload,
      maxRetries: options?.maxRetries ?? 3,
      timeoutMs: options?.timeoutMs ?? 15000,
    });

    const store = reliabilityDb.getData();
    const existing = store.jobs.find((j) => j.idempotencyKey === idempotencyKey);

    if (existing) {
      // Idempotent deduplication: Return existing completed or running job without duplicate execution
      return {
        job: existing,
        isIdempotentReplay: true,
      };
    }

    const job: BackgroundJob = {
      id: `job-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      jobType,
      idempotencyKey,
      payload,
      status: 'PENDING',
      attempts: 0,
      maxRetries: options?.maxRetries ?? 3,
      backoffFactorMs: options?.backoffFactorMs ?? 500,
      timeoutMs: options?.timeoutMs ?? 15000,
      scheduledAt: new Date().toISOString(),
    };

    store.jobs.push(job);
    reliabilityDb.persist();

    return {
      job,
      isIdempotentReplay: false,
    };
  }

  /**
   * Executes a job handler with timeout, exponential backoff retry, and DLQ routing on terminal failure.
   */
  public async processJob(
    jobId: string,
    handler: (payload: Record<string, any>) => Promise<void>
  ): Promise<BackgroundJob> {
    const store = reliabilityDb.getData();
    const job = store.jobs.find((j) => j.id === jobId);

    if (!job) {
      throw new Error(`Job ${jobId} not found.`);
    }

    job.status = 'RUNNING';
    job.startedAt = new Date().toISOString();
    reliabilityDb.persist();

    while (job.attempts < job.maxRetries) {
      job.attempts += 1;

      try {
        // Enforce timeout using Promise.race
        await Promise.race([
          handler(job.payload),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Job timed out after ${job.timeoutMs}ms`)), job.timeoutMs)
          ),
        ]);

        // Success
        job.status = 'COMPLETED';
        job.completedAt = new Date().toISOString();
        job.error = undefined;
        reliabilityDb.persist();
        return job;
      } catch (err: any) {
        job.error = err.message || 'Unknown execution error';

        if (job.attempts >= job.maxRetries) {
          // Terminal failure: Route to Dead-Letter Queue (DLQ)
          job.status = 'DEAD_LETTER';
          job.completedAt = new Date().toISOString();

          const dlqItem: DeadLetterJob = {
            jobId: job.id,
            jobType: job.jobType,
            failureReason: job.error || 'Unknown execution error',
            payload: job.payload,
            attempts: job.attempts,
            firstFailedAt: job.startedAt || new Date().toISOString(),
            lastFailedAt: new Date().toISOString(),
            replayed: false,
          };

          store.deadLetterQueue.push(dlqItem);
          reliabilityDb.persist();
          return job;
        }

        // Exponential backoff wait before next attempt: backoffFactor * 2^(attempt - 1)
        const delay = job.backoffFactorMs * Math.pow(2, job.attempts - 1);
        await new Promise((resolve) => setTimeout(resolve, Math.min(delay, 2000)));
      }
    }

    return job;
  }

  /**
   * Replays a failed job from the Dead-Letter Queue.
   */
  public replayDeadLetterJob(jobId: string): { success: boolean; replayedJobId?: string; error?: string } {
    const store = reliabilityDb.getData();
    const dlqItem = store.deadLetterQueue.find((d) => d.jobId === jobId);

    if (!dlqItem) {
      return { success: false, error: 'Job not found in Dead-Letter Queue.' };
    }

    if (dlqItem.replayed) {
      return { success: false, error: 'Job has already been replayed.' };
    }

    dlqItem.replayed = true;
    dlqItem.replayedAt = new Date().toISOString();

    // Create a new job with fresh idempotency key
    const newJob: BackgroundJob = {
      id: `job-replay-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      jobType: dlqItem.jobType,
      idempotencyKey: `replay-${dlqItem.jobId}-${Date.now()}`,
      payload: dlqItem.payload,
      status: 'PENDING',
      attempts: 0,
      maxRetries: 3,
      backoffFactorMs: 500,
      timeoutMs: 15000,
      scheduledAt: new Date().toISOString(),
    };

    store.jobs.push(newJob);
    reliabilityDb.persist();

    return {
      success: true,
      replayedJobId: newJob.id,
    };
  }

  /**
   * Retrieves all Dead-Letter Queue items.
   */
  public getDeadLetterQueue(): DeadLetterJob[] {
    return reliabilityDb.getData().deadLetterQueue;
  }

  /**
   * Retrieves all background jobs.
   */
  public getAllJobs(): BackgroundJob[] {
    return reliabilityDb.getData().jobs;
  }
}

export const backgroundJobHardener = new BackgroundJobHardener();
