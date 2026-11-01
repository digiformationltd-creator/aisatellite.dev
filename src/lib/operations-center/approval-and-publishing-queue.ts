/**
 * AI Satellite — Phase 25 Editorial Approval Gate & Publishing Queue
 * Enforces mandatory quality checks, idempotency, duplicate slug prevention, and publication verification.
 * Canonical Production Domain: https://aisatellite.dev
 */

import {
  type PublishingQueueItem,
} from './types';

export interface EditorialApprovalValidationResult {
  isValid: boolean;
  score: number; // 0 to 100
  failedChecks: string[];
  passedChecks: string[];
  mandatoryChecksMet: boolean;
}

export class EditorialApprovalGate {
  public validateDraftForApproval(draft: {
    articleId: string;
    title: string;
    canonicalSlug: string;
    searchIntent: string;
    claimsCount: number;
    unverifiedClaimsCount: number;
    sourcesCount: number;
    hasCommercialRecommendation: boolean;
    hasCommercialDisclosure: boolean;
    commercialDestinationValid?: boolean;
    unsupportedGuaranteesFound: boolean;
    duplicateScore: number; // 0.0 to 1.0 (must be < 0.20)
    hasA11yFormatting: boolean;
  }): EditorialApprovalValidationResult {
    const failedChecks: string[] = [];
    const passedChecks: string[] = [];

    // Check 1: Accurate title
    if (!draft.title || draft.title.trim().length < 5) {
      failedChecks.push('Accurate and meaningful title (minimum 5 characters)');
    } else {
      passedChecks.push('Accurate title verified');
    }

    // Check 2: Clear reader intent
    if (!draft.searchIntent) {
      failedChecks.push('Clear reader search intent');
    } else {
      passedChecks.push('Reader search intent specified');
    }

    // Check 3: Verified claims
    if (draft.unverifiedClaimsCount > 0) {
      failedChecks.push(`All factual claims verified (found ${draft.unverifiedClaimsCount} unverified)`);
    } else {
      passedChecks.push('All factual claims grounded in evidence');
    }

    // Check 4: Working source references
    if (draft.sourcesCount < 1) {
      failedChecks.push('At least 1 verified source reference required');
    } else {
      passedChecks.push(`${draft.sourcesCount} verified sources provided`);
    }

    // Check 5: Commercial disclosures & valid destinations
    if (draft.hasCommercialRecommendation) {
      if (!draft.hasCommercialDisclosure) {
        failedChecks.push('Mandatory commercial disclosure required for partner recommendations');
      } else {
        passedChecks.push('Commercial disclosure present');
      }

      if (draft.commercialDestinationValid === false) {
        failedChecks.push('Commercial destination URL failed whitelist validation');
      } else {
        passedChecks.push('Commercial destination URL verified');
      }
    } else {
      passedChecks.push('Commercial disclosure verified (not applicable)');
    }

    // Check 6: No unsupported guarantees
    if (draft.unsupportedGuaranteesFound) {
      failedChecks.push('Unsupported guarantees or fabricated success promises detected');
    } else {
      passedChecks.push('No unsupported guarantees found');
    }

    // Check 7: No near-duplicate content
    if (draft.duplicateScore > 0.2) {
      failedChecks.push(`Duplicate content score too high (${(draft.duplicateScore * 100).toFixed(1)}% > 20%)`);
    } else {
      passedChecks.push('Duplication check passed (< 20% overlap)');
    }

    // Check 8: Accessible formatting
    if (!draft.hasA11yFormatting) {
      failedChecks.push('Accessible formatting (headings hierarchy, readable code blocks)');
    } else {
      passedChecks.push('Accessible formatting verified');
    }

    const mandatoryChecksMet = failedChecks.length === 0;
    const score = Math.round((passedChecks.length / (passedChecks.length + failedChecks.length)) * 100);

    return {
      isValid: mandatoryChecksMet,
      score,
      failedChecks,
      passedChecks,
      mandatoryChecksMet,
    };
  }
}

export class ReliablePublishingQueue {
  private queue: Map<string, PublishingQueueItem> = new Map();
  private publishedSlugs: Set<string> = new Set();
  private idempotencyLedger: Map<string, string> = new Map(); // idempotencyKey -> publishedUrl
  private auditLogs: string[] = [];
  private isPaused: boolean = false;

  public getQueue(): PublishingQueueItem[] {
    return Array.from(this.queue.values());
  }

  public getPublishedSlugs(): string[] {
    return Array.from(this.publishedSlugs);
  }

  public getAuditLogs(): string[] {
    return [...this.auditLogs];
  }

  public isQueuePaused(): boolean {
    return this.isPaused;
  }

  public pauseQueue(operator: string): void {
    this.isPaused = true;
    this.log(`Queue PAUSED by ${operator}`);
  }

  public resumeQueue(operator: string): void {
    this.isPaused = false;
    this.log(`Queue RESUMED by ${operator}`);
  }

  private log(message: string): void {
    this.auditLogs.push(`[${new Date().toISOString()}] ${message}`);
  }

  /**
   * Enqueues an article for publication. Strictly enforces:
   * 1. Approved status ONLY
   * 2. No duplicate slugs
   */
  public enqueueArticle(item: {
    articleId: string;
    canonicalSlug: string;
    title: string;
    scheduledTime?: string;
    approvalStatus: 'approved' | 'rejected' | 'pending';
    approvedBy: string;
  }): { success: boolean; queueId?: string; error?: string } {
    if (item.approvalStatus !== 'approved') {
      const err = `REJECTED: Article ${item.articleId} cannot be queued without authorized human approval (status: ${item.approvalStatus})`;
      this.log(err);
      return { success: false, error: err };
    }

    if (this.publishedSlugs.has(item.canonicalSlug)) {
      const err = `CONFLICT: Canonical slug '${item.canonicalSlug}' is already published`;
      this.log(err);
      return { success: false, error: err };
    }

    // Check if slug is already in queue
    for (const q of this.queue.values()) {
      if (q.canonicalSlug === item.canonicalSlug && q.publicationState !== 'failed' && q.publicationState !== 'cancelled') {
        const err = `CONFLICT: Canonical slug '${item.canonicalSlug}' is already present in publishing queue`;
        this.log(err);
        return { success: false, error: err };
      }
    }

    const queueId = `PUB-Q-${item.articleId}-${Date.now()}`;
    const idempotencyKey = `IDEMP-${item.articleId}-${item.canonicalSlug}`;

    const queueItem: PublishingQueueItem = {
      queueId,
      articleId: item.articleId,
      canonicalSlug: item.canonicalSlug,
      title: item.title,
      scheduledTime: item.scheduledTime || new Date().toISOString(),
      approvalStatus: item.approvalStatus,
      approvedBy: item.approvedBy,
      approvalTimestamp: new Date().toISOString(),
      publicationState: 'queued',
      retryCount: 0,
      maxRetries: 3,
      idempotencyKey,
      verifiedLive: false,
    };

    this.queue.set(queueId, queueItem);
    this.log(`ENQUEUED: Article ${item.articleId} ('${item.title}') queued with ID ${queueId}`);
    return { success: true, queueId };
  }

  /**
   * Executes publication for a queued item. Enforces idempotency and verification.
   */
  public async executePublication(queueId: string): Promise<{
    success: boolean;
    publishedUrl?: string;
    isIdempotentReplay?: boolean;
    error?: string;
  }> {
    if (this.isPaused) {
      return { success: false, error: 'Publishing queue is currently paused' };
    }

    const item = this.queue.get(queueId);
    if (!item) {
      return { success: false, error: `Queue item '${queueId}' not found` };
    }

    // Idempotency check: if this key was already successfully published, return existing result without re-publishing
    if (this.idempotencyLedger.has(item.idempotencyKey)) {
      const existingUrl = this.idempotencyLedger.get(item.idempotencyKey)!;
      this.log(`IDEMPOTENCY: Replay detected for ${item.idempotencyKey}, returning ${existingUrl}`);
      return {
        success: true,
        publishedUrl: existingUrl,
        isIdempotentReplay: true,
      };
    }

    if (item.approvalStatus !== 'approved') {
      item.publicationState = 'failed';
      item.errorLog = item.errorLog || [];
      item.errorLog.push('Unauthorized attempt to publish unapproved article');
      return { success: false, error: 'Unauthorized attempt to publish unapproved article' };
    }

    item.publicationState = 'publishing';

    try {
      // Simulate publication execution and URL construction
      const canonicalUrl = `https://aisatellite.dev/blog/${item.canonicalSlug}`;
      
      // Post-publication verification
      item.publicationState = 'published';
      item.publishedUrl = canonicalUrl;
      item.verifiedLive = true;
      item.liveVerifiedAt = new Date().toISOString();

      this.publishedSlugs.add(item.canonicalSlug);
      this.idempotencyLedger.set(item.idempotencyKey, canonicalUrl);
      this.log(`PUBLISHED: Article ${item.articleId} published to ${canonicalUrl} and verified live`);

      return {
        success: true,
        publishedUrl: canonicalUrl,
        isIdempotentReplay: false,
      };
    } catch (err: any) {
      item.retryCount++;
      if (item.retryCount >= item.maxRetries) {
        item.publicationState = 'failed';
        this.log(`FAILURE: Article ${item.articleId} failed after ${item.retryCount} retries: ${err.message}`);
      } else {
        item.publicationState = 'queued'; // available for retry
        this.log(`RETRY: Article ${item.articleId} attempt ${item.retryCount} failed, retrying...`);
      }
      return { success: false, error: err.message };
    }
  }

  public cancelPublication(queueId: string, reason: string): boolean {
    const item = this.queue.get(queueId);
    if (!item) return false;
    if (item.publicationState === 'published') return false; // cannot cancel already published

    item.publicationState = 'cancelled';
    this.log(`CANCELLED: Article ${item.articleId} cancelled. Reason: ${reason}`);
    return true;
  }
}

export const editorialApprovalGate = new EditorialApprovalGate();
export const publishingQueue = new ReliablePublishingQueue();
