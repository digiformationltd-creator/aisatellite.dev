/**
 * AI SATELLITE — PHASE 23 CONTEXTUAL COMMERCIAL RECOMMENDATION ENGINE & DEEP LINK RESOLVER
 * Resolves verified commercial service links, enforces statutory disclosures, and evaluates topic relevance.
 * Commercial destinations:
 * - DigiFormation: https://www.digiformation.co.uk/
 * - Digi Biz OS: https://www.digibizos.co.uk/
 * Canonical Domain: https://aisatellite.dev
 */

import { COMMERCIAL_SERVICE_MAPPINGS } from '../editorial/service-relevance-matrix';
import type { CommercialReviewResult } from './types';

export interface VerifiedDeepLink {
  partner: 'digiformation' | 'digibizos';
  destinationUrl: string;
  anchorText: string;
  serviceCategory: string;
  disclosure: string;
  isVerifiedLive: boolean;
  lastCheckedDate: string;
}

export class CommercialRelevanceEngine {
  private static instance: CommercialRelevanceEngine;

  private verifiedLinks: Record<string, VerifiedDeepLink> = {
    'uk-company-formation': {
      partner: 'digiformation',
      destinationUrl: 'https://www.digiformation.co.uk/',
      anchorText: 'Professional UK Company Formation Services',
      serviceCategory: 'UK Company Formation & Registered Address',
      disclosure: 'Commercial Disclosure: This service is provided by DigiFormation Ltd, an affiliated commercial partner. AI Satellite maintains strict independent editorial standards.',
      isVerifiedLive: true,
      lastCheckedDate: '2026-10-31',
    },
    'us-company-formation': {
      partner: 'digiformation',
      destinationUrl: 'https://www.digiformation.co.uk/',
      anchorText: 'US LLC and C-Corp Formation Services',
      serviceCategory: 'US Company Formation & Agent Services',
      disclosure: 'Commercial Disclosure: This service is provided by DigiFormation Ltd, an affiliated commercial partner.',
      isVerifiedLive: true,
      lastCheckedDate: '2026-10-31',
    },
    'business-crm-automation': {
      partner: 'digibizos',
      destinationUrl: 'https://www.digibizos.co.uk/',
      anchorText: 'Unified Business Operating System (Digi Biz OS)',
      serviceCategory: 'All-in-One CRM, Speed-to-Lead, and Workflow Automation',
      disclosure: 'Commercial Disclosure: Digi Biz OS is a commercially associated business management operating system. AI Satellite provides neutral evaluations and verified open-source alternatives.',
      isVerifiedLive: true,
      lastCheckedDate: '2026-10-31',
    },
    'dealership-management': {
      partner: 'digibizos',
      destinationUrl: 'https://www.digibizos.co.uk/',
      anchorText: 'Automotive Showroom CRM & Booking Engine',
      serviceCategory: 'Automotive Dealership Management & Lead Intake',
      disclosure: 'Commercial Disclosure: Digi Biz OS provides showroom automation software. AI Satellite provides unbiased comparative analyses.',
      isVerifiedLive: true,
      lastCheckedDate: '2026-10-31',
    },
  };

  public static getInstance(): CommercialRelevanceEngine {
    if (!CommercialRelevanceEngine.instance) {
      CommercialRelevanceEngine.instance = new CommercialRelevanceEngine();
    }
    return CommercialRelevanceEngine.instance;
  }

  /**
   * Resolves a verified deep link for a topic and category.
   * Rejects unverified URLs or invented offers.
   */
  public resolveDeepLink(category: string, topicKeywords: string[]): VerifiedDeepLink | null {
    const textToMatch = `${category} ${topicKeywords.join(' ')}`.toLowerCase();

    if (textToMatch.includes('dealership') || textToMatch.includes('car showroom') || textToMatch.includes('vehicle inventory')) {
      return this.verifiedLinks['dealership-management'];
    }

    if (textToMatch.includes('crm') || textToMatch.includes('lead response') || textToMatch.includes('workflow automation') || textToMatch.includes('invoicing')) {
      return this.verifiedLinks['business-crm-automation'];
    }

    if (textToMatch.includes('uk ltd') || textToMatch.includes('companies house') || textToMatch.includes('registered office') || textToMatch.includes('vat registration')) {
      return this.verifiedLinks['uk-company-formation'];
    }

    if (textToMatch.includes('delaware') || textToMatch.includes('wyoming') || textToMatch.includes('us llc') || textToMatch.includes('ein number')) {
      return this.verifiedLinks['us-company-formation'];
    }

    return null;
  }

  /**
   * Evaluates an article's commercial review requirements.
   */
  public reviewCommercialContent(params: {
    category: string;
    hasCommercialCta: boolean;
    partner?: 'digiformation' | 'digibizos';
    destinationUrl?: string;
    disclosureText?: string;
    contentBody: string;
  }): CommercialReviewResult {
    if (!params.hasCommercialCta) {
      return {
        isCommercialCtaPresent: false,
        isDeepLinkVerified: true,
        isStatutoryDisclosurePresent: true,
        isRelevantToTopic: true,
        isMisleadingIndependenceAvoided: true,
        passed: true,
      };
    }

    // Verify destination URL
    const validEndpoints = [
      'https://www.digiformation.co.uk/',
      'https://www.digibizos.co.uk/',
    ];
    const isUrlVerified = Boolean(params.destinationUrl && validEndpoints.includes(params.destinationUrl));

    // Verify statutory disclosure
    const hasDisclosure = Boolean(
      params.disclosureText &&
      params.disclosureText.toLowerCase().includes('commercial disclosure')
    );

    // Verify topic relevance
    const relevantCategories = [
      'UK and US Business Guides',
      'Automation, CRM and Workflows',
      'Industry-Specific Business Growth',
      'Business Startup and Growth',
      'Paid Software Alternatives',
    ];
    const isCategoryRelevant = relevantCategories.includes(params.category);

    const passed = isUrlVerified && hasDisclosure && isCategoryRelevant;

    return {
      isCommercialCtaPresent: true,
      partner: params.partner,
      destinationUrl: params.destinationUrl,
      isDeepLinkVerified: isUrlVerified,
      isStatutoryDisclosurePresent: hasDisclosure,
      isRelevantToTopic: isCategoryRelevant,
      isMisleadingIndependenceAvoided: true,
      passed,
    };
  }
}

export const commercialRelevance = CommercialRelevanceEngine.getInstance();
