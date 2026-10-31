import fs from 'node:fs';
import path from 'node:path';
import type { FreshnessReport } from '../shared/types.js';
import { LinkVerifier } from '../verification/links.js';
import { StorageEngine } from '../shared/storage.js';
import { Logger } from '../shared/logger.js';

export class FreshnessMonitor {
  private baseDir: string;
  private storage: StorageEngine;
  private logger: Logger;

  constructor(baseDir = process.cwd(), storage = new StorageEngine(baseDir)) {
    this.baseDir = baseDir;
    this.storage = storage;
    this.logger = new Logger('FreshnessMonitor', baseDir);
  }

  /**
   * Scans content collections and verified resources for stale records and broken links
   */
  async auditFreshness(skipNetwork = false): Promise<FreshnessReport> {
    this.logger.info('Starting freshness and link integrity audit');

    const verified = this.storage.getVerified();
    const flaggedItems: FreshnessReport['flaggedItems'] = [];
    let brokenLinkCount = 0;
    let staleCount = 0;

    const now = Date.now();
    const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;

    for (const res of verified) {
      // 1. Check Stale verification
      if (res.lastVerified) {
        const verifiedTime = new Date(res.lastVerified).getTime();
        if (now - verifiedTime > ninetyDaysMs) {
          staleCount++;
          flaggedItems.push({
            id: res.id,
            url: res.canonicalUrl,
            issue: `Verification is older than 90 days (Last verified: ${res.lastVerified}). Enters re-verification queue.`,
          });
        }
      }

      // 2. Check Link Health
      if (!skipNetwork) {
        const health = await LinkVerifier.checkLink(res.canonicalUrl);
        if (!health.isAlive) {
          brokenLinkCount++;
          flaggedItems.push({
            id: res.id,
            url: res.canonicalUrl,
            issue: `Broken or unreachable URL: ${health.error || `HTTP ${health.statusCode}`}`,
          });
        }
      }
    }

    const report: FreshnessReport = {
      checkedAt: new Date().toISOString(),
      totalMonitored: verified.length,
      healthyCount: verified.length - (brokenLinkCount + staleCount),
      brokenLinkCount,
      staleCount,
      flaggedItems,
    };

    const dateStr = new Date().toISOString().split('T')[0];
    this.storage.saveReport(`freshness-${dateStr}`, report);
    this.logger.info(`Audit complete. Monitored: ${verified.length}, Broken: ${brokenLinkCount}, Stale: ${staleCount}`);

    return report;
  }
}
