import type { DistributionJob, SupportedPlatform } from '../../schemas/index.js';
import { GrowthLogger } from '../../monitoring/growth-logger.js';
import { GROWTH_CONFIG } from '../../config/growth-config.js';

export interface PublishResult {
  success: boolean;
  publishedUrl?: string;
  error?: string;
  isRetryable?: boolean;
}

export abstract class BasePlatformAdapter {
  abstract platform: SupportedPlatform;
  abstract maxCharacters: number;
  protected logger: GrowthLogger;

  constructor(subsystem: string, baseDir = process.cwd()) {
    this.logger = new GrowthLogger(subsystem, baseDir);
  }

  abstract isConfigured(): boolean;

  abstract formatDraft(title: string, summary: string, targetUrl: string, tags?: string[]): string;

  /**
   * Safe publishing with retry and rate-limit backoff handling
   */
  async publish(job: DistributionJob): Promise<PublishResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: `Platform ${this.platform} is unconfigured. Missing required API credentials in environment.`,
        isRetryable: false,
      };
    }

    let attempt = 0;
    const maxRetries = GROWTH_CONFIG.distribution.maxRetries;
    let delay = GROWTH_CONFIG.distribution.retryDelayMs;

    while (attempt <= maxRetries) {
      try {
        const result = await this.executePublish(job);
        if (result.success) {
          this.logger.info(`Successfully distributed job ${job.id} to ${this.platform}`, {
            publishedUrl: result.publishedUrl,
          });
          return result;
        }

        if (!result.isRetryable || attempt === maxRetries) {
          return result;
        }
      } catch (err) {
        this.logger.warn(`Distribution attempt ${attempt + 1} to ${this.platform} failed: ${String(err)}`);
        if (attempt === maxRetries) {
          return {
            success: false,
            error: String(err),
            isRetryable: false,
          };
        }
      }

      attempt++;
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= GROWTH_CONFIG.distribution.rateLimitBackoffMultiplier;
    }

    return {
      success: false,
      error: `Exceeded max retries (${maxRetries}) for platform ${this.platform}`,
      isRetryable: false,
    };
  }

  protected abstract executePublish(job: DistributionJob): Promise<PublishResult>;
}
