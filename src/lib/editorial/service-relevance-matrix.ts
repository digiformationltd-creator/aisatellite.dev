/**
 * AI Satellite — Phase 22 Commercial Service Relevance Matrix
 * Maps verified commercial capabilities of DigiFormation & Digi Biz OS
 * strictly to relevant business challenges with transparent disclosures.
 * Canonical Production Domain: https://aisatellite.dev
 */

import type { CommercialServiceMapping, EditorialPlanningCategory } from './types';

export const COMMERCIAL_SERVICE_MAPPINGS: CommercialServiceMapping[] = [
  {
    provider: 'DigiFormation Ltd',
    canonicalUrl: 'https://www.digiformation.co.uk/',
    serviceCategory: 'UK Limited Company Formation & Registered Office',
    eligibleGeographies: ['United Kingdom', 'Global', 'South Asia', 'Middle East', 'European Union'],
    eligibleCategories: ['UK and US Business Guides', 'Business Startup and Growth'],
    triggerKeywords: [
      'uk ltd',
      'company formation',
      'incorporate in uk',
      'companies house',
      'registered office address',
      'international founder banking',
      'stripe for non resident',
    ],
    disclosureText:
      'Commercial Disclosure: DigiFormation Ltd is an official corporate formation partner of AI Satellite. We receive a commercial benefit if you engage their services.',
    verificationTimestamp: '2026-10-31T00:00:00Z',
  },
  {
    provider: 'DigiFormation Ltd',
    canonicalUrl: 'https://www.digiformation.co.uk/',
    serviceCategory: 'Bespoke Enterprise Web & Digital Systems Engineering',
    eligibleGeographies: ['United Kingdom', 'European Union', 'Global'],
    eligibleCategories: ['Industry-Specific Business Growth', 'Business Startup and Growth'],
    triggerKeywords: [
      'dealership website',
      'clinic appointment portal',
      'bespoke web development',
      'high-conversion business website',
      'digital inventory showcase',
    ],
    disclosureText:
      'Commercial Disclosure: DigiFormation provides professional engineering services and is commercially associated with AI Satellite.',
    verificationTimestamp: '2026-10-31T00:00:00Z',
  },
  {
    provider: 'Digi Biz OS',
    canonicalUrl: 'https://www.digibizos.co.uk/',
    serviceCategory: 'All-in-One Business Operating System (CRM, Invoicing, Scheduling)',
    eligibleGeographies: ['Global', 'United Kingdom', 'United States', 'European Union'],
    eligibleCategories: [
      'Automation, CRM and Workflows',
      'Industry-Specific Business Growth',
      'Business Startup and Growth',
      'Paid Software Alternatives',
    ],
    triggerKeywords: [
      'crm for agencies',
      'business operating system',
      'all in one saas alternative',
      'client invoicing pipeline',
      'automated appointment scheduling',
      'replace hubspot',
      'replace salesforce',
    ],
    disclosureText:
      'Commercial Disclosure: Digi Biz OS is an official partner platform. Editorial rankings remain objective.',
    verificationTimestamp: '2026-10-31T00:00:00Z',
  },
  {
    provider: 'Digi Biz OS',
    canonicalUrl: 'https://www.digibizos.co.uk/',
    serviceCategory: 'Instant 60-Second Inbound Lead Response & Dealership Pipeline Automation',
    eligibleGeographies: ['Global', 'United Kingdom', 'United States'],
    eligibleCategories: [
      'Industry-Specific Business Growth',
      'Automation, CRM and Workflows',
    ],
    triggerKeywords: [
      'dealership crm',
      'car showroom lead generation',
      'inbound lead response automation',
      'test drive booking automation',
      'clinic patient reminder pipeline',
      'trade in follow up cadence',
    ],
    disclosureText:
      'Commercial Disclosure: Digi Biz OS is a featured partner software platform for local service automation.',
    verificationTimestamp: '2026-10-31T00:00:00Z',
  },
];

export function findCommercialMapping(
  category: EditorialPlanningCategory,
  keywords: string[],
  geography = 'Global'
): CommercialServiceMapping | null {
  const combined = [category, ...keywords, geography].join(' ').toLowerCase();

  for (const mapping of COMMERCIAL_SERVICE_MAPPINGS) {
    if (mapping.eligibleCategories.includes(category)) {
      const matchesKeyword = mapping.triggerKeywords.some((tk) => combined.includes(tk));
      if (matchesKeyword) {
        return mapping;
      }
    }
  }

  return null;
}
