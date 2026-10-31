/**
 * AI SATELLITE — PHASE 23 CONTENT FRESHNESS & RE-VERIFICATION ENGINE
 * Schedules and tracks re-verification cycles based on content risk taxonomy.
 * Canonical Domain: https://aisatellite.dev
 */

import type { ContentFreshness } from '../editorial/types';
import type { ContentFreshnessRecord } from './types';

export class ContentFreshnessEngine {
  private static instance: ContentFreshnessEngine;

  private records: Map<string, ContentFreshnessRecord> = new Map();

  public static getInstance(): ContentFreshnessEngine {
    if (!ContentFreshnessEngine.instance) {
      ContentFreshnessEngine.instance = new ContentFreshnessEngine();
    }
    return ContentFreshnessEngine.instance;
  }

  /**
   * Initializes or updates a content freshness tracking record for an article.
   */
  public registerFreshnessSchedule(
    articleId: string,
    freshnessRisk: ContentFreshness,
    lastVerifiedDate = new Date().toISOString().split('T')[0]
  ): ContentFreshnessRecord {
    const nextDate = this.calculateNextReverificationDate(freshnessRisk, lastVerifiedDate);
    const isStale = new Date(nextDate) <= new Date();

    const record: ContentFreshnessRecord = {
      articleId,
      freshnessRisk,
      lastVerifiedAt: lastVerifiedDate,
      nextScheduledReverification: nextDate,
      isStale,
      reverificationNotes: `Freshness policy for ${freshnessRisk}: reverification scheduled for ${nextDate}.`,
    };

    this.records.set(articleId, record);
    return record;
  }

  public getRecord(articleId: string): ContentFreshnessRecord | undefined {
    return this.records.get(articleId);
  }

  public getAllRecords(): ContentFreshnessRecord[] {
    return Array.from(this.records.values());
  }

  public getStaleRecords(): ContentFreshnessRecord[] {
    return Array.from(this.records.values()).filter((r) => r.isStale);
  }

  private calculateNextReverificationDate(risk: ContentFreshness, fromDateStr: string): string {
    const from = new Date(fromDateStr);
    let daysToAdd = 90;

    switch (risk) {
      case 'Regulated':
        daysToAdd = 30; // 30 days for statutory & legal
        break;
      case 'Frequently Changing':
        daysToAdd = 45; // 45 days for SaaS pricing & fast-moving APIs
        break;
      case 'Time-Sensitive':
        daysToAdd = 15; // 15 days for time-sensitive releases
        break;
      case 'Evergreen':
      default:
        daysToAdd = 90; // 90 days for foundational architectures
        break;
    }

    from.setDate(from.getDate() + daysToAdd);
    return from.toISOString().split('T')[0];
  }
}

export const contentFreshnessEngine = ContentFreshnessEngine.getInstance();
