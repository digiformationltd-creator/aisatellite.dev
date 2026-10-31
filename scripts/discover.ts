#!/usr/bin/env node
import { GitHubDiscoveryConnector } from '../automation/discovery/github.js';
import { CuratedListDiscoveryConnector } from '../automation/discovery/curated-lists.js';
import { DeduplicationEngine } from '../automation/normalization/deduplication.js';
import { StorageEngine } from '../automation/shared/storage.js';
import { ConfigManager } from '../automation/shared/config.js';
import { Logger } from '../automation/shared/logger.js';

async function main() {
  const logger = new Logger('Script:Discover');
  logger.info('Starting Autonomous Resource Discovery...');

  const storage = new StorageEngine();
  const config = new ConfigManager();
  const categories = config.getCategories();
  const sources = config.getDiscoverySources();

  const githubConnector = new GitHubDiscoveryConnector();
  const curatedConnector = new CuratedListDiscoveryConnector();

  let allDiscovered: any[] = [];

  // 1. Curated List Discovery
  if (sources.sources?.curatedLists) {
    for (const list of sources.sources.curatedLists) {
      if (!list.enabled) continue;
      logger.info(`Fetching curated source: ${list.name}`);
      const items = await curatedConnector.fetchCuratedList(
        list.url,
        list.defaultCategory || 'free-tools',
        list.id,
        list.type
      );
      allDiscovered.push(...items);
    }
  }

  // 2. GitHub Discovery for Priority Categories
  const priorityCats = categories.filter((c) => c.priority === 'critical' || c.priority === 'high');
  for (const cat of priorityCats.slice(0, 3)) { // Limit to 3 queries per batch to preserve API limits
    const query = cat.queries[0];
    const items = await githubConnector.searchRepositories({
      query,
      category: cat.id,
      perPage: 10,
      maxResults: 15,
    });
    allDiscovered.push(...items);
  }

  // 3. Deduplication and Normalization
  logger.info(`Total raw items collected: ${allDiscovered.length}. Deduplicating...`);
  const deduplicated = DeduplicationEngine.deduplicate(allDiscovered);

  // 4. Save Candidates
  let savedCount = 0;
  for (const item of deduplicated) {
    storage.saveCandidate(item);
    savedCount++;
  }

  logger.info(`Discovery complete. Saved ${savedCount} candidate records to data/candidates/`);
}

main().catch((err) => {
  console.error('Fatal discovery error:', err);
  process.exit(1);
});
