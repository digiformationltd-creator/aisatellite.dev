import { z } from 'zod';

// ==========================================
// 1. DISTRIBUTION SCHEMAS
// ==========================================

export const DistributionStatusSchema = z.enum([
  'draft',
  'awaiting_review',
  'approved',
  'scheduled',
  'published',
  'failed',
  'cancelled',
]);
export type DistributionStatus = z.infer<typeof DistributionStatusSchema>;

export const SupportedPlatformSchema = z.enum([
  'github',
  'linkedin',
  'x',
  'reddit',
  'devto',
  'hashnode',
  'mastodon',
  'bluesky',
]);
export type SupportedPlatform = z.infer<typeof SupportedPlatformSchema>;

export const DistributionJobSchema = z.object({
  id: z.string().min(1),
  sourceContentId: z.string().min(1),
  platform: SupportedPlatformSchema,
  text: z.string().min(1),
  targetUrl: z.string().url(),
  status: DistributionStatusSchema,
  scheduledAt: z.string().optional(),
  publishedAt: z.string().optional(),
  publishedUrl: z.string().url().optional(),
  error: z.string().optional(),
  retryCount: z.number().int().nonnegative().default(0),
  approvedBy: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type DistributionJob = z.infer<typeof DistributionJobSchema>;

// ==========================================
// 2. TECHNICAL SEO SCHEMAS
// ==========================================

export const SEOSeveritySchema = z.enum(['critical', 'high', 'medium', 'low', 'info']);
export type SEOSeverity = z.infer<typeof SEOSeveritySchema>;

export const SEOCategorySchema = z.enum([
  'canonical',
  'sitemap',
  'robots',
  'broken_link',
  'metadata',
  'heading',
  'structured_data',
  'alt_text',
  'orphan',
  'freshness',
  'depth',
]);
export type SEOCategory = z.infer<typeof SEOCategorySchema>;

export const SEOAuditFindingSchema = z.object({
  id: z.string().min(1),
  severity: SEOSeveritySchema,
  category: SEOCategorySchema,
  affectedUrl: z.string(),
  problem: z.string(),
  evidence: z.string(),
  recommendedFix: z.string(),
  detectedAt: z.string(),
  status: z.enum(['detected', 'investigating', 'resolved', 'ignored']).default('detected'),
});
export type SEOAuditFinding = z.infer<typeof SEOAuditFindingSchema>;

export const SEOAuditReportSchema = z.object({
  timestamp: z.string(),
  routesAudited: z.number().int().nonnegative(),
  summary: z.object({
    critical: z.number().int().nonnegative(),
    high: z.number().int().nonnegative(),
    medium: z.number().int().nonnegative(),
    low: z.number().int().nonnegative(),
    info: z.number().int().nonnegative(),
  }),
  findings: z.array(SEOAuditFindingSchema),
  passedChecks: z.array(z.string()),
});
export type SEOAuditReport = z.infer<typeof SEOAuditReportSchema>;

// ==========================================
// 3. SEARCH DEMAND & CONSOLE SCHEMAS
// ==========================================

export const SearchPerformanceRecordSchema = z.object({
  query: z.string(),
  page: z.string(),
  impressions: z.number().nonnegative(),
  clicks: z.number().nonnegative(),
  ctr: z.number().min(0).max(1),
  averagePosition: z.number().positive(),
  period: z.string(),
  isMeasured: z.boolean(), // Strictly distinguishes verified API measurement from estimates
});
export type SearchPerformanceRecord = z.infer<typeof SearchPerformanceRecordSchema>;

export const ContentOpportunityTypeSchema = z.enum([
  'high_imp_low_ctr',
  'striking_distance',
  'traffic_drop',
  'content_gap',
  'freshness_update',
  'weak_linking',
]);
export type ContentOpportunityType = z.infer<typeof ContentOpportunityTypeSchema>;

export const ContentOpportunitySchema = z.object({
  id: z.string().min(1),
  type: ContentOpportunityTypeSchema,
  targetUrl: z.string(),
  query: z.string().optional(),
  score: z.number().min(0).max(100),
  metricSummary: z.string(),
  recommendation: z.string(),
  status: z.enum(['proposed', 'accepted', 'rejected', 'implemented']).default('proposed'),
  detectedAt: z.string(),
});
export type ContentOpportunity = z.infer<typeof ContentOpportunitySchema>;

// ==========================================
// 4. CONTENT CLUSTER SCHEMAS
// ==========================================

export const ClusterFreshnessSchema = z.enum(['fresh', 'stale', 'needs_review']);
export type ClusterFreshness = z.infer<typeof ClusterFreshnessSchema>;

export const ContentClusterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  pillarUrl: z.string(),
  description: z.string(),
  keywords: z.array(z.string()),
  supportingUrls: z.array(z.string()),
  freshnessStatus: ClusterFreshnessSchema,
  lastUpdated: z.string(),
});
export type ContentCluster = z.infer<typeof ContentClusterSchema>;

export const InternalLinkRecommendationSchema = z.object({
  id: z.string().min(1),
  sourceUrl: z.string(),
  targetUrl: z.string(),
  suggestedAnchor: z.string(),
  relevanceScore: z.number().min(0).max(1),
  clusterId: z.string(),
  status: z.enum(['suggested', 'approved', 'rejected', 'applied']).default('suggested'),
  createdAt: z.string(),
});
export type InternalLinkRecommendation = z.infer<typeof InternalLinkRecommendationSchema>;

// ==========================================
// 5. GITHUB COMMUNITY SCHEMAS
// ==========================================

export const RepoHealthAuditSchema = z.object({
  repository: z.string(),
  hasReadme: z.boolean(),
  hasInstallationGuide: z.boolean(),
  hasScreenshots: z.boolean(),
  hasDemoLink: z.boolean(),
  hasLicense: z.boolean(),
  hasContributingGuide: z.boolean(),
  hasSecurityPolicy: z.boolean(),
  hasIssueTemplates: z.boolean(),
  hasPrTemplates: z.boolean(),
  topicsCount: z.number().int().nonnegative(),
  hasReleaseNotes: z.boolean(),
  hasRoadmap: z.boolean(),
  hasDocumentationLinks: z.boolean(),
  goodFirstIssuesCount: z.number().int().nonnegative(),
  healthScore: z.number().min(0).max(100),
  recommendations: z.array(z.string()),
  auditedAt: z.string(),
});
export type RepoHealthAudit = z.infer<typeof RepoHealthAuditSchema>;

// ==========================================
// 6. NEWSLETTER SCHEMAS
// ==========================================

export const SubscriberStatusSchema = z.enum([
  'unconfirmed',
  'active',
  'unsubscribed',
  'bounced',
  'suppressed',
]);
export type SubscriberStatus = z.infer<typeof SubscriberStatusSchema>;

export const NewsletterSubscriberSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  status: SubscriberStatusSchema,
  consentTimestamp: z.string(),
  consentVersion: z.string(),
  ipHash: z.string(), // Hashed IP, no raw PII
  optInToken: z.string().optional(),
  confirmedAt: z.string().optional(),
  unsubscribedAt: z.string().optional(),
  preferences: z.object({
    weeklyDigest: z.boolean().default(true),
    securityAdvisories: z.boolean().default(false),
    productReleases: z.boolean().default(true),
  }),
});
export type NewsletterSubscriber = z.infer<typeof NewsletterSubscriberSchema>;

export const NewsletterCampaignStatusSchema = z.enum([
  'draft',
  'ready_for_review',
  'approved',
  'sending',
  'sent',
  'cancelled',
]);
export type NewsletterCampaignStatus = z.infer<typeof NewsletterCampaignStatusSchema>;

export const NewsletterCampaignSchema = z.object({
  id: z.string().min(1),
  editionNumber: z.number().int().positive(),
  subject: z.string().min(1),
  title: z.string().min(1),
  status: NewsletterCampaignStatusSchema,
  items: z.array(
    z.object({
      title: z.string(),
      url: z.string().url(),
      summary: z.string(),
      category: z.string(),
      isVerifiedFree: z.boolean(),
    })
  ),
  htmlContent: z.string(),
  textContent: z.string(),
  createdAt: z.string(),
  approvedBy: z.string().optional(),
  scheduledAt: z.string().optional(),
  sentAt: z.string().optional(),
  recipientCount: z.number().int().nonnegative().optional(),
});
export type NewsletterCampaign = z.infer<typeof NewsletterCampaignSchema>;

// ==========================================
// 7. COMMUNITY SUBMISSION SCHEMAS
// ==========================================

export const SubmissionTypeSchema = z.enum([
  'tool',
  'alternative',
  'correction',
  'guide',
  'demo',
  'broken_link',
  'feature',
  'security',
]);
export type SubmissionType = z.infer<typeof SubmissionTypeSchema>;

export const SubmissionStatusSchema = z.enum([
  'pending',
  'in_review',
  'approved',
  'rejected',
  'resolved',
]);
export type SubmissionStatus = z.infer<typeof SubmissionStatusSchema>;

export const CommunitySubmissionSchema = z.object({
  id: z.string().min(1), // e.g. SUB-173000-01
  type: SubmissionTypeSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  resourcePayload: z.record(z.unknown()),
  isSecurityConcern: z.boolean().default(false),
  status: SubmissionStatusSchema.default('pending'),
  submitterHash: z.string(), // Hashed submitter identity
  moderationNotes: z.string().optional(),
  createdAt: z.string(),
  reviewedAt: z.string().optional(),
});
export type CommunitySubmission = z.infer<typeof CommunitySubmissionSchema>;

// ==========================================
// 8. PRIVACY ANALYTICS SCHEMAS
// ==========================================

export const AnalyticsEventTypeSchema = z.enum([
  'page_view',
  'search_performed',
  'search_result_click',
  'tool_detail_view',
  'alternative_comparison_view',
  'github_repository_click',
  'download_click',
  'demo_open',
  'prompt_copy',
  'newsletter_subscribe',
  'newsletter_confirm',
  'newsletter_unsubscribe',
  'social_referral',
  'contribution_start',
  'contribution_complete',
]);
export type AnalyticsEventType = z.infer<typeof AnalyticsEventTypeSchema>;

export const AnalyticsEventSchema = z.object({
  id: z.string().min(1),
  eventType: AnalyticsEventTypeSchema,
  url: z.string(),
  referrer: z.string().optional(),
  timestamp: z.string(),
  metadata: z.record(z.unknown()).optional(),
  dailySessionHash: z.string(), // Rotating daily anonymous session hash
});
export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;

export const AnalyticsSummaryReportSchema = z.object({
  period: z.string(),
  totalEvents: z.number().int().nonnegative(),
  pageViews: z.number().int().nonnegative(),
  searches: z.number().int().nonnegative(),
  zeroResultSearches: z.array(z.string()),
  topQueries: z.array(z.object({ query: z.string(), count: z.number() })),
  topPages: z.array(z.object({ path: z.string(), count: z.number() })),
  topTools: z.array(z.object({ tool: z.string(), count: z.number() })),
  topDemos: z.array(z.object({ demo: z.string(), count: z.number() })),
  githubReferrals: z.number().int().nonnegative(),
  newsletterConversions: z.number().int().nonnegative(),
  contributionsCount: z.number().int().nonnegative(),
  isEstimated: z.literal(false), // Guaranteed real data
});
export type AnalyticsSummaryReport = z.infer<typeof AnalyticsSummaryReportSchema>;

// ==========================================
// 9. CONNECTED ACCOUNTS & SYSTEM SCHEMAS
// ==========================================

export const ConnectedAccountSchema = z.object({
  platform: SupportedPlatformSchema,
  accountHandle: z.string(),
  isActive: z.boolean(),
  authStatus: z.enum(['connected', 'expired', 'unconfigured', 'error']),
  rateLimitRemaining: z.number().int().nonnegative().optional(),
  rateLimitResetAt: z.string().optional(),
  lastCheckedAt: z.string(),
});
export type ConnectedAccount = z.infer<typeof ConnectedAccountSchema>;

export const GrowthAuditLogSchema = z.object({
  id: z.string().min(1),
  action: z.string(),
  actor: z.string(),
  details: z.record(z.unknown()),
  timestamp: z.string(),
});
export type GrowthAuditLog = z.infer<typeof GrowthAuditLogSchema>;
