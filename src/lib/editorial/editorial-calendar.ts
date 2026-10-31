/**
 * AI Satellite — Phase 22 90-Day Editorial Calendar Engine
 * Manages the day-by-day publishing schedule across all 4 publishing stages.
 * Total horizon: 90 days (Days 1 to 90).
 * Total articles: Exactly 1,000 (~11.1 articles/day).
 * Canonical Production Domain: https://aisatellite.dev
 */

import type { EditorialCalendarDaySlot, PublishingStage } from './types';
import { masterplanEngine } from './masterplan-engine';

export class EditorialCalendarEngine {
  private static instance: EditorialCalendarEngine;

  public static getInstance(): EditorialCalendarEngine {
    if (!EditorialCalendarEngine.instance) {
      EditorialCalendarEngine.instance = new EditorialCalendarEngine();
    }
    return EditorialCalendarEngine.instance;
  }

  /**
   * Generates the day-by-day calendar slots for all 90 days.
   */
  public generateCalendar(): EditorialCalendarDaySlot[] {
    const briefs = masterplanEngine.generateMasterplan();
    const days: EditorialCalendarDaySlot[] = [];

    // Group briefs by publication day (1 to 90)
    const dayBuckets = new Map<number, typeof briefs>();
    for (let d = 1; d <= 90; d++) {
      dayBuckets.set(d, []);
    }

    briefs.forEach((b) => {
      const bucket = dayBuckets.get(b.proposedPublicationDay) || [];
      bucket.push(b);
      dayBuckets.set(b.proposedPublicationDay, bucket);
    });

    for (let d = 1; d <= 90; d++) {
      const assigned = dayBuckets.get(d) || [];
      const baseDate = new Date('2026-11-01T08:00:00Z');
      baseDate.setDate(baseDate.getDate() + (d - 1));
      const scheduledDate = baseDate.toISOString().split('T')[0];

      let stage: PublishingStage;
      let focus: string;

      if (d <= 15) {
        stage = 'Stage 1 — Foundation (Days 1–15)';
        focus = 'Flagship Pillar Guides, Core Free AI Tools & Foundational Business Launchpads';
      } else if (d <= 40) {
        stage = 'Stage 2 — Topical Expansion (Days 16–40)';
        focus = 'Supporting Topic Clusters, Open-Source Repositories & Automated CRM Workflows';
      } else if (d <= 70) {
        stage = 'Stage 3 — Coverage Expansion (Days 41–70)';
        focus = 'Deep Software Alternative Comparisons, Vertical Industry Guides & International Laws';
      } else {
        stage = 'Stage 4 — Quality Consolidation (Days 71–90)';
        focus = 'Long-Tail Problem Solving, Developer Tutorials, Content Freshness & Linking Audits';
      }

      const categoryBreakdown: Record<string, number> = {};
      assigned.forEach((b) => {
        categoryBreakdown[b.topicCategory] = (categoryBreakdown[b.topicCategory] || 0) + 1;
      });

      days.push({
        dayNumber: d,
        stage,
        scheduledDate,
        plannedArticleIds: assigned.map((b) => b.articleId),
        categoryBreakdown,
        editorialFocus: focus,
        dailyTarget: assigned.length,
      });
    }

    return days;
  }

  /**
   * Summary metrics of the 90-day calendar.
   */
  public getCalendarSummary() {
    const calendar = this.generateCalendar();
    const totalScheduled = calendar.reduce((acc, slot) => acc + slot.dailyTarget, 0);
    const minDay = Math.min(...calendar.map((s) => s.dailyTarget));
    const maxDay = Math.max(...calendar.map((s) => s.dailyTarget));
    const avgDay = (totalScheduled / calendar.length).toFixed(1);

    const stageBreakdown: Record<string, { days: number; articles: number }> = {};
    calendar.forEach((slot) => {
      if (!stageBreakdown[slot.stage]) {
        stageBreakdown[slot.stage] = { days: 0, articles: 0 };
      }
      stageBreakdown[slot.stage].days++;
      stageBreakdown[slot.stage].articles += slot.dailyTarget;
    });

    return {
      totalDays: calendar.length,
      totalScheduledArticles: totalScheduled,
      minArticlesPerDay: minDay,
      maxArticlesPerDay: maxDay,
      avgArticlesPerDay: Number(avgDay),
      stageBreakdown,
    };
  }
}

export const editorialCalendar = EditorialCalendarEngine.getInstance();
