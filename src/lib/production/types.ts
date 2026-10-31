/**
 * AI SATELLITE — PHASE 23 EDITORIAL PRODUCTION ENGINE
 * Core Type Definitions & Zod Schemas
 * Canonical Production Domain: https://aisatellite.dev
 */

import { z } from 'zod';
import type { ArticleBrief, SearchIntent, ContentFreshness } from '../editorial/types';

// =============================================================================
// 1. 22 PRODUCTION STAGES (Section 3)
// =============================================================================
export const PRODUCTION_STAGES = [
  'Stage 01 — Approved Topic Intake',
  'Stage 02 — Research Assignment',
  'Stage 03 — Source Discovery',
  'Stage 04 — Evidence Collection',
  'Stage 05 — Claim Verification',
  'Stage 06 — Editorial Angle Development',
  'Stage 07 — Outline Generation',
  'Stage 08 — First Draft',
  'Stage 09 — Technical Validation',
  'Stage 10 — Business and Regulatory Review',
  'Stage 11 — Source Citation Audit',
  'Stage 12 — SEO Review',
  'Stage 13 — AEO/GEO Review',
  'Stage 14 — Internal Linking',
  'Stage 15 — Free Resource Recommendations',
  'Stage 16 — Commercial Relevance Review',
  'Stage 17 — Originality and Duplication Review',
  'Stage 18 — Editorial Quality Review',
  'Stage 19 — Human Approval',
  'Stage 20 — Scheduling',
  'Stage 21 — Publication',
  'Stage 22 — Post-Publication Monitoring',
] as const;

export type ProductionStage = typeof PRODUCTION_STAGES[number];

// =============================================================================
// 2. 12 MULTI-AGENT ROLES (Section 4)
// =============================================================================
export const AGENT_ROLES = [
  'Agent A — Research Planner',
  'Agent B — Source Discovery',
  'Agent C — Evidence Analyst',
  'Agent D — Technical Specialist',
  'Agent E — Business Researcher',
  'Agent F — Editorial Writer',
  'Agent G — Fact Checker',
  'Agent H — SEO/AEO/GEO Reviewer',
  'Agent I — Resource Recommendation Analyst',
  'Agent J — Commercial Relevance Reviewer',
  'Agent K — Editorial Quality Controller',
  'Agent L — Publishing Coordinator',
] as const;

export type AgentRole = typeof AGENT_ROLES[number];

// =============================================================================
// 3. FACTUAL CLAIM CLASSIFICATION (Section 10)
// =============================================================================
export const CLAIM_CLASSIFICATIONS = [
  'Stable technical fact',
  'Time-sensitive product information',
  'Pricing or licensing information',
  'Legal or regulatory information',
  'Business strategy recommendation',
  'Performance claim',
  'Opinion or interpretation',
  'Unverified assertion',
] as const;

export type ClaimClassification = typeof CLAIM_CLASSIFICATIONS[number];

// =============================================================================
// 4. SOURCE QUALITY HIERARCHY (Section 9)
// =============================================================================
export const SOURCE_QUALITY_TIERS = [
  'Tier 1 — Official Primary Source',
  'Tier 2 — Technical Documentation',
  'Tier 3 — Government / Regulatory Publication',
  'Tier 4 — Original Empirical Research',
  'Tier 5 — Reputable Independent Analysis',
  'Tier 6 — Community Discussion / Experiential',
] as const;

export type SourceQualityTier = typeof SOURCE_QUALITY_TIERS[number];

// =============================================================================
// 5. EVIDENCE LEDGER SCHEMAS (Section 8)
// =============================================================================
export const SourceEvidenceSchema = z.object({
  evidenceId: z.string().min(1),
  articleId: z.string().min(1),
  claim: z.string().min(5),
  claimType: z.enum(CLAIM_CLASSIFICATIONS),
  sourceTitle: z.string().min(1),
  sourceUrl: z.string().url(),
  sourcePublisher: z.string().min(1),
  qualityTier: z.enum(SOURCE_QUALITY_TIERS),
  accessDate: z.string(),
  publicationDate: z.string().nullable().default(null),
  supportingPassage: z.string().min(5),
  verificationStatus: z.enum(['Verified', 'Conflicting', 'Flagged', 'Unverified']),
  confidenceAssessment: z.enum(['High', 'Medium', 'Low']),
  reviewer: z.string(),
  notes: z.string().default(''),
});

export type SourceEvidence = z.infer<typeof SourceEvidenceSchema>;

export const ClaimVerificationSchema = z.object({
  claimId: z.string().min(1),
  articleId: z.string().min(1),
  statement: z.string().min(5),
  classification: z.enum(CLAIM_CLASSIFICATIONS),
  status: z.enum(['Verified', 'Flagged', 'Rejected', 'Exempt']),
  evidenceReferences: z.array(z.string()).default([]),
  verificationNotes: z.string(),
  conflictingSources: z.array(z.string()).default([]),
  riskLevel: z.enum(['low', 'medium', 'high']),
});

export type ClaimVerification = z.infer<typeof ClaimVerificationSchema>;

// =============================================================================
// 6. ARTICLE OUTLINE & DRAFT SCHEMAS (Sections 11–13)
// =============================================================================
export interface OutlineSection {
  heading: string;
  level: 2 | 3;
  targetWordCount: number;
  coreConcepts: string[];
  keyTakeaways: string[];
  aeoDirectAnswerTarget?: string;
  practicalExampleTarget?: string;
}

export const ArticleOutlineSchema = z.object({
  outlineId: z.string().min(1),
  articleId: z.string().min(1),
  title: z.string().min(5),
  searchIntent: z.string(),
  targetAudience: z.array(z.string()),
  targetWordCountTotal: z.number().int().min(800),
  sections: z.array(
    z.object({
      heading: z.string(),
      level: z.union([z.literal(2), z.literal(3)]),
      targetWordCount: z.number().int(),
      coreConcepts: z.array(z.string()),
      keyTakeaways: z.array(z.string()),
      aeoDirectAnswerTarget: z.string().optional(),
      practicalExampleTarget: z.string().optional(),
    })
  ),
  uniqueAngleDescription: z.string().min(10),
  createdAt: z.string(),
});

export type ArticleOutline = z.infer<typeof ArticleOutlineSchema>;

export const CodeSnippetSchema = z.object({
  language: z.string(),
  code: z.string(),
  filename: z.string().optional(),
  isValidated: z.boolean().default(false),
  validationLog: z.string().default(''),
  isTested: z.boolean().default(false),
  isUntestedFlagged: z.boolean().default(false),
});

export type CodeSnippet = z.infer<typeof CodeSnippetSchema>;

export const ArticleDraftSchema = z.object({
  draftId: z.string().min(1),
  articleId: z.string().min(1),
  version: z.number().int().min(1).default(1),
  title: z.string().min(5),
  slug: z.string().min(3),
  metaDescription: z.string().min(10).max(200),
  rawMdxContent: z.string().min(100),
  wordCount: z.number().int().min(1),
  estimatedReadingMinutes: z.number().int().min(1),
  codeSnippets: z.array(CodeSnippetSchema).default([]),
  tableCount: z.number().int().default(0),
  calloutCount: z.number().int().default(0),
  diagramDescriptions: z.array(z.string()).default([]),
  suggestedInternalLinks: z.array(z.string()).default([]),
  suggestedFreeTools: z.array(z.string()).default([]),
  commercialCtaPlacement: z
    .object({
      partner: z.enum(['digiformation', 'digibizos', 'none']),
      headline: z.string(),
      description: z.string(),
      destinationUrl: z.string().url(),
      disclosure: z.string(),
      placementSection: z.string(),
    })
    .nullable()
    .default(null),
  generatedAt: z.string(),
  generatedByModel: z.string(),
});

export type ArticleDraft = z.infer<typeof ArticleDraftSchema>;

// =============================================================================
// 7. EDITORIAL REVISION & QUALITY GATES (Sections 33–35)
// =============================================================================
export interface EditorialRevision {
  revisionId: string;
  draftId: string;
  editorName: string;
  comments: string[];
  requestedChanges: string[];
  sectionsModified: string[];
  timestamp: string;
  previousContentSnapshot?: string;
}

export interface EditorialQualityRubric {
  readerUsefulness: number; // 0-100
  factualAccuracy: number; // 0-100
  researchQuality: number; // 0-100
  originality: number; // 0-100
  practicalDepth: number; // 0-100
  readability: number; // 0-100
  technicalCorrectness: number; // 0-100
  searchIntentAlignment: number; // 0-100
  internalLinkingQuality: number; // 0-100
  commercialIntegrity: number; // 0-100
  accessibility: number; // 0-100
  overallScore: number; // 0-100
  passed: boolean;
  notes: string;
  assessedAt: string;
  assessor: string;
}

export interface HumanApprovalRecord {
  approvalId: string;
  articleId: string;
  draftId: string;
  approverName: string;
  decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  rejectionReason?: string;
  approvalNotes: string;
  approvedPublicationDate?: string;
  timestamp: string;
  verifiedChecks: {
    claimsVerified: boolean;
    sourcesValid: boolean;
    technicalExamplesChecked: boolean;
    legalOrRegulatoryReviewed: boolean;
    commercialDisclosuresCorrect: boolean;
    ctasRelevant: boolean;
    articleOriginal: boolean;
    contentUseful: boolean;
    metadataValid: boolean;
  };
}

// =============================================================================
// 8. BACKGROUND JOB ORCHESTRATION & COST (Sections 36–38)
// =============================================================================
export type JobStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PAUSED' | 'CANCELLED';

export interface EditorialProductionJob {
  jobId: string;
  articleId: string;
  brief: ArticleBrief;
  currentStage: ProductionStage;
  status: JobStatus;
  retryCount: number;
  maxRetries: number;
  tokensConsumed: number;
  estimatedCostUsd: number;
  errorLog: string[];
  auditHistory: {
    stage: ProductionStage;
    agent: AgentRole;
    timestamp: string;
    action: string;
    details?: string;
  }[];
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CostBudgetGovernance {
  monthlyBudgetUsd: number;
  currentSpendUsd: number;
  tokensUsedTotal: number;
  maxCostPerArticleUsd: number;
  isBudgetExceeded: boolean;
  isPaused: boolean;
  alertThresholdPercent: number;
  alertsSent: string[];
}

// =============================================================================
// 9. REVIEWS (Technical, SEO, AEO, GEO, Commercial, Legal)
// =============================================================================
export interface TechnicalValidationResult {
  allSnippetsValid: boolean;
  validatedCount: number;
  untestedCount: number;
  syntaxErrors: string[];
  unsafeCommandsDetected: string[];
  packageVersionChecks: { package: string; verified: boolean; notes: string }[];
}

export interface BusinessRegulatoryReviewResult {
  jurisdiction: string;
  regulatoryComplianceStatus: 'Compliant' | 'Requires Review' | 'Flagged Non-Compliant';
  disclaimerPresent: boolean;
  disclaimerText: string;
  unsupportedGuaranteesDetected: string[];
  statutorySourcesVerified: boolean;
}

export interface SeoReviewResult {
  intentAlignmentScore: number; // 0-100
  titleTagLength: number;
  titleTagValid: boolean;
  metaDescriptionLength: number;
  metaDescriptionValid: boolean;
  canonicalUrl: string;
  headingsHierarchyValid: boolean;
  keywordStuffingRisk: 'None' | 'Low' | 'High';
  passed: boolean;
}

export interface AeoGeoReviewResult {
  quickAnswerPresent: boolean;
  quickAnswerText?: string;
  hasStepByStepList: boolean;
  hasComparisonSummary: boolean;
  hasTroubleshootingSection: boolean;
  hasPracticalChecklist: boolean;
  entityGroundingScore: number; // 0-100
  citationGroundingScore: number; // 0-100
  passed: boolean;
}

export interface CommercialReviewResult {
  isCommercialCtaPresent: boolean;
  partner?: 'digiformation' | 'digibizos';
  destinationUrl?: string;
  isDeepLinkVerified: boolean;
  isStatutoryDisclosurePresent: boolean;
  isRelevantToTopic: boolean;
  isMisleadingIndependenceAvoided: boolean;
  passed: boolean;
}

export interface DuplicationCheckResult {
  titleSimilarityScore: number; // 0-100
  slugCollisionDetected: boolean;
  contentSimilarityScore: number; // 0-100
  isDuplicate: boolean;
  recommendation: 'Proceed' | 'Differentiate Angle' | 'Reject as Redundant';
}

// =============================================================================
// 10. PUBLICATION & FRESHNESS RECORD (Sections 42–44)
// =============================================================================
export interface PublicationRecord {
  publicationId: string;
  articleId: string;
  slug: string;
  canonicalUrl: string;
  publishedAt: string;
  verifiedLive: boolean;
  metadataChecks: {
    openGraphPresent: boolean;
    schemaOrgValid: boolean;
    sitemapIncluded: boolean;
    canonicalMatches: boolean;
  };
}

export interface ContentFreshnessRecord {
  articleId: string;
  freshnessRisk: ContentFreshness;
  lastVerifiedAt: string;
  nextScheduledReverification: string;
  isStale: boolean;
  reverificationNotes: string;
}

// =============================================================================
// 11. 1,000-ARTICLE CAPACITY PLANNING MODEL (Section 46)
// =============================================================================
export interface CapacityPlanMetrics {
  totalTargetArticles: number; // 1,000
  horizonDays: number; // 90
  requiredDailyThroughput: number; // 11.1
  estimatedTokenCostTotalUsd: number;
  estimatedReviewHoursDaily: number;
  potentialBottlenecks: string[];
  mitigationStrategies: string[];
  feasibilityAssessment: 'Fully Feasible with Governance' | 'Resource Constrained' | 'Unfeasible';
}
