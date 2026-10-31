/**
 * AI Satellite — Phase 22 1,000-Blog Global Keyword Intelligence & Editorial Masterplan
 * Type Definitions & Zod Schemas
 * Canonical Production Domain: https://aisatellite.dev
 */

import { z } from 'zod';

export const EDITORIAL_PLANNING_CATEGORIES = [
  'Business Startup and Growth',
  'Free AI Tools and AI Agents',
  'Paid Software Alternatives',
  'GitHub and Open-Source Projects',
  'Automation, CRM and Workflows',
  'UK and US Business Guides',
  'Industry-Specific Business Growth',
  'Developer Tutorials and Technical Resources',
] as const;

export type EditorialPlanningCategory = typeof EDITORIAL_PLANNING_CATEGORIES[number];

export const CATEGORY_TARGET_ALLOCATIONS: Record<EditorialPlanningCategory, number> = {
  'Business Startup and Growth': 200,
  'Free AI Tools and AI Agents': 150,
  'Paid Software Alternatives': 150,
  'GitHub and Open-Source Projects': 150,
  'Automation, CRM and Workflows': 120,
  'UK and US Business Guides': 100,
  'Industry-Specific Business Growth': 80,
  'Developer Tutorials and Technical Resources': 50,
};

export const SEARCH_INTENTS = [
  'Informational',
  'Tutorial',
  'Comparative',
  'Alternative-Seeking',
  'Commercial Investigation',
  'Navigational',
  'Troubleshooting',
  'Business Planning',
] as const;

export type SearchIntent = typeof SEARCH_INTENTS[number];

export const CONTENT_FRESHNESS_TYPES = [
  'Evergreen',
  'Frequently Changing',
  'Regulated',
  'Time-Sensitive',
] as const;

export type ContentFreshness = typeof CONTENT_FRESHNESS_TYPES[number];

export const ARTICLE_DEPTHS = [
  'Focused Answer (800-1,500 words)',
  'Standard Guide (1,500-2,500 words)',
  'In-Depth Guide (2,500-4,000 words)',
  'Pillar Content (4,000-5,000+ words)',
] as const;

export type ArticleDepth = typeof ARTICLE_DEPTHS[number];

export const PUBLISHING_STAGES = [
  'Stage 1 — Foundation (Days 1–15)',
  'Stage 2 — Topical Expansion (Days 16–40)',
  'Stage 3 — Coverage Expansion (Days 41–70)',
  'Stage 4 — Quality Consolidation (Days 71–90)',
] as const;

export type PublishingStage = typeof PUBLISHING_STAGES[number];

// 1. Keyword Research Record Schema (Section 4)
export const KeywordIntelligenceSchema = z.object({
  keywordId: z.string().min(1),
  primaryKeyword: z.string().min(1),
  secondaryKeywords: z.array(z.string()).default([]),
  relatedEntities: z.array(z.string()).default([]),
  searchIntent: z.enum(SEARCH_INTENTS),
  targetAudience: z.array(z.string()).min(1),
  targetGeography: z.string().default('Global'),
  language: z.literal('en').default('en'),
  topicCategory: z.enum(EDITORIAL_PLANNING_CATEGORIES),
  topicCluster: z.string().min(1),
  searchVolume: z.number().nullable().default(null), // Strict non-fabrication rule
  searchVolumeSource: z.string().nullable().default(null),
  keywordDifficulty: z.number().nullable().default(null), // Strict non-fabrication rule
  difficultySource: z.string().nullable().default(null),
  trendDirection: z.enum(['rising', 'stable', 'seasonal', 'unmeasured']).default('unmeasured'),
  trendEvidence: z.string(),
  serpObservations: z.string(),
  competingContentExamples: z.array(z.string()).default([]),
  contentGap: z.string(),
  businessRelevance: z.enum(['high', 'medium', 'low']),
  freeResourceRelevance: z.enum(['high', 'medium', 'low']),
  githubRelevance: z.enum(['high', 'medium', 'low']),
  commercialServiceRelevance: z.enum(['digiformation', 'digibizos', 'both', 'none']).default('none'),
  researchTimestamp: z.string(),
  confidenceLevel: z.enum(['verified', 'estimated', 'qualitative']).default('qualitative'),
});

export type KeywordIntelligence = z.infer<typeof KeywordIntelligenceSchema>;

// 2. Article Brief Data Model Schema (Section 21 - Mandatory Fields)
export const ArticleBriefSchema = z.object({
  articleId: z.string().regex(/^ART-\d{4}$/),
  proposedTitle: z.string().min(5),
  canonicalSlug: z.string().min(3),
  primaryKeyword: z.string().min(2),
  supportingKeywords: z.array(z.string()).default([]),
  searchIntent: z.enum(SEARCH_INTENTS),
  targetAudience: z.array(z.string()).min(1),
  geography: z.string().default('Global'),
  topicCategory: z.enum(EDITORIAL_PLANNING_CATEGORIES),
  topicCluster: z.string().min(2),
  parentPillar: z.string().min(2),
  readerProblem: z.string().min(10),
  uniqueEditorialAngle: z.string().min(10),
  proposedOutline: z.array(z.string()).min(3),
  researchQuestions: z.array(z.string()).min(2),
  requiredSources: z
    .array(
      z.object({
        title: z.string().min(1),
        url: z.string().url(),
        rationale: z.string().optional(),
      })
    )
    .min(1),
  suggestedExamples: z.array(z.string()).default([]),
  freeToolsToInvestigate: z.array(z.string()).default([]),
  githubResourcesToInvestigate: z.array(z.string()).default([]),
  relevantCommercialServiceCategory: z.string().nullable().default(null),
  disclosureRequirements: z.string().min(5),
  suggestedArticleDepth: z.enum(ARTICLE_DEPTHS),
  suggestedWordCountRange: z.string(),
  internalLinkTargets: z.array(z.string()).default([]),
  suggestedCTAOpportunity: z
    .object({
      type: z.string(),
      partner: z.enum(['digiformation', 'digibizos', 'free_tool', 'none']),
      description: z.string(),
      destinationUrl: z.string().url(),
    })
    .nullable()
    .default(null),
  contentFreshnessRisk: z.enum(CONTENT_FRESHNESS_TYPES),
  editorialPriority: z.enum(['P1 - High', 'P2 - Medium', 'P3 - Standard']),
  proposedPublicationDay: z.number().int().min(1).max(90),
  proposedPublicationDate: z.string(),
  publishingStage: z.enum(PUBLISHING_STAGES),
  researchStatus: z.enum(['Research Ready', 'Pending Verification', 'Source Grounded']).default('Research Ready'),
  editorialRiskAssessment: z.object({
    riskLevel: z.enum(['low', 'medium', 'high']),
    notes: z.string(),
  }),
});

export type ArticleBrief = z.infer<typeof ArticleBriefSchema>;

// 3. Topic Cluster Structure
export interface TopicCluster {
  id: string;
  name: string;
  category: EditorialPlanningCategory;
  pillarTitle: string;
  pillarSlug: string;
  supportingArticlesCount: number;
  coreKeywords: string[];
  description: string;
}

// 4. Commercial Service Relevance Mapping (Section 26 & 27)
export interface CommercialServiceMapping {
  provider: 'DigiFormation Ltd' | 'Digi Biz OS';
  canonicalUrl: string;
  serviceCategory: string;
  eligibleGeographies: string[];
  eligibleCategories: EditorialPlanningCategory[];
  triggerKeywords: string[];
  disclosureText: string;
  verificationTimestamp: string;
}

// 5. 90-Day Calendar Slot (Section 24 & 25)
export interface EditorialCalendarDaySlot {
  dayNumber: number; // 1 to 90
  stage: PublishingStage;
  scheduledDate: string; // ISO date
  plannedArticleIds: string[];
  categoryBreakdown: Partial<Record<EditorialPlanningCategory, number>>;
  editorialFocus: string;
  dailyTarget: number;
}
