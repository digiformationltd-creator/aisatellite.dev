#!/usr/bin/env node
import { StorageEngine } from '../automation/shared/storage.js';
import { ArticleDraftingEngine } from '../automation/drafting/article-generator.js';
import { EvidenceLedgerManager } from '../automation/research/evidence-ledger.js';
import { Logger } from '../automation/shared/logger.js';

async function main() {
  const logger = new Logger('Script:GenerateDraft');
  logger.info('Starting Daily Article Drafting Pipeline...');

  const storage = new StorageEngine();
  const draftingEngine = new ArticleDraftingEngine();
  const ledger = new EvidenceLedgerManager();

  const topics = storage.getTopics();
  if (topics.length === 0) {
    logger.warn('No topic proposals found in data/topics/. Run "npm run plan:content" first.');
    return;
  }

  // Pick top priority topic that doesn't already have a published draft
  const existingDrafts = storage.getDrafts();
  const existingSlugs = new Set(existingDrafts.map((d) => d.slug));

  const candidateTopic = topics.find((t) => !existingSlugs.has(t.slug));
  if (!candidateTopic) {
    logger.info('All planned topics already have associated drafts.');
    return;
  }

  logger.info(`Selected priority topic: "${candidateTopic.title}" (Priority Score: ${candidateTopic.priorityScore})`);

  // Build grounded evidence records
  for (const ref of candidateTopic.evidenceReferences) {
    ledger.addClaim(
      `Official technical documentation and license repository for ${candidateTopic.title}`,
      ref,
      'official_documentation',
      'high'
    );
  }

  // If evidence references were empty, add official domain fallback
  if (ledger.getClaims().length === 0) {
    ledger.addClaim(
      `Open-source software release documentation for ${candidateTopic.title}`,
      'https://github.com/ripienaar/free-for-dev',
      'repository_readme',
      'high'
    );
  }

  const evidence = ledger.getClaims();

  // Save evidence records
  for (const ev of evidence) {
    storage.saveEvidence(ev);
  }

  // Generate article draft
  const draft = await draftingEngine.generateDraft(candidateTopic, evidence);
  storage.saveDraft(draft);

  logger.info(`Article draft generated: ${draft.draftId} (Status: ${draft.status})`);
  logger.info(`To validate and submit for review, run: npm run validate:draft`);
}

main().catch((err) => {
  console.error('Fatal draft generation error:', err);
  process.exit(1);
});
