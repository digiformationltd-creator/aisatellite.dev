/**
 * AI Satellite — Phase 21 Contextual CTA Engine
 * Intelligent Contextual Recommendation Matcher and Telemetry Tracker
 * Ensures accurate, transparent, and contextually relevant recommendations.
 * Canonical Domain: https://aisatellite.dev
 */

import type {
  ContextualCTAConfig,
  CTAComponentType,
  CTAAnalyticsEvent,
  ArticleEngagementEvent,
} from './types';
import { serviceCatalogue } from './service-catalogue';
import { blogDatabase } from './database';

export interface CTAMatchRequest {
  articleId: string;
  category: string;
  tags: string[];
  sectionTopic?: string;
  jurisdiction?: string;
}

export class CTAEngine {
  private static instance: CTAEngine;

  public static getInstance(): CTAEngine {
    if (!CTAEngine.instance) {
      CTAEngine.instance = new CTAEngine();
    }
    return CTAEngine.instance;
  }

  /**
   * Generates a contextually matched CTA configuration based on the article's topic,
   * tags, and optional section topic.
   */
  public matchCTA(request: CTAMatchRequest): ContextualCTAConfig | null {
    const { articleId, category, tags, sectionTopic = '', jurisdiction = 'Global' } = request;
    const combinedContext = [category, ...tags, sectionTopic, jurisdiction].join(' ').toLowerCase();

    // 1. Check for Car Dealership / Local Business / CRM & Automation context -> Digi Biz OS
    if (
      combinedContext.includes('dealership') ||
      combinedContext.includes('crm') ||
      combinedContext.includes('lead generation') ||
      combinedContext.includes('customer follow-up') ||
      combinedContext.includes('business operating system')
    ) {
      const isLeadGenOrFollowUp =
        combinedContext.includes('follow-up') ||
        combinedContext.includes('lead capture') ||
        combinedContext.includes('dealership');

      if (isLeadGenOrFollowUp) {
        return {
          id: `cta-${articleId}-digibizos-crm`,
          type: 'Relevant Service Card',
          title: 'Automate Dealership Lead Follow-Up & CRM Pipelines',
          description:
            'Never let an inbound test drive or financing inquiry go cold. Digi Biz OS captures leads instantly and triggers automated SMS/email sequences within 60 seconds.',
          destinationUrl: 'https://www.digibizos.co.uk/',
          buttonLabel: 'Explore Digi Biz OS Solutions',
          partner: 'digibizos',
          disclosure: 'Commercial recommendation: Digi Biz OS is a verified platform partner.',
          serviceId: 'digibizos-crm-automation',
          relevantCategory: category,
          relevantTags: tags,
          active: true,
        };
      }

      return {
        id: `cta-${articleId}-digibizos-os`,
        type: 'Software Solution Card',
        title: 'Unify Your Business Operations in One Operating System',
        description:
          'Replace fragmented SaaS subscriptions with Digi Biz OS: integrated CRM, automated client billing, calendar scheduling, and pipeline management.',
        destinationUrl: 'https://www.digibizos.co.uk/',
        buttonLabel: 'View Digi Biz OS Platform',
        partner: 'digibizos',
        disclosure: 'Commercial recommendation: Digi Biz OS is an official partner destination.',
        serviceId: 'digibizos-all-in-one-os',
        relevantCategory: category,
        relevantTags: tags,
        active: true,
      };
    }

    // 2. Check for UK Company Formation / Stripe & Banking / Legal Setup -> DigiFormation
    if (
      combinedContext.includes('uk business') ||
      combinedContext.includes('incorporation') ||
      combinedContext.includes('uk ltd') ||
      combinedContext.includes('company formation') ||
      combinedContext.includes('stripe') ||
      combinedContext.includes('international business')
    ) {
      return {
        id: `cta-${articleId}-digiformation-ltd`,
        type: 'Relevant Service Card',
        title: 'Form Your UK Limited Company with International Support',
        description:
          'Get official Companies House incorporation, a prestigious Central London registered office, and direct guidance for international merchant accounts via DigiFormation.',
        destinationUrl: 'https://www.digiformation.co.uk/',
        buttonLabel: 'Get Started with DigiFormation',
        partner: 'digiformation',
        disclosure: 'Commercial recommendation: DigiFormation is an official legal and incorporation partner.',
        serviceId: 'digiformation-uk-ltd',
        relevantCategory: category,
        relevantTags: tags,
        active: true,
      };
    }

    // 3. Check for Website Engineering / Digital Portal context -> DigiFormation Web
    if (
      combinedContext.includes('website development') ||
      combinedContext.includes('digital systems') ||
      combinedContext.includes('bespoke portal')
    ) {
      return {
        id: `cta-${articleId}-digiformation-web`,
        type: 'Consultation Link',
        title: 'Need Bespoke Digital Systems & High-Conversion Web Architecture?',
        description:
          'DigiFormation provides enterprise-grade web engineering, inventory portals, and seamless API integrations for ambitious service companies.',
        destinationUrl: 'https://www.digiformation.co.uk/',
        buttonLabel: 'Request Technical Consultation',
        partner: 'digiformation',
        disclosure: 'Commercial recommendation: DigiFormation provides professional web engineering services.',
        serviceId: 'digiformation-web-development',
        relevantCategory: category,
        relevantTags: tags,
        active: true,
      };
    }

    // 4. Default to Free Tools / Open-Source Tool Card
    return {
      id: `cta-${articleId}-free-tools`,
      type: 'Related Free Tool Card',
      title: 'Explore AI Satellite Free Developer Tools & Open-Source Vault',
      description:
        'Discover 100% verified free software, self-hosted developer tools, and open-source database alternatives with zero licensing costs.',
      destinationUrl: 'https://aisatellite.dev/alternatives',
      buttonLabel: 'Browse Free Alternatives',
      partner: 'free_tool',
      disclosure: 'Editorial resource: 100% free and open-source software curated by AI Satellite.',
      relevantCategory: category,
      relevantTags: tags,
      active: true,
    };
  }

  /**
   * Records a CTA impression event in the blog store.
   */
  public recordImpression(articleId: string, ctaId: string, destinationUrl: string, placementType = 'inline'): CTAAnalyticsEvent {
    const event: CTAAnalyticsEvent = {
      id: `imp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      articleId,
      ctaId,
      destinationUrl,
      placementType,
      timestamp: new Date().toISOString(),
      eventType: 'impression',
    };
    blogDatabase.recordCTAEvent(event);
    return event;
  }

  /**
   * Records a CTA click event in the blog store.
   */
  public recordClick(
    articleId: string,
    ctaId: string,
    destinationUrl: string,
    placementType = 'inline',
    referrer?: string
  ): CTAAnalyticsEvent {
    const event: CTAAnalyticsEvent = {
      id: `clk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      articleId,
      ctaId,
      destinationUrl,
      placementType,
      timestamp: new Date().toISOString(),
      eventType: 'click',
      referrer,
    };
    blogDatabase.recordCTAEvent(event);

    // Also record general engagement
    const engagement: ArticleEngagementEvent = {
      id: `eng-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      articleId,
      eventType: 'ContextualCTAOpened',
      timestamp: new Date().toISOString(),
      metadata: { ctaId, destinationUrl, placementType },
    };
    blogDatabase.recordEngagementEvent(engagement);

    return event;
  }
}

export const ctaEngine = CTAEngine.getInstance();
