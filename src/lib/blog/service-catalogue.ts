/**
 * AI Satellite — Phase 21 Verified Commercial Service Catalogue
 * Independent Editorial Registry for Verified Commercial Destinations
 * Canonical Destinations:
 * - DigiFormation: https://www.digiformation.co.uk/
 * - Digi Biz OS: https://www.digibizos.co.uk/
 */

import type { ServiceCatalogueItem } from './types';

export const VERIFIED_SERVICE_CATALOGUE: ServiceCatalogueItem[] = [
  {
    id: 'digiformation-uk-ltd',
    provider: 'DigiFormation Ltd',
    name: 'DigiFormation UK LTD Formation & Corporate Compliance',
    description:
      'Official UK Companies House company formation for international entrepreneurs and software agencies. Includes London registered office address, statutory compliance filings, and global banking readiness support.',
    relevantProblems: [
      'International founder UK company registration',
      'Need prestigious UK registered office address',
      'Stripe & Wise international merchant setup requirements',
      'Statutory Companies House & HMRC compliance',
      'UK agency and consultancy corporate structuring',
    ],
    targetAudience: [
      'International Tech Founders',
      'Remote Software Agencies',
      'Freelancers transitioning to LTD',
      'Global SaaS Operators',
    ],
    jurisdiction: ['United Kingdom', 'Global International'],
    officialUrl: 'https://www.digiformation.co.uk/',
    offerInformation: 'Transparent package pricing with official Companies House registration fees included.',
    eligibilityNotes: 'Requires valid government identity verification (KYC/AML) per UK statutory regulations.',
    lastVerifiedDate: '2026-10-31T00:00:00Z',
    active: true,
    editoriallyApproved: true,
    badge: 'Verified Legal Partner',
    accentColor: 'cyan',
  },
  {
    id: 'digiformation-web-development',
    provider: 'DigiFormation Ltd',
    name: 'DigiFormation Bespoke Digital Systems & Web Engineering',
    description:
      'Professional enterprise website engineering, bespoke client portal architecture, and conversion-optimized digital platforms for growing service businesses, clinics, and automotive dealerships.',
    relevantProblems: [
      'High-converting local business website development',
      'Dealership and showroom digital inventory showcase',
      'Healthcare and clinic appointment booking integrations',
      'Modern web application and API integrations',
    ],
    targetAudience: [
      'Automotive Dealerships',
      'Healthcare & Dental Clinics',
      'Service Businesses & Consultancies',
      'High-Growth Agencies',
    ],
    jurisdiction: ['United Kingdom', 'Europe', 'Global'],
    officialUrl: 'https://www.digiformation.co.uk/',
    offerInformation: 'Custom project scope with dedicated engineering milestone delivery.',
    eligibilityNotes: 'Direct client consultation required to assess systems architecture and technical scope.',
    lastVerifiedDate: '2026-10-31T00:00:00Z',
    active: true,
    editoriallyApproved: true,
    badge: 'Verified Technology Partner',
    accentColor: 'cyan',
  },
  {
    id: 'digibizos-all-in-one-os',
    provider: 'Digi Biz OS',
    name: 'Digi Biz OS Unified Business Operating System',
    description:
      'Consolidated business management platform integrating multi-channel customer relationship management (CRM), automated invoicing, client appointment booking, pipeline tracking, and workflow automation in a single pane of glass.',
    relevantProblems: [
      'Disjointed SaaS subscription fatigue ($500+/mo across 6 tools)',
      'Lost sales leads due to delayed manual follow-up',
      'Inefficient automotive showroom and clinic lead pipelines',
      'Manual client billing and invoice chasing',
      'Lack of unified real-time business performance analytics',
    ],
    targetAudience: [
      'B2B Agencies & Consultancies',
      'Automotive Dealerships & Showrooms',
      'Professional Service Practices',
      'Service SMEs & Growth Founders',
    ],
    jurisdiction: ['Global', 'United Kingdom', 'United States', 'Europe'],
    officialUrl: 'https://www.digibizos.co.uk/',
    offerInformation: 'Unified all-in-one platform subscription replacing 5+ standalone operational SaaS tools.',
    eligibilityNotes: 'Cloud-delivered workspace with rapid onboarding and migration assistance.',
    lastVerifiedDate: '2026-10-31T00:00:00Z',
    active: true,
    editoriallyApproved: true,
    badge: 'Featured Business OS',
    accentColor: 'emerald',
  },
  {
    id: 'digibizos-crm-automation',
    provider: 'Digi Biz OS',
    name: 'Digi Biz OS Lead Capture & CRM Automation Engine',
    description:
      'Automated multi-channel inbound lead intake, instantaneous 60-second SMS/email follow-up sequences, appointment booking calendar, and sales deal tracking built specifically for local and high-ticket service businesses.',
    relevantProblems: [
      'Dealership incoming test drive and finance inquiry follow-up',
      'Clinic appointment booking and automated reminder sequences',
      'Customer review collection and reputation management automation',
      'Multi-stage sales deal stage visualization and tracking',
    ],
    targetAudience: [
      'Car Dealerships & Showrooms',
      'Healthcare Providers',
      'Real Estate Agencies',
      'Consultants & Coaches',
    ],
    jurisdiction: ['Global', 'United Kingdom', 'United States'],
    officialUrl: 'https://www.digibizos.co.uk/',
    offerInformation: 'Ready-to-deploy industry pipeline templates with automated messaging triggers.',
    eligibilityNotes: 'Standard business telecommunications compliance applies for SMS and email campaigns.',
    lastVerifiedDate: '2026-10-31T00:00:00Z',
    active: true,
    editoriallyApproved: true,
    badge: 'Automated CRM Engine',
    accentColor: 'emerald',
  },
];

export class ServiceCatalogueService {
  private static instance: ServiceCatalogueService;

  public static getInstance(): ServiceCatalogueService {
    if (!ServiceCatalogueService.instance) {
      ServiceCatalogueService.instance = new ServiceCatalogueService();
    }
    return ServiceCatalogueService.instance;
  }

  public getAll(): ServiceCatalogueItem[] {
    return VERIFIED_SERVICE_CATALOGUE.filter((item) => item.active && item.editoriallyApproved);
  }

  public getById(id: string): ServiceCatalogueItem | undefined {
    return VERIFIED_SERVICE_CATALOGUE.find((item) => item.id === id);
  }

  public getByProvider(provider: string): ServiceCatalogueItem[] {
    return VERIFIED_SERVICE_CATALOGUE.filter(
      (item) => item.provider.toLowerCase().includes(provider.toLowerCase()) && item.active
    );
  }

  public findRelevant(category: string, tags: string[], problemDescription?: string): ServiceCatalogueItem[] {
    const searchTerms = [category, ...tags, ...(problemDescription ? [problemDescription] : [])]
      .join(' ')
      .toLowerCase();

    return VERIFIED_SERVICE_CATALOGUE.filter((item) => {
      if (!item.active || !item.editoriallyApproved) return false;
      const problemMatch = item.relevantProblems.some((p) => searchTerms.includes(p.toLowerCase()));
      const audienceMatch = item.targetAudience.some((a) => searchTerms.includes(a.toLowerCase()));
      const keywordMatch =
        (searchTerms.includes('crm') || searchTerms.includes('dealership') || searchTerms.includes('automation')) &&
        item.provider === 'Digi Biz OS';
      const legalMatch =
        (searchTerms.includes('ltd') || searchTerms.includes('incorporation') || searchTerms.includes('formation')) &&
        item.provider === 'DigiFormation Ltd';

      return problemMatch || audienceMatch || keywordMatch || legalMatch;
    });
  }
}

export const serviceCatalogue = ServiceCatalogueService.getInstance();
