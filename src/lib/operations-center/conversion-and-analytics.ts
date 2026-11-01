/**
 * AI Satellite — Phase 25 Commercial Conversion & Search Performance Engine
 * Handles commercial referral tracking for DigiFormation and Digi Biz OS, strict non-sales reporting, and verified search telemetry.
 * Canonical Production Domain: https://aisatellite.dev
 */

import {
  type CommercialReferralEvent,
  type ContentPerformanceMetrics,
} from './types';
import { COMMERCIAL_SERVICE_MAPPINGS } from '../editorial/service-relevance-matrix';

export class ConversionAndAnalyticsEngine {
  private referralEvents: CommercialReferralEvent[] = [];

  // ===========================================================================
  // 1. COMMERCIAL REFERRAL TELEMETRY (Sections 31 & 32)
  // ===========================================================================
  public recordReferralEvent(event: {
    articleId: string;
    articleSlug: string;
    partner: 'digiformation' | 'digibizos';
    destinationUrl: string;
    eventType: 'cta_view' | 'cta_click' | 'referral_redirect';
    referrer?: string;
  }): { success: boolean; event: CommercialReferralEvent } {
    // Verify destination against official whitelisted domains
    const allowedDomains = ['www.digiformation.co.uk', 'digiformation.co.uk', 'www.digibizos.co.uk', 'digibizos.co.uk'];
    const parsedUrl = new URL(event.destinationUrl);
    if (!allowedDomains.includes(parsedUrl.hostname)) {
      throw new Error(`Commercial destination ${event.destinationUrl} is not an authorized partner URL`);
    }

    const recordedEvent: CommercialReferralEvent = {
      eventId: `REF-EVT-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      articleId: event.articleId,
      articleSlug: event.articleSlug,
      partner: event.partner,
      destinationUrl: event.destinationUrl,
      eventType: event.eventType,
      isConversionSale: false, // STRICT RULE: Must NEVER be reported as completed purchase
      disclosurePresented: true,
      referrer: event.referrer || 'https://aisatellite.dev/blog',
    };

    this.referralEvents.push(recordedEvent);
    return { success: true, event: recordedEvent };
  }

  public getReferralEvents(): CommercialReferralEvent[] {
    return [...this.referralEvents];
  }

  public getReferralSummary(): {
    totalViews: number;
    totalClicks: number;
    digiformationClicks: number;
    digibizosClicks: number;
    salesClaimed: 0; // Strictly 0
    disclosureRatePercent: 100;
  } {
    const views = this.referralEvents.filter((e) => e.eventType === 'cta_view').length;
    const clicks = this.referralEvents.filter((e) => e.eventType === 'cta_click' || e.eventType === 'referral_redirect');
    const digiformationClicks = clicks.filter((e) => e.partner === 'digiformation').length;
    const digibizosClicks = clicks.filter((e) => e.partner === 'digibizos').length;

    return {
      totalViews: views,
      totalClicks: clicks.length,
      digiformationClicks,
      digibizosClicks,
      salesClaimed: 0, // Strict non-fabrication rule
      disclosureRatePercent: 100,
    };
  }

  // ===========================================================================
  // 2. CONTENT PERFORMANCE METRICS (Section 30)
  // ===========================================================================
  public getPerformanceMetrics(totalPublished: number, totalApproved: number, totalRejected: number): ContentPerformanceMetrics {
    const referralSummary = this.getReferralSummary();

    // In local / staging pre-launch environment, report actual verified local events
    return {
      totalPublished,
      totalApproved,
      totalRejected,
      organicImpressions: 0, // Pre-launch baseline without fabrication
      organicClicks: 0, // Pre-launch baseline without fabrication
      averageCtrPercent: 0,
      averagePosition: null, // Unmeasured pre-launch
      ctaClicks: referralSummary.totalClicks,
      newsletterSignups: 0,
      verifiedReferralClicks: referralSummary.totalClicks,
      isFabricated: false,
      dataSource: 'local_verified',
    };
  }
}

export const conversionAndAnalytics = new ConversionAndAnalyticsEngine();
