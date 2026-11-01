/**
 * AI Satellite — Phase 25 Final Editorial Operations & Growth Orchestration
 * Core Type Definitions & Zod Schemas
 * Canonical Production Domain: https://aisatellite.dev
 */

import { z } from 'zod';
import {
  EDITORIAL_PLANNING_CATEGORIES,
  type EditorialPlanningCategory,
  SEARCH_INTENTS,
  type SearchIntent,
  CONTENT_FRESHNESS_TYPES,
  type ContentFreshness,
} from '../editorial/types';

// =============================================================================
// 1. EXECUTION STAGES (Section 7)
// =============================================================================
export const OPERATIONAL_STAGES = [
  'Stage A — Foundation and Launch (Days 1–15)',
  'Stage B — Topical Expansion (Days 16–40)',
  'Stage C — Global Coverage (Days 41–70)',
  'Stage D — Consolidation and Optimization (Days 71–90)',
] as const;

export type OperationalStage = typeof OPERATIONAL_STAGES[number];

// =============================================================================
// 2. 17 REQUIRED OPERATIONAL CALENDAR TRACKING FIELDS (Section 6)
// =============================================================================
export const OperationalCalendarEntrySchema = z.object({
  // 1. Publication date (YYYY-MM-DD)
  publicationDate: z.string().regex(/^(2026|2027)-\d{2}-\d{2}$/),
  // 2. Article ID (ART-xxxx)
  articleId: z.string().regex(/^ART-\d{4}$/),
  // 3. Article title
  articleTitle: z.string().min(5),
  // 4. Category
  category: z.enum(EDITORIAL_PLANNING_CATEGORIES),
  // 5. Topic cluster
  topicCluster: z.string().min(2),
  // 6. Primary keyword
  primaryKeyword: z.string().min(2),
  // 7. Search intent
  searchIntent: z.enum(SEARCH_INTENTS),
  // 8. Assigned researcher
  assignedResearcher: z.string().min(2),
  // 9. Assigned writer or production agent
  assignedWriter: z.string().min(2),
  // 10. Fact-checking status
  factCheckingStatus: z.enum(['pending', 'verified', 'flagged', 'waived']).default('pending'),
  // 11. Editorial reviewer
  editorialReviewer: z.string().min(2),
  // 12. SEO reviewer
  seoReviewer: z.string().min(2),
  // 13. Commercial disclosure status
  commercialDisclosureStatus: z.enum(['not_applicable', 'required_and_verified', 'pending_verification']).default('not_applicable'),
  // 14. Scheduled publication time (HH:MM UTC)
  scheduledPublicationTime: z.string().regex(/^\d{2}:\d{2} UTC$/),
  // 15. Final approval status
  finalApprovalStatus: z.enum(['draft', 'pending_approval', 'approved', 'rejected']).default('pending_approval'),
  // 16. Publication URL
  publicationUrl: z.string().url(),
  // 17. Post-publication verification status
  postPublicationVerificationStatus: z.enum(['pending_publish', 'verified_live', 'verification_failed', 'cached_stale']).default('pending_publish'),
  
  // Operational metadata
  dayNumber: z.number().int().min(1).max(90),
  stage: z.enum(OPERATIONAL_STAGES),
  canonicalSlug: z.string().min(3),
  targetWordCount: z.number().min(800),
  commercialPartner: z.enum(['digiformation', 'digibizos', 'free_tool', 'none']).default('none'),
});

export type OperationalCalendarEntry = z.infer<typeof OperationalCalendarEntrySchema>;

// =============================================================================
// 3. 20-STEP DAILY WORKFLOW (Section 8)
// =============================================================================
export const DAILY_WORKFLOW_STEPS = [
  'Step 01 — Load approved editorial assignments',
  'Step 02 — Validate topic uniqueness',
  'Step 03 — Check source availability',
  'Step 04 — Start authorized research jobs',
  'Step 05 — Generate evidence-backed outlines',
  'Step 06 — Prepare article drafts',
  'Step 07 — Verify factual claims',
  'Step 08 — Validate technical examples',
  'Step 09 — Review SEO/AEO/GEO',
  'Step 10 — Suggest relevant internal links',
  'Step 11 — Evaluate optional commercial recommendations',
  'Step 12 — Verify CTA destinations',
  'Step 13 — Check commercial disclosures',
  'Step 14 — Run originality and duplication checks',
  'Step 15 — Submit articles for human review',
  'Step 16 — Schedule approved articles',
  'Step 17 — Publish authorized articles',
  'Step 18 — Verify live pages',
  'Step 19 — Update sitemaps and feeds',
  'Step 20 — Collect operational metrics',
] as const;

export type DailyWorkflowStep = typeof DAILY_WORKFLOW_STEPS[number];

export interface DailyWorkflowExecutionResult {
  runId: string;
  dayNumber: number;
  timestamp: string;
  stepProgress: {
    step: DailyWorkflowStep;
    status: 'completed' | 'in_progress' | 'blocked' | 'skipped' | 'failed';
    details: string;
    timestamp: string;
  }[];
  processedArticleIds: string[];
  approvedArticleIds: string[];
  publishedArticleIds: string[];
  blockedArticleIds: string[];
  success: boolean;
}

// =============================================================================
// 4. PUBLISHING QUEUE & IDEMPOTENCY (Section 10)
// =============================================================================
export interface PublishingQueueItem {
  queueId: string;
  articleId: string;
  canonicalSlug: string;
  title: string;
  scheduledTime: string;
  approvalStatus: 'approved' | 'rejected' | 'pending';
  approvedBy: string;
  approvalTimestamp: string;
  publicationState: 'queued' | 'publishing' | 'published' | 'failed' | 'cancelled' | 'paused';
  retryCount: number;
  maxRetries: number;
  idempotencyKey: string;
  publishedUrl?: string;
  errorLog?: string[];
  verifiedLive: boolean;
  liveVerifiedAt?: string;
}

// =============================================================================
// 5. SEARCH DISTRIBUTION ENGINES (Sections 14, 15, 16, 17, 18)
// =============================================================================
export interface GoogleSearchConsoleStatus {
  domain: string;
  verifiedOwnership: boolean;
  verificationMethod: 'dns_txt' | 'html_meta' | 'manual';
  canonicalDomainMatched: boolean;
  sitemapSubmittedUrl: string;
  robotsDirectiveStatus: 'valid' | 'invalid' | 'warning';
  mobileUsability: 'pass' | 'fail' | 'untested';
  coreWebVitalsSummary: {
    lcpSeconds: number;
    inpMs: number;
    cls: number;
    rating: 'good' | 'needs_improvement' | 'poor';
  };
  lastInspectedAt: string;
}

export interface BingWebmasterStatus {
  domain: string;
  verifiedOwnership: boolean;
  sitemapSubmittedUrl: string;
  crawlAccessibility: 'accessible' | 'blocked' | 'partial';
  indexNowConfigured: boolean;
  lastInspectedAt: string;
}

export interface IndexNowSubmissionRecord {
  submissionId: string;
  timestamp: string;
  host: string;
  urls: string[];
  keyLocation: string;
  statusCode: number;
  statusMessage: string;
  isIndexingGuaranteed: false; // Strict non-fabrication directive
}

export interface SitemapValidationResult {
  sitemapUrl: string;
  totalUrls: number;
  validCanonicalUrls: number;
  draftUrlsExcluded: boolean;
  noindexUrlsExcluded: boolean;
  lastmodTimestampsAccurate: boolean;
  xmlWellFormed: boolean;
  validationTimestamp: string;
}

export interface RssFeedStatus {
  feedUrl: string;
  categoryFeeds: string[];
  totalEntries: number;
  validPublicationDates: boolean;
  canonicalUrlsEnforced: boolean;
  privateDraftsExposed: boolean; // must be false
  lastGeneratedAt: string;
}

// =============================================================================
// 6. CONTENT GROWTH & CANNIBALIZATION (Sections 19, 20, 21, 22)
// =============================================================================
export interface InternalLinkAuditRecord {
  sourceSlug: string;
  targetSlug: string;
  anchorText: string;
  linkType: 'pillar_to_cluster' | 'cluster_to_pillar' | 'cross_cluster' | 'resource';
  isResolved: boolean;
  isKeywordStuffed: boolean;
}

export interface TopicClusterStatus {
  clusterId: string;
  clusterName: string;
  category: EditorialPlanningCategory;
  pillarSlug: string;
  pillarPublished: boolean;
  plannedArticlesCount: number;
  publishedArticlesCount: number;
  completenessPercentage: number;
  detectedGaps: string[];
}

export interface CannibalizationRisk {
  riskId: string;
  primarySlug: string;
  competingSlug: string;
  overlappingKeyword: string;
  similarityScore: number; // 0.0 to 1.0
  intentOverlap: SearchIntent;
  recommendation: 'consolidate' | 'differentiate' | 'redirect_301' | 'keep_distinct';
  notes: string;
}

export interface ContentFreshnessQueueItem {
  articleId: string;
  slug: string;
  freshnessType: ContentFreshness;
  lastVerifiedDate: string;
  reviewCadenceDays: number;
  isDueForReview: boolean;
  targetEntities: string[];
  priority: 'high' | 'medium' | 'low';
}

// =============================================================================
// 7. ETHICAL DISTRIBUTION & NEWSLETTER (Sections 23, 24, 25, 26)
// =============================================================================
export interface GitHubDistributionPlan {
  projectName: string;
  repositoryUrl: string;
  isOwnerProject: boolean;
  distributionChannel: 'readme_link' | 'release_notes' | 'documentation_tutorial';
  verifiedStats: {
    license: string;
    isFabricated: false; // strictly false
    verificationSource: string;
  };
  policyCompliance: {
    noUnsolicitedOutreach: boolean;
    noBoughtStars: boolean;
    noSpamPullRequests: boolean;
  };
}

export interface NewsletterOperationStatus {
  activeSubscribers: number;
  doubleOptInEnforced: boolean;
  explicitConsentRequired: boolean;
  unsubscribeFunctional: boolean;
  privacyPolicyUrl: string;
  recentDigestTitle: string;
  unauthorizedSignupsBlocked: boolean;
}

// =============================================================================
// 8. COMMERCIAL CONVERSIONS & CTA ANALYTICS (Sections 30, 31, 32)
// =============================================================================
export interface CommercialReferralEvent {
  eventId: string;
  timestamp: string;
  articleId: string;
  articleSlug: string;
  partner: 'digiformation' | 'digibizos';
  destinationUrl: string;
  eventType: 'cta_view' | 'cta_click' | 'referral_redirect';
  isConversionSale: false; // MUST NEVER be reported as completed sale
  disclosurePresented: boolean;
  referrer: string;
}

export interface ContentPerformanceMetrics {
  totalPublished: number;
  totalApproved: number;
  totalRejected: number;
  organicImpressions: number;
  organicClicks: number;
  averageCtrPercent: number;
  averagePosition: number | null;
  ctaClicks: number;
  newsletterSignups: number;
  verifiedReferralClicks: number;
  isFabricated: false;
  dataSource: 'actual_integration' | 'local_verified' | 'unmeasured';
}

// =============================================================================
// 9. SEARCH DIAGNOSTICS & CONTINUOUS IMPROVEMENT (Sections 33, 34, 35)
// =============================================================================
export interface SearchDiagnosticFinding {
  articleId: string;
  slug: string;
  detectedIssue: 'low_impressions' | 'low_ctr' | 'intent_mismatch' | 'weak_linking' | 'stale_facts';
  severity: 'high' | 'medium' | 'low';
  diagnosticEvidence: string;
  proposedAction: string;
  status: 'identified' | 'in_remediation' | 'verified_improved' | 'closed';
}

export interface ContinuousImprovementWorkflowStep {
  stepNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  title: string;
  description: string;
  completed: boolean;
  timestamp?: string;
}

export interface ExperimentationRecord {
  experimentId: string;
  hypothesis: string;
  targetElement: 'article_intro' | 'related_content' | 'cta_presentation' | 'newsletter_box';
  variantA: string;
  variantB: string;
  disclosuresPreserved: boolean;
  accessibilityPreserved: boolean;
  status: 'draft' | 'running' | 'completed' | 'cancelled';
  metricsObserved?: {
    variantAImpressions: number;
    variantAClicks: number;
    variantBImpressions: number;
    variantBClicks: number;
  };
}

// =============================================================================
// 10. EXECUTIVE REPORTING & SCORECARD (Sections 36, 37, 38)
// =============================================================================
export interface WeeklyEditorialReport {
  weekNumber: number; // 1 to 13
  startDate: string;
  endDate: string;
  plannedArticlesCount: number;
  approvedArticlesCount: number;
  publishedArticlesCount: number;
  rejectedArticlesCount: number;
  pendingReviewsCount: number;
  qualityPassRatePercent: number;
  topBlockers: string[];
  factsVsForecastsDisclosed: true;
  generatedAt: string;
}

export interface MonthlyExecutiveReview {
  monthNumber: 1 | 2 | 3;
  monthName: string;
  editorialProductionSummary: {
    target: number;
    achieved: number;
    onTrack: boolean;
  };
  contentQualityStatus: string;
  topicCoveragePercent: number;
  organicSearchTrend: string;
  indexingCoverage: {
    google: 'verified' | 'pending' | 'in_progress';
    bing: 'verified' | 'pending' | 'in_progress';
  };
  readerEngagement: string;
  commercialReferrals: {
    digiformationReferrals: number;
    digibizosReferrals: number;
    completedSalesClaimed: 0; // strictly 0
  };
  securityAndPrivacyStatus: 'clean' | 'warnings' | 'incidents';
  infrastructureCostTotalUsd: number;
  operationalRisks: string[];
  nextMonthPriorities: string[];
  generatedAt: string;
}

export interface ExecutiveScorecard90Day {
  targetArticles: 1000;
  approvedArticles: number;
  publishedArticles: number;
  progressPercentage: number;
  qualityApprovalRatePercent: number;
  categoryCoverage: Record<EditorialPlanningCategory, { planned: number; active: number }>;
  clusterCompletenessPercent: number;
  searchVisibilityStatus: string;
  referralEngagementClicks: number;
  contentFreshnessDueCount: number;
  editorialBacklogCount: number;
  infrastructureHealth: 'healthy' | 'degraded' | 'critical';
  operatingCostUsd: number;
  isRealMeasurement: true;
  lastUpdated: string;
}

// =============================================================================
// 11. REPOSITORY AUDIT (Section 3)
// =============================================================================
export const AUDIT_STATUSES = [
  'implemented and verified',
  'implemented but unverified',
  'partially implemented',
  'not implemented',
  'blocked',
] as const;

export type AuditStatus = typeof AUDIT_STATUSES[number];

export interface PhaseAuditArea {
  id: number;
  name: string;
  description: string;
  status: AuditStatus;
  evidenceFiles: string[];
  testSuites: string[];
  verificationNotes: string;
}

export interface PhaseAuditReport {
  timestamp: string;
  totalAreas: 24;
  implementedAndVerifiedCount: number;
  implementedButUnverifiedCount: number;
  partiallyImplementedCount: number;
  notImplementedCount: number;
  blockedCount: number;
  areas: PhaseAuditArea[];
}
