#!/usr/bin/env node
import { FreshnessMonitor } from '../automation/monitoring/freshness.js';
import { Logger } from '../automation/shared/logger.js';

async function main() {
  const logger = new Logger('Script:MonitorFreshness');
  logger.info('Starting Content Freshness & Link Health Audit...');

  const monitor = new FreshnessMonitor();
  const report = await monitor.auditFreshness(false);

  logger.info(`Audit Summary:`);
  logger.info(`- Total Resources Monitored: ${report.totalMonitored}`);
  logger.info(`- Healthy Resources: ${report.healthyCount}`);
  logger.info(`- Stale (>90 days): ${report.staleCount}`);
  logger.info(`- Broken URLs: ${report.brokenLinkCount}`);

  if (report.flaggedItems.length > 0) {
    logger.warn(`Flagged Items requiring attention:`);
    for (const item of report.flaggedItems) {
      logger.warn(`  * [${item.id}] ${item.url} - ${item.issue}`);
    }
  }
}

main().catch((err) => {
  console.error('Fatal freshness monitor error:', err);
  process.exit(1);
});
