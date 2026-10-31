#!/usr/bin/env node
import { StorageEngine } from '../automation/shared/storage.js';
import { PublishingEngine } from '../automation/publishing/publisher.js';
import { Logger } from '../automation/shared/logger.js';

async function main() {
  const logger = new Logger('Script:PublishApproved');
  logger.info('Starting Publication Engine for Approved Content...');

  const storage = new StorageEngine();
  const publisher = new PublishingEngine(process.cwd(), storage);

  // 1. Publish Approved Article Drafts
  const approvedDrafts = storage.getDrafts().filter((d) => d.status === 'approved');
  logger.info(`Found ${approvedDrafts.length} approved articles ready for publication.`);

  let publishedCount = 0;
  for (const draft of approvedDrafts) {
    try {
      const filePath = publisher.publishArticle(draft.draftId);
      publishedCount++;
      logger.info(`[PUBLISHED ARTICLE] "${draft.title}" -> ${filePath}`);
    } catch (err: any) {
      logger.error(`Failed to publish draft ${draft.draftId}: ${err.message}`);
    }
  }

  // 2. Publish High-Scoring Verified Tools
  const verifiedTools = storage.getVerified().filter((t) => t.status === 'verified' && (t.qualityScore || 0) >= 65);
  logger.info(`Found ${verifiedTools.length} eligible verified tools for content promotion.`);

  let toolCount = 0;
  for (const tool of verifiedTools.slice(0, 5)) { // Batch limit
    try {
      const filePath = publisher.publishVerifiedTool(tool);
      toolCount++;
      logger.info(`[PROMOTED TOOL] "${tool.name}" -> ${filePath}`);
    } catch (err: any) {
      logger.error(`Failed to publish tool ${tool.id}: ${err.message}`);
    }
  }

  logger.info(`Publication run finished. Articles Published: ${publishedCount}, Tools Promoted: ${toolCount}`);
  if (publishedCount > 0 || toolCount > 0) {
    logger.info(`Rebuild static site and search index with: npm run build`);
  }
}

main().catch((err) => {
  console.error('Fatal publication error:', err);
  process.exit(1);
});
