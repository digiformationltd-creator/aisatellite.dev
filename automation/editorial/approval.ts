import type { ArticleDraft } from '../shared/types.js';
import { StorageEngine } from '../shared/storage.js';
import { ContentValidator } from '../validation/content-validator.js';
import { Logger } from '../shared/logger.js';

export class EditorialApprovalEngine {
  private storage: StorageEngine;
  private validator: ContentValidator;
  private logger: Logger;

  constructor(storage = new StorageEngine()) {
    this.storage = storage;
    this.validator = new ContentValidator();
    this.logger = new Logger('EditorialApproval');
  }

  /**
   * Validates and submits draft to the editorial review queue
   */
  submitForReview(draftId: string): ArticleDraft {
    const draft = this.storage.getDraft(draftId);
    if (!draft) {
      throw new Error(`Draft not found: ${draftId}`);
    }

    const report = this.validator.validateDraft(draft);

    if (!report.isValid) {
      draft.status = 'validation_failed';
      draft.validationErrors = report.errors;
      this.storage.saveDraft(draft);
      this.logger.warn(`Draft ${draftId} failed technical validation:`, { errors: report.errors });
      return draft;
    }

    draft.status = 'ready_for_review';
    draft.validationErrors = [];
    this.storage.saveDraft(draft);
    this.logger.info(`Draft ${draftId} submitted to Editorial Review Queue (Status: READY_FOR_REVIEW)`);
    return draft;
  }

  /**
   * Approves a draft (Requires human reviewer ID; prevents bot self-approval)
   */
  approveDraft(draftId: string, reviewerId: string, reviewNotes?: string): ArticleDraft {
    if (!reviewerId || reviewerId.toLowerCase().includes('bot') || reviewerId.toLowerCase().includes('agent')) {
      throw new Error(`Editorial approval rejected: Human editor sign-off required. Automated agents cannot self-approve drafts.`);
    }

    const draft = this.storage.getDraft(draftId);
    if (!draft) {
      throw new Error(`Draft not found: ${draftId}`);
    }

    if (draft.status !== 'ready_for_review') {
      throw new Error(`Cannot approve draft in state "${draft.status}". Must be in "ready_for_review".`);
    }

    draft.status = 'approved';
    draft.editorialReviewNotes = `Approved by editor: ${reviewerId}. ${reviewNotes || 'Quality standards verified.'}`;
    draft.updatedAt = new Date().toISOString();
    this.storage.saveDraft(draft);

    this.logger.info(`Draft ${draftId} APPROVED by ${reviewerId}`);
    return draft;
  }

  /**
   * Rejects a draft with auditable reason
   */
  rejectDraft(draftId: string, reason: string): ArticleDraft {
    const draft = this.storage.getDraft(draftId);
    if (!draft) {
      throw new Error(`Draft not found: ${draftId}`);
    }

    draft.status = 'rejected';
    draft.editorialReviewNotes = `Rejected: ${reason}`;
    draft.updatedAt = new Date().toISOString();
    this.storage.saveDraft(draft);

    this.logger.warn(`Draft ${draftId} REJECTED: ${reason}`);
    return draft;
  }
}
