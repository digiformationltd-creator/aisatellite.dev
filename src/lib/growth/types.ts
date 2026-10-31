/**
 * AI Satellite — Phase 15 Global Search Authority & Developer Adoption Engine
 * Types, Enums, Interfaces, and Zod Validation Schemas
 * Permanent Canonical Domain: https://aisatellite.dev
 */

import { z } from 'zod';

// ==========================================
// 1. TOPICAL & INTENT TAXONOMY
// ==========================================

export const TOPIC_FAMILIES = [
  'Free alternatives to paid software',
  'Open-source AI tools',
  'Free AI coding assistants',
  'Self-hosted automation',
  'AI agents',
  'MCP servers',
  'AI prompt engineering',
  'CSS effects',
  'Three.js tutorials',
  'Developer APIs',
  'Open-source productivity software',
  'Cloudflare development',
  'Technical troubleshooting',
] as const;

export type TopicFamily = (typeof TOPIC_FAMILIES)[number];

export const SEARCH_INTENTS = [
  'informational',
  'comparative',
  'tutorial',
  'troubleshooting',
  'tool_discovery',
  'open_source_evaluation',
  'developer_implementation',
] as const;

export type SearchIntent = (typeof SEARCH_INTENTS)[number];

export const CONTENT_FORMATS = [
  'tool_profile',
  'comparison_matrix',
  'step_tutorial',
  'troubleshooting_guide',
  'architecture_blueprint',
  'prompt_template',
  'original_research_report',
] as const;

export type ContentFormat = (typeof CONTENT_FORMATS)[number];

// ==========================================
// 2. TECHNICAL SEO MONITORING
// ==========================================

export type SEOSeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type SEOCheckCategory =
  | 'canonical'
  | 'sitemap'
  | 'robots'
  | 'indexability'
  | 'redirects'
  | 'duplicate_metadata'
  | 'duplicate_content'
  | 'broken_links'
  | 'orphan_pages'
  | 'link_depth'
  | 'structured_data'
  | 'semantic_headings'
  | 'image_optimization'
  | 'core_web_vitals'
  | 'mobile_usability';

export interface TechnicalSEOFinding {
  id: string;
  affectedUrl: string;
  category: SEOCheckCategory;
  severity: SEOSeverityLevel;
  evidence: string;
  recommendedFix: string;
  responsibleModule: string;
  verificationProcedure: string;
  detectedAt: string;
  resolvedAt?: string;
}

export interface TechnicalSEOReport {
  timestamp: string;
  totalRoutesAudited: number;
  totalFindings: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  infoCount: number;
  findings: TechnicalSEOFinding[];
  isCompliant: boolean;
}

// ==========================================
// 3. SEARCH PERFORMANCE (GSC & BING)
// ==========================================

export interface SearchConsoleStatus {
  service: 'google_search_console' | 'bing_webmaster';
  isConnected: boolean;
  isConfigured: boolean;
  statusMessage: string;
  reportingPeriod?: string;
  totalClicks?: number;
  totalImpressions?: number;
  averageCtr?: number;
  averagePosition?: number;
  topQueries?: Array<{ query: string; clicks: number; impressions: number; position: number }>;
  topLandingPages?: Array<{ url: string; clicks: number; impressions: number }>;
  countryBreakdown?: Array<{ countryCode: string; clicks: number; impressions: number }>;
  crawlIssuesCount?: number;
}

// ==========================================
// 4. TOPICAL AUTHORITY & CONTENT CLUSTERS
// ==========================================

export interface AuthorityCluster {
  id: string;
  pillarTitle: string;
  pillarSlug: string;
  topicFamily: TopicFamily;
  targetSearchIntent: SearchIntent;
  supportingResources: Array<{
    title: string;
    slug: string;
    format: ContentFormat;
    distinctValue: string;
    internalLinkAnchor: string;
  }>;
  internalLinkDepthMax: number;
  coverageScore: number; // 0 - 100
  freshnessStatus: 'fresh' | 'stale' | 'needs_update';
  updatedAt: string;
}

// ==========================================
// 5. CONTENT GAP & RESEARCH OPPORTUNITIES
// ==========================================

export interface ContentGapProposal {
  id: string;
  title: string;
  topicFamily: TopicFamily;
  searchIntent: SearchIntent;
  targetAudience: string;
  identifiedVia: 'zero_result_search' | 'community_question' | 'tech_radar_change' | 'search_console_query';
  unmetNeedExplanation: string;
  evidenceRequirement: string;
  status: 'proposed' | 'under_review' | 'approved' | 'rejected';
  proposedAt: string;
}

// ==========================================
// 6. ORIGINAL TECHNICAL RESEARCH
// ==========================================

export const RESEARCH_FORMATS = [
  'open_source_software_comparison',
  'free_tier_limitation_study',
  'tool_compatibility_test',
  'ai_agent_framework_benchmark',
  'api_documentation_quality_review',
  'threejs_performance_experiment',
  'software_licensing_audit',
  'self_hosting_cost_comparison',
] as const;

export type ResearchFormat = (typeof RESEARCH_FORMATS)[number];

export interface OriginalResearchStudy {
  id: string;
  title: string;
  slug: string;
  format: ResearchFormat;
  methodology: string;
  sourceReferences: string[];
  transparentLimitations: string[];
  measuredResults: Record<string, string | number | boolean>;
  softwareVersionsTested: Record<string, string>;
  publicationDate: string;
  lastCorrectionDate?: string;
  peerReviewStatus: 'draft' | 'peer_reviewed' | 'published';
  author: string;
}

// ==========================================
// 7. DIGITAL PR & REFERRING DOMAINS
// ==========================================

export interface ReferringDomainRecord {
  id: string;
  referringDomain: string;
  referringUrl: string;
  targetAiSatelliteUrl: string;
  citationContext: string;
  citationType: 'original_research' | 'open_source_tool' | 'documentation' | 'tutorial' | 'directory';
  isObserved: boolean;
  discoveredAt: string;
  anchorText?: string;
}

// ==========================================
// 8. GITHUB ADOPTION INTELLIGENCE
// ==========================================

export interface GitHubAdoptionMetrics {
  repository: string;
  stars: number;
  forks: number;
  openIssues: number;
  closedIssues: number;
  openPullRequests: number;
  mergedPullRequests: number;
  totalContributors: number;
  latestReleaseTag: string;
  latestReleaseDate: string;
  reportingWindow: string;
  isApiConfigured: boolean;
  trafficViewsWeekly?: number;
  uniqueClonesWeekly?: number;
  measuredAt: string;
}

// ==========================================
// 9. AEO & GEO QUALITY
// ==========================================

export interface AEOEvaluation {
  pageUrl: string;
  hasDirectAnswerDefinition: boolean;
  hasStructuredTroubleshooting: boolean;
  hasVerifiedCodeExample: boolean;
  hasExplicitLimitations: boolean;
  schemaTypesPresent: string[];
  questionFramingScore: number; // 0 - 100
  overallAEOScore: number; // 0 - 100
  recommendations: string[];
}

export interface GEOEvaluation {
  entityName: string;
  entityType: 'tool' | 'framework' | 'library' | 'platform';
  stableDescription: string;
  accurateRelationships: string[];
  authoritativeSourcesCited: string[];
  visibleVerificationDate: string;
  isGroundedWithoutFabrication: boolean;
  geoClarityScore: number; // 0 - 100
}

// ==========================================
// 10. CONVERSION & RETENTION ANALYTICS
// ==========================================

export const CONVERSION_ACTION_TYPES = [
  'tool_profile_view',
  'alternative_comparison',
  'official_repo_click',
  'prompt_save',
  'tutorial_completion',
  'workspace_registration',
  'newsletter_subscription',
  'community_contribution',
] as const;

export type ConversionActionType = (typeof CONVERSION_ACTION_TYPES)[number];

export interface ConversionEventRecord {
  id: string;
  actionType: ConversionActionType;
  resourceSlug?: string;
  categorySlug?: string;
  referrerSource?: string;
  timestamp: string;
  hasUserConsent: boolean;
  respectsDnt: boolean;
}

// ==========================================
// 11. GROWTH EXPERIMENTATION
// ==========================================

export interface GrowthExperiment {
  id: string;
  name: string;
  hypothesis: string;
  targetMetric: string;
  variants: Array<{
    id: string;
    name: string;
    description: string;
    weightPercent: number;
    impressions: number;
    conversions: number;
  }>;
  status: 'draft' | 'running' | 'completed' | 'concluded_inconclusive';
  startDate: string;
  endDate?: string;
  minimumSampleSize: number;
  currentSampleSize: number;
  winnerVariantId?: string;
  confidencePercentage?: number;
}

// ==========================================
// ZOD VALIDATION SCHEMAS
// ==========================================

export const CreateTechnicalSEOFindingSchema = z.object({
  affectedUrl: z.string().url(),
  category: z.enum([
    'canonical',
    'sitemap',
    'robots',
    'indexability',
    'redirects',
    'duplicate_metadata',
    'duplicate_content',
    'broken_links',
    'orphan_pages',
    'link_depth',
    'structured_data',
    'semantic_headings',
    'image_optimization',
    'core_web_vitals',
    'mobile_usability',
  ]),
  severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
  evidence: z.string().min(5),
  recommendedFix: z.string().min(5),
  responsibleModule: z.string().min(2),
  verificationProcedure: z.string().min(5),
});

export const CreateOriginalResearchSchema = z.object({
  title: z.string().min(5).max(180),
  slug: z.string().min(3),
  format: z.enum([
    'open_source_software_comparison',
    'free_tier_limitation_study',
    'tool_compatibility_test',
    'ai_agent_framework_benchmark',
    'api_documentation_quality_review',
    'threejs_performance_experiment',
    'software_licensing_audit',
    'self_hosting_cost_comparison',
  ]),
  methodology: z.string().min(20),
  sourceReferences: z.array(z.string().url()).min(1),
  transparentLimitations: z.array(z.string()).min(1),
  measuredResults: z.record(z.union([z.string(), z.number(), z.boolean()])),
  softwareVersionsTested: z.record(z.string()),
  author: z.string().min(2),
});

export const RegisterReferringDomainSchema = z.object({
  referringDomain: z.string().min(3),
  referringUrl: z.string().url(),
  targetAiSatelliteUrl: z.string().url(),
  citationContext: z.string().min(10),
  citationType: z.enum(['original_research', 'open_source_tool', 'documentation', 'tutorial', 'directory']),
  isObserved: z.boolean().default(true),
  anchorText: z.string().optional(),
});

export const RecordConversionSchema = z.object({
  actionType: z.enum([
    'tool_profile_view',
    'alternative_comparison',
    'official_repo_click',
    'prompt_save',
    'tutorial_completion',
    'workspace_registration',
    'newsletter_subscription',
    'community_contribution',
  ]),
  resourceSlug: z.string().optional(),
  categorySlug: z.string().optional(),
  referrerSource: z.string().optional(),
  hasUserConsent: z.boolean().default(true),
  respectsDnt: z.boolean().default(true),
});
