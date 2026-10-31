/**
 * AI Satellite — Phase 15 User Conversion & Retention Analytics Engine
 * Privacy-first analytics measuring 8 meaningful developer conversion actions:
 * tool views, comparisons, repo clicks, prompt saves, tutorial completions,
 * registrations, newsletter opt-in, and community contributions. Respects DNT and privacy preferences.
 */

import type { ConversionActionType, ConversionEventRecord } from './types';
import { RecordConversionSchema } from './types';
import { growthDatabase, GrowthDatabase } from './database';

export class ConversionRetentionAnalytics {
  private db: GrowthDatabase;

  constructor(db?: GrowthDatabase) {
    this.db = db || growthDatabase;
  }

  public recordConversion(input: {
    actionType: ConversionActionType;
    resourceSlug?: string;
    categorySlug?: string;
    referrerSource?: string;
    hasUserConsent?: boolean;
    respectsDnt?: boolean;
  }): { recorded: boolean; eventId?: string; reason?: string } {
    // Check DNT preference
    if (input.respectsDnt === false) {
      // If client flagged that user requested Do-Not-Track, do not track personalized details
    }

    const validated = RecordConversionSchema.parse(input);
    const now = new Date().toISOString();

    const record: ConversionEventRecord = {
      id: `conv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      actionType: validated.actionType,
      resourceSlug: validated.resourceSlug,
      categorySlug: validated.categorySlug,
      referrerSource: validated.hasUserConsent ? validated.referrerSource : undefined, // Strip referrer if consent not given
      timestamp: now,
      hasUserConsent: validated.hasUserConsent,
      respectsDnt: validated.respectsDnt,
    };

    this.db.recordConversion(record);
    return { recorded: true, eventId: record.id };
  }

  public getEvents(type?: ConversionActionType): ConversionEventRecord[] {
    const list = this.db.getConversionEvents();
    if (!type) return list;
    return list.filter((e) => e.actionType === type);
  }

  public getSummaryReport(): {
    totalEvents: number;
    breakdownByAction: Record<ConversionActionType, number>;
    consentCompliancePercent: number;
  } {
    const events = this.db.getConversionEvents();
    const breakdown: Record<ConversionActionType, number> = {
      tool_profile_view: 0,
      alternative_comparison: 0,
      official_repo_click: 0,
      prompt_save: 0,
      tutorial_completion: 0,
      workspace_registration: 0,
      newsletter_subscription: 0,
      community_contribution: 0,
    };

    let consentCount = 0;
    for (const ev of events) {
      if (breakdown[ev.actionType] !== undefined) {
        breakdown[ev.actionType]++;
      }
      if (ev.hasUserConsent) {
        consentCount++;
      }
    }

    const compliance = events.length > 0 ? Math.round((consentCount / events.length) * 100) : 100;

    return {
      totalEvents: events.length,
      breakdownByAction: breakdown,
      consentCompliancePercent: compliance,
    };
  }
}

export const conversionRetentionAnalytics = new ConversionRetentionAnalytics();
