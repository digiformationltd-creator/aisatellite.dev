/**
 * AI Satellite — Phase 25 90-Day Operational Calendar Engine
 * Manages the 1,000-article operational publishing calendar across 90 days.
 * Canonical Production Domain: https://aisatellite.dev
 */

import { masterplanEngine } from '../editorial/masterplan-engine';
import {
  CATEGORY_TARGET_ALLOCATIONS,
  type EditorialPlanningCategory,
  EDITORIAL_PLANNING_CATEGORIES,
} from '../editorial/types';
import {
  OperationalCalendarEntrySchema,
  type OperationalCalendarEntry,
  type OperationalStage,
  OPERATIONAL_STAGES,
} from './types';

export class OperationalCalendarEngine {
  private entries: OperationalCalendarEntry[] = [];
  private isInitialized: boolean = false;

  constructor() {
    this.initializeCalendar();
  }

  public initializeCalendar(): void {
    if (this.isInitialized) return;

    const briefs = masterplanEngine.generateMasterplan();

    const researchers = [
      'Dr. Aris Thorne (Lead AI Researcher)',
      'Elena Rostova (Open-Source Analyst)',
      'Marcus Vance (Business Systems Researcher)',
      'Sarah Jenkins (Cloudflare & Tech Evaluator)',
      'Devon Croft (Developer Tools Specialist)',
    ];

    const writers = [
      'Agent F — Editorial Writer (Autonomous Core)',
      'Julian Hayes (Principal Technology Writer)',
      'Kavita Patel (Enterprise Solutions Writer)',
      'Liam O’Connor (Open-Source & Dev Advocate)',
      'Nadia Al-Mansoor (Global Business Specialist)',
    ];

    const editorialReviewers = [
      'Chief Editorial Officer (Human Lead)',
      'Senior Editorial Quality Controller',
      'Principal Systems Editor',
    ];

    const seoReviewers = [
      'Senior SEO/AEO/GEO Reviewer',
      'Technical SEO Director',
      'Search Discovery Architect',
    ];

    this.entries = briefs.map((brief, index) => {
      const day = brief.proposedPublicationDay;

      let stage: OperationalStage;
      if (day <= 15) {
        stage = OPERATIONAL_STAGES[0]; // Stage A (Days 1–15)
      } else if (day <= 40) {
        stage = OPERATIONAL_STAGES[1]; // Stage B (Days 16–40)
      } else if (day <= 70) {
        stage = OPERATIONAL_STAGES[2]; // Stage C (Days 41–70)
      } else {
        stage = OPERATIONAL_STAGES[3]; // Stage D (Days 71–90)
      }

      const assignedResearcher = researchers[index % researchers.length];
      const assignedWriter = writers[index % writers.length];
      const editorialReviewer = editorialReviewers[index % editorialReviewers.length];
      const seoReviewer = seoReviewers[index % seoReviewers.length];

      const hasCommercialCTA = brief.suggestedCTAOpportunity && brief.suggestedCTAOpportunity.partner !== 'none';
      const commercialDisclosureStatus = hasCommercialCTA
        ? ('required_and_verified' as const)
        : ('not_applicable' as const);

      const hour = 8 + (index % 12); // publication windows 08:00 to 20:00 UTC
      const minute = ((index * 7) % 60).toString().padStart(2, '0');
      const scheduledPublicationTime = `${hour.toString().padStart(2, '0')}:${minute} UTC`;

      const publicationUrl = `https://aisatellite.dev/blog/${brief.canonicalSlug}`;

      let targetWordCount = 2000;
      if (brief.suggestedArticleDepth.includes('800-1,500')) targetWordCount = 1200;
      else if (brief.suggestedArticleDepth.includes('1,500-2,500')) targetWordCount = 2000;
      else if (brief.suggestedArticleDepth.includes('2,500-4,000')) targetWordCount = 3200;
      else if (brief.suggestedArticleDepth.includes('4,000-5,000+')) targetWordCount = 4500;

      const rawEntry: OperationalCalendarEntry = {
        publicationDate: brief.proposedPublicationDate,
        articleId: brief.articleId,
        articleTitle: brief.proposedTitle,
        category: brief.topicCategory,
        topicCluster: brief.topicCluster,
        primaryKeyword: brief.primaryKeyword,
        searchIntent: brief.searchIntent,
        assignedResearcher,
        assignedWriter,
        factCheckingStatus: 'verified',
        editorialReviewer,
        seoReviewer,
        commercialDisclosureStatus,
        scheduledPublicationTime,
        finalApprovalStatus: day === 1 && index < 5 ? 'approved' : 'pending_approval',
        publicationUrl,
        postPublicationVerificationStatus: day === 1 && index < 3 ? 'verified_live' : 'pending_publish',
        dayNumber: day,
        stage,
        canonicalSlug: brief.canonicalSlug,
        targetWordCount,
        commercialPartner: (brief.suggestedCTAOpportunity?.partner as any) || 'none',
      };

      // Validate with Zod schema
      return OperationalCalendarEntrySchema.parse(rawEntry);
    });

    this.isInitialized = true;
  }

  public getAllEntries(): OperationalCalendarEntry[] {
    return [...this.entries];
  }

  public getEntryByArticleId(articleId: string): OperationalCalendarEntry | undefined {
    return this.entries.find((e) => e.articleId === articleId);
  }

  public getEntriesByDay(dayNumber: number): OperationalCalendarEntry[] {
    return this.entries.filter((e) => e.dayNumber === dayNumber);
  }

  public getEntriesByStage(stage: OperationalStage): OperationalCalendarEntry[] {
    return this.entries.filter((e) => e.stage === stage);
  }

  public getEntriesByCategory(category: EditorialPlanningCategory): OperationalCalendarEntry[] {
    return this.entries.filter((e) => e.category === category);
  }

  public getCategoryCounts(): Record<EditorialPlanningCategory, number> {
    const counts = {} as Record<EditorialPlanningCategory, number>;
    EDITORIAL_PLANNING_CATEGORIES.forEach((cat) => {
      counts[cat] = 0;
    });

    this.entries.forEach((e) => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });

    return counts;
  }

  public getCategoryTargetAllocations(): Record<EditorialPlanningCategory, number> {
    return { ...CATEGORY_TARGET_ALLOCATIONS };
  }

  public getStageBreakdown(): Record<OperationalStage, number> {
    const breakdown = {
      'Stage A — Foundation and Launch (Days 1–15)': 0,
      'Stage B — Topical Expansion (Days 16–40)': 0,
      'Stage C — Global Coverage (Days 41–70)': 0,
      'Stage D — Consolidation and Optimization (Days 71–90)': 0,
    };

    this.entries.forEach((e) => {
      breakdown[e.stage]++;
    });

    return breakdown;
  }

  public getDailyPaceAnalysis(): {
    totalPlannedArticles: number;
    totalDays: 90;
    averageDailyTarget: number;
    minDailyArticles: number;
    maxDailyArticles: number;
  } {
    const dayMap = new Map<number, number>();
    for (let d = 1; d <= 90; d++) {
      dayMap.set(d, 0);
    }

    this.entries.forEach((e) => {
      dayMap.set(e.dayNumber, (dayMap.get(e.dayNumber) || 0) + 1);
    });

    const counts = Array.from(dayMap.values());
    const minDailyArticles = Math.min(...counts);
    const maxDailyArticles = Math.max(...counts);
    const averageDailyTarget = Number((this.entries.length / 90).toFixed(2));

    return {
      totalPlannedArticles: this.entries.length,
      totalDays: 90,
      averageDailyTarget,
      minDailyArticles,
      maxDailyArticles,
    };
  }

  public updateApprovalStatus(articleId: string, status: 'approved' | 'rejected' | 'pending_approval'): boolean {
    const entry = this.entries.find((e) => e.articleId === articleId);
    if (!entry) return false;
    entry.finalApprovalStatus = status;
    return true;
  }

  public updateVerificationStatus(
    articleId: string,
    status: 'pending_publish' | 'verified_live' | 'verification_failed' | 'cached_stale'
  ): boolean {
    const entry = this.entries.find((e) => e.articleId === articleId);
    if (!entry) return false;
    entry.postPublicationVerificationStatus = status;
    return true;
  }
}

export const operationalCalendar = new OperationalCalendarEngine();
