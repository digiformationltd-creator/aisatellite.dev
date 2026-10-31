#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { StorageEngine } from '../automation/shared/storage.js';
import { EditorialTopicPlanner } from '../automation/intelligence/topic-planner.js';
import { Logger } from '../automation/shared/logger.js';

async function main() {
  const logger = new Logger('Script:PlanContent');
  logger.info('Starting Editorial Topic Planning...');

  const storage = new StorageEngine();
  const planner = new EditorialTopicPlanner();

  const verified = storage.getVerified();
  logger.info(`Analyzing ${verified.length} verified resources`);

  // Discover existing blog slugs to prevent topic cannibalization
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  let existingSlugs: string[] = [];
  if (fs.existsSync(blogDir)) {
    existingSlugs = fs
      .readdirSync(blogDir)
      .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
      .map((f) => f.replace(/\.(md|mdx)$/, ''));
  }

  const topics = planner.planTopics(verified, existingSlugs);

  let plannedCount = 0;
  for (const topic of topics) {
    storage.saveTopic(topic);
    plannedCount++;
    logger.info(`[PLANNED] "${topic.title}" (Priority: ${topic.priorityScore}, Partner: ${topic.recommendedPartner})`);
  }

  logger.info(`Topic planning complete. Saved ${plannedCount} topic proposals to data/topics/`);
}

main().catch((err) => {
  console.error('Fatal topic planning error:', err);
  process.exit(1);
});
