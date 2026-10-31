import crypto from 'node:crypto';
import type {
  AnalyticsEvent,
  AnalyticsEventType,
  AnalyticsSummaryReport,
} from '../schemas/index.js';
import { GrowthLogger } from '../monitoring/growth-logger.js';
import { growthStorage } from '../storage/growth-storage.js';

export class PrivacyAnalytics {
  private logger: GrowthLogger;

  constructor(baseDir = process.cwd()) {
    this.logger = new GrowthLogger('PrivacyAnalytics', baseDir);
  }

  private generateDailySessionHash(rawClientHint: string): string {
    const today = new Date().toISOString().slice(0, 10);
    return crypto.createHash('sha256').update(`${rawClientHint}-${today}-privacy-salt`).digest('hex').substring(0, 16);
  }

  /**
   * Records a privacy-conscious analytics event
   */
  recordEvent(params: {
    eventType: AnalyticsEventType;
    url: string;
    referrer?: string;
    metadata?: Record<string, unknown>;
    clientHint?: string;
  }): AnalyticsEvent {
    const dailySessionHash = this.generateDailySessionHash(params.clientHint || 'anonymous-session');

    const event: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventType: params.eventType,
      url: params.url,
      referrer: params.referrer,
      metadata: params.metadata,
      timestamp: new Date().toISOString(),
      dailySessionHash,
    };

    growthStorage.appendAnalyticsEvent(event);
    return event;
  }

  /**
   * Generates a factual, privacy-compliant summary report from real recorded events
   */
  generateSummaryReport(period = 'last_30_days'): AnalyticsSummaryReport {
    const events = growthStorage.getAnalyticsEvents();

    let pageViews = 0;
    let searches = 0;
    let githubReferrals = 0;
    let newsletterConversions = 0;
    let contributionsCount = 0;

    const queryCounts = new Map<string, number>();
    const zeroResultSearches: string[] = [];
    const pageCounts = new Map<string, number>();
    const toolCounts = new Map<string, number>();
    const demoCounts = new Map<string, number>();

    for (const evt of events) {
      if (evt.eventType === 'page_view') {
        pageViews++;
        pageCounts.set(evt.url, (pageCounts.get(evt.url) || 0) + 1);
      } else if (evt.eventType === 'search_performed') {
        searches++;
        const q = String(evt.metadata?.query || '').trim().toLowerCase();
        if (q) {
          queryCounts.set(q, (queryCounts.get(q) || 0) + 1);
          if (evt.metadata?.resultCount === 0) {
            zeroResultSearches.push(q);
          }
        }
      } else if (evt.eventType === 'github_repository_click') {
        githubReferrals++;
      } else if (evt.eventType === 'newsletter_subscribe' || evt.eventType === 'newsletter_confirm') {
        newsletterConversions++;
      } else if (evt.eventType === 'contribution_complete') {
        contributionsCount++;
      } else if (evt.eventType === 'tool_detail_view') {
        const tool = String(evt.metadata?.toolSlug || evt.url);
        toolCounts.set(tool, (toolCounts.get(tool) || 0) + 1);
      } else if (evt.eventType === 'demo_open') {
        const demo = String(evt.metadata?.demoSlug || evt.url);
        demoCounts.set(demo, (demoCounts.get(demo) || 0) + 1);
      }
    }

    const topQueries = Array.from(queryCounts.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topPages = Array.from(pageCounts.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topTools = Array.from(toolCounts.entries())
      .map(([tool, count]) => ({ tool, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topDemos = Array.from(demoCounts.entries())
      .map(([demo, count]) => ({ demo, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const report: AnalyticsSummaryReport = {
      period,
      totalEvents: events.length,
      pageViews,
      searches,
      zeroResultSearches: Array.from(new Set(zeroResultSearches)).slice(0, 10),
      topQueries,
      topPages,
      topTools,
      topDemos,
      githubReferrals,
      newsletterConversions,
      contributionsCount,
      isEstimated: false, // Strictly factual measured data
    };

    this.logger.info(`Generated privacy analytics report (${events.length} total recorded events)`);
    return report;
  }
}

export const privacyAnalytics = new PrivacyAnalytics();
