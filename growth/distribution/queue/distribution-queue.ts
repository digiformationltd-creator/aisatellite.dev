import type { DistributionJob, SupportedPlatform } from '../../schemas/index.js';
import { GrowthLogger } from '../../monitoring/growth-logger.js';
import { growthStorage } from '../../storage/growth-storage.js';
import { platformAdapters } from '../adapters/index.js';
import { distributionContentValidator } from '../validation/content-validator.js';

export class DistributionQueue {
  private logger: GrowthLogger;

  constructor(baseDir = process.cwd()) {
    this.logger = new GrowthLogger('DistributionQueue', baseDir);
  }

  /**
   * Enqueues a new distribution draft for review
   */
  enqueueJob(params: {
    sourceContentId: string;
    platform: SupportedPlatform;
    title: string;
    summary: string;
    targetUrl: string;
    tags?: string[];
  }): DistributionJob {
    const queue = growthStorage.getDistributionQueue();

    // Duplicate detection: reject if job already exists for this content & platform
    const existing = queue.find(
      (j) => j.sourceContentId === params.sourceContentId && j.platform === params.platform
    );
    if (existing) {
      this.logger.warn(`Rejected duplicate distribution job for ${params.sourceContentId} on ${params.platform}`);
      throw new Error(`Duplicate job: Distribution for ${params.sourceContentId} on platform ${params.platform} already exists`);
    }

    const adapter = platformAdapters[params.platform];
    if (!adapter) {
      throw new Error(`Unsupported platform: ${params.platform}`);
    }

    const formattedText = adapter.formatDraft(params.title, params.summary, params.targetUrl, params.tags);

    // Validate draft
    const validation = distributionContentValidator.validateDraft(params.platform, formattedText, params.targetUrl);
    if (!validation.isValid) {
      throw new Error(`Distribution validation failed: ${validation.errors.join('; ')}`);
    }

    const job: DistributionJob = {
      id: `dist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sourceContentId: params.sourceContentId,
      platform: params.platform,
      text: formattedText,
      targetUrl: params.targetUrl,
      status: 'draft', // Strictly start in draft mode
      retryCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    queue.push(job);
    growthStorage.saveDistributionQueue(queue);
    this.logger.info(`Enqueued distribution draft ${job.id} for ${job.platform} (Status: draft)`);

    return job;
  }

  /**
   * Human / Editorial approval gate
   */
  approveJob(jobId: string, editorName: string): DistributionJob {
    const queue = growthStorage.getDistributionQueue();
    const jobIndex = queue.findIndex((j) => j.id === jobId);

    if (jobIndex === -1) {
      throw new Error(`Job not found: ${jobId}`);
    }

    const job = queue[jobIndex];
    if (job.status === 'published') {
      throw new Error(`Job ${jobId} is already published`);
    }

    job.status = 'approved';
    job.approvedBy = editorName;
    job.updatedAt = new Date().toISOString();

    queue[jobIndex] = job;
    growthStorage.saveDistributionQueue(queue);
    this.logger.recordAudit('APPROVE_DISTRIBUTION_JOB', editorName, { jobId, platform: job.platform });

    return job;
  }

  /**
   * Rejects a distribution draft
   */
  rejectJob(jobId: string, reason: string, editorName: string): DistributionJob {
    const queue = growthStorage.getDistributionQueue();
    const jobIndex = queue.findIndex((j) => j.id === jobId);

    if (jobIndex === -1) {
      throw new Error(`Job not found: ${jobId}`);
    }

    const job = queue[jobIndex];
    job.status = 'cancelled';
    job.error = `Rejected by ${editorName}: ${reason}`;
    job.updatedAt = new Date().toISOString();

    queue[jobIndex] = job;
    growthStorage.saveDistributionQueue(queue);
    this.logger.recordAudit('REJECT_DISTRIBUTION_JOB', editorName, { jobId, reason });

    return job;
  }

  /**
   * Executes publishing for an approved job
   */
  async processJob(jobId: string): Promise<DistributionJob> {
    const queue = growthStorage.getDistributionQueue();
    const jobIndex = queue.findIndex((j) => j.id === jobId);

    if (jobIndex === -1) {
      throw new Error(`Job not found: ${jobId}`);
    }

    const job = queue[jobIndex];

    // Strict Gate: Unapproved posts CANNOT publish!
    if (job.status !== 'approved') {
      this.logger.warn(`Blocked publication attempt of unapproved job ${jobId} (Current status: ${job.status})`);
      throw new Error(`Policy violation: Job ${jobId} must be approved by an editor before publishing (Current status: ${job.status})`);
    }

    const adapter = platformAdapters[job.platform];
    const result = await adapter.publish(job);

    if (result.success) {
      job.status = 'published';
      job.publishedAt = new Date().toISOString();
      job.publishedUrl = result.publishedUrl;
      job.error = undefined;
    } else {
      job.status = 'failed';
      job.error = result.error;
      job.retryCount += 1;
    }

    job.updatedAt = new Date().toISOString();
    queue[jobIndex] = job;
    growthStorage.saveDistributionQueue(queue);

    return job;
  }

  /**
   * Retries a failed job
   */
  async retryJob(jobId: string): Promise<DistributionJob> {
    const queue = growthStorage.getDistributionQueue();
    const jobIndex = queue.findIndex((j) => j.id === jobId);

    if (jobIndex === -1) {
      throw new Error(`Job not found: ${jobId}`);
    }

    const job = queue[jobIndex];
    if (job.status !== 'failed') {
      throw new Error(`Job ${jobId} is not in failed state`);
    }

    // Reset status to approved for retry
    job.status = 'approved';
    job.updatedAt = new Date().toISOString();
    queue[jobIndex] = job;
    growthStorage.saveDistributionQueue(queue);

    return this.processJob(jobId);
  }
}

export const distributionQueue = new DistributionQueue();
