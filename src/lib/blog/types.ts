/**
 * AI Satellite — Phase 21 Premium Blog Hub and Professional Editorial Architecture
 * Core Type Definitions & Schema Validations
 * Canonical Production Domain: https://aisatellite.dev
 */

import { z } from 'zod';

export const PRIMARY_CATEGORIES = [
  'Business Startup Guides',
  'Business Growth',
  'UK Business',
  'US Business',
  'International Business',
  'Free AI Tools',
  'AI Agents',
  'AI Automation',
  'Paid Tool Alternatives',
  'Open-Source Software',
  'GitHub Projects',
  'Developer Tools',
  'Website Development',
  'SEO and Digital Marketing',
  'CRM and Customer Management',
  'Productivity Software',
  'Free APIs',
  'MCP Servers',
  'Workflow Automation',
  'CSS and UI Design',
  'Three.js and WebGL',
  'Business Operations',
  'Industry-Specific Growth',
  'Technical Troubleshooting',
  'Software Comparisons',
] as const;

export type PrimaryCategory = typeof PRIMARY_CATEGORIES[number];

export const EDITORIAL_STATUSES = [
  'Topic Proposed',
  'Researching',
  'Outline Ready',
  'Drafting',
  'Fact Checking',
  'Editorial Review',
  'SEO Review',
  'Commercial Disclosure Review',
  'Approved',
  'Scheduled',
  'Published',
  'Update Required',
  'Archived',
] as const;

export type EditorialStatus = typeof EDITORIAL_STATUSES[number];

export const CTA_COMPONENT_TYPES = [
  'Inline Recommendation',
  'Relevant Service Card',
  'Software Solution Card',
  'Comparison Recommendation',
  'End-of-Guide Next Step',
  'Related Free Tool Card',
  'Trial Offer Card',
  'Consultation Link',
] as const;

export type CTAComponentType = typeof CTA_COMPONENT_TYPES[number];

// 1. Author Schema & Model
export const AuthorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(10),
  avatarUrl: z.string(),
  credentials: z.array(z.string()).default([]),
  socialLinks: z
    .object({
      github: z.string().url().optional(),
      twitter: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      website: z.string().url().optional(),
    })
    .optional(),
  verifiedExpert: z.boolean().default(true),
});

export type Author = z.infer<typeof AuthorSchema>;

// 2. Verified Service Catalogue Item Schema
export const ServiceCatalogueItemSchema = z.object({
  id: z.string().min(1),
  provider: z.enum(['DigiFormation Ltd', 'Digi Biz OS', 'Open-Source Community']),
  name: z.string().min(1),
  description: z.string().min(10),
  relevantProblems: z.array(z.string()),
  targetAudience: z.array(z.string()),
  jurisdiction: z.array(z.string()),
  officialUrl: z.string().url(),
  offerInformation: z.string().optional(),
  eligibilityNotes: z.string().optional(),
  lastVerifiedDate: z.string(),
  active: z.boolean().default(true),
  editoriallyApproved: z.boolean().default(true),
  badge: z.string(),
  accentColor: z.enum(['cyan', 'emerald', 'purple', 'amber']).default('cyan'),
});

export type ServiceCatalogueItem = z.infer<typeof ServiceCatalogueItemSchema>;

// 3. Contextual CTA Configuration Schema
export const ContextualCTAConfigSchema = z.object({
  id: z.string().min(1),
  type: z.enum(CTA_COMPONENT_TYPES),
  title: z.string().min(1),
  description: z.string().min(10),
  destinationUrl: z.string().url(),
  buttonLabel: z.string().min(1),
  partner: z.enum(['digiformation', 'digibizos', 'free_tool', 'open_source', 'none']),
  disclosure: z.string().min(5),
  serviceId: z.string().optional(),
  relevantCategory: z.string().optional(),
  relevantTags: z.array(z.string()).default([]),
  active: z.boolean().default(true),
});

export type ContextualCTAConfig = z.infer<typeof ContextualCTAConfigSchema>;

// 4. Source Reference Schema
export const SourceReferenceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  claim: z.string().optional(),
  verificationDate: z.string().optional(),
  confidence: z.enum(['high', 'verified', 'medium']).default('verified'),
});

export type SourceReference = z.infer<typeof SourceReferenceSchema>;

// 5. Practical Step Schema
export const PracticalStepSchema = z.object({
  step: z.number().int().positive(),
  title: z.string().min(1),
  detail: z.string().min(5),
});

export type PracticalStep = z.infer<typeof PracticalStepSchema>;

// 6. Article Content Model Schema
export const ArticleModelSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(5),
  description: z.string().min(15),
  primaryCategory: z.enum(PRIMARY_CATEGORIES),
  secondaryCategories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  author: z.union([z.string(), AuthorSchema]),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  scheduledAt: z.string().optional(),
  readingTime: z.string(),
  reviewStatus: z.enum(EDITORIAL_STATUSES).default('Published'),
  editoriallyReviewed: z.boolean().default(true),
  targetAudience: z.array(z.string()).default(['Global Developers', 'Founders']),
  jurisdiction: z.string().default('Global'),
  searchIntent: z.enum(['informational', 'transactional', 'commercial_investigation', 'navigational']).default('informational'),
  contentBody: z.string().min(50),
  summary: z.string().optional(),
  quickAnswer: z.string().optional(),
  keyTakeaways: z.array(z.string()).default([]),
  practicalSteps: z.array(PracticalStepSchema).default([]),
  checklist: z.array(z.string()).default([]),
  commonMistakes: z.array(z.string()).default([]),
  sourceReferences: z.array(SourceReferenceSchema).default([]),
  relatedTools: z.array(z.string()).default([]),
  relatedArticles: z.array(z.string()).default([]),
  ctaPlacements: z.array(ContextualCTAConfigSchema).default([]),
  canonicalUrl: z.string().url().default('https://aisatellite.dev/blog/'),
  indexable: z.boolean().default(true),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  series: z
    .object({
      id: z.string(),
      name: z.string(),
      order: z.number(),
      isPillar: z.boolean().default(false),
    })
    .optional(),
});

export type ArticleModel = z.infer<typeof ArticleModelSchema>;

// 7. Newsletter Subscriber Schema
export const NewsletterSubscriberSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  consentGiven: z.literal(true),
  privacyPolicyAccepted: z.literal(true),
  subscribedAt: z.string(),
  topicPreferences: z.array(z.string()).default(['All Technology & Business']),
  unsubscribeToken: z.string().min(10),
  status: z.enum(['active', 'unsubscribed']).default('active'),
});

export type NewsletterSubscriber = z.infer<typeof NewsletterSubscriberSchema>;

// 8. CTA Analytics Event Schema
export const CTAAnalyticsEventSchema = z.object({
  id: z.string().min(1),
  articleId: z.string().min(1),
  ctaId: z.string().min(1),
  destinationUrl: z.string().url(),
  placementType: z.string(),
  timestamp: z.string(),
  eventType: z.enum(['impression', 'click']),
  referrer: z.string().optional(),
});

export type CTAAnalyticsEvent = z.infer<typeof CTAAnalyticsEventSchema>;

// 9. Article Engagement Event Schema
export const ArticleEngagementEventSchema = z.object({
  id: z.string().min(1),
  articleId: z.string().min(1),
  eventType: z.enum([
    'ArticleViewed',
    'RelatedArticleOpened',
    'ResourceLinkOpened',
    'ContextualCTAOpened',
    'NewsletterSubscribed',
    'ArticleFeedbackSubmitted',
  ]),
  timestamp: z.string(),
  metadata: z.record(z.any()).optional(),
});

export type ArticleEngagementEvent = z.infer<typeof ArticleEngagementEventSchema>;

// 10. Quality Gate Record Schema
export const QualityGateRecordSchema = z.object({
  articleId: z.string().min(1),
  passed: z.boolean(),
  originalUsefulnessScore: z.number().min(0).max(100),
  factualCorrectnessScore: z.number().min(0).max(100),
  sourceQualityScore: z.number().min(0).max(100),
  disclosureCompliance: z.boolean(),
  duplicateRisk: z.enum(['none', 'low', 'medium', 'high']),
  reviewerNotes: z.string(),
  reviewedAt: z.string(),
  reviewedBy: z.string(),
});

export type QualityGateRecord = z.infer<typeof QualityGateRecordSchema>;
