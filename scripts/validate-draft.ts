#!/usr/bin/env node
import { StorageEngine } from '../automation/shared/storage.js';
import { EditorialApprovalEngine } from '../automation/editorial/approval.js';
import { PullRequestReviewHelper } from '../automation/editorial/pull-request.js';
import { Logger } from '../automation/shared/logger.js';

async function main() {
  const logger = new Logger('Script:ValidateDraft');
  logger.info('Starting Technical Draft Validation & Review Staging...');

  const storage = new StorageEngine();
  const approvalEngine = new EditorialApprovalEngine(storage);

  const drafts = storage.getDrafts().filter((d) => d.status === 'drafted' || d.status === 'validation_failed');
  logger.info(`Found ${drafts.length} drafts awaiting validation.`);

  for (const draft of drafts) {
    try {
      const updated = approvalEngine.submitForReview(draft.draftId);
      if (updated.status === 'ready_for_review') {
        logger.info(`[READY FOR HUMAN REVIEW] ${updated.title} (ID: ${updated.draftId})`);
        const prBody = PullRequestReviewHelper.generatePrBody(updated);
        logger.info(`Review Checklist Generated:\n${prBody}`);
      } else {
        logger.warn(`[VALIDATION BLOCKED] ${draft.title}: ${updated.validationErrors.join(', ')}`);
      }
    } catch (err: any) {
      logger.error(`Error validating draft ${draft.draftId}: ${err.message}`);
    }
  }
}

main().catch((err) => {
  console.error('Fatal draft validation error:', err);
  process.exit(1);
});
