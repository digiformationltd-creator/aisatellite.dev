import { describe, it, expect } from 'vitest';
import { PrivacyAnalytics } from '../../growth/analytics/privacy-analytics.js';
import { AnalyticsEventSchema } from '../../growth/schemas/index.js';

describe('Acceptance Test 27: Privacy-Conscious Analytics & Schema Integrity', () => {
  const analytics = new PrivacyAnalytics();

  it('Test 27: Analytics events are strictly schema-valid across all 15 core event types', () => {
    const testEvents = [
      'page_view',
      'search_performed',
      'search_result_click',
      'tool_detail_view',
      'alternative_comparison_view',
      'github_repository_click',
      'download_click',
      'demo_open',
      'prompt_copy',
      'newsletter_subscribe',
      'newsletter_confirm',
      'newsletter_unsubscribe',
      'social_referral',
      'contribution_start',
      'contribution_complete',
    ] as const;

    for (const evtType of testEvents) {
      const recorded = analytics.recordEvent({
        eventType: evtType,
        url: '/tools/ollama',
        metadata: { source: 'test-suite' },
      });

      // Strict Zod validation
      const parseResult = AnalyticsEventSchema.safeParse(recorded);
      expect(parseResult.success).toBe(true);
      expect(recorded.dailySessionHash).toBeDefined();
    }

    const summary = analytics.generateSummaryReport();
    expect(summary.totalEvents).toBeGreaterThan(0);
    expect(summary.isEstimated).toBe(false);
  });
});
