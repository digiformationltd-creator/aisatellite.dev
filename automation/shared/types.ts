import { z } from 'zod';

export type ResourceStatus =
  | 'discovered'
  | 'researching'
  | 'verification_pending'
  | 'verified'
  | 'rejected'
  | 'published'
  | 'stale';

export type FreeClassification =
  | 'open_source'
  | 'free_forever'
  | 'freemium'
  | 'free_trial'
  | 'paid'
  | 'unknown';

export const DiscoveredResourceSchema = z.object({
  id: z.string().min(1),
  canonicalUrl: z.string().url(),
  name: z.string().min(1),
  description: z.string().min(5),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  repositoryUrl: z.string().url().optional(),
  officialUrl: z.string().url().optional(),
  documentationUrl: z.string().url().optional(),
  licenseSpdx: z.string().optional(),
  licenseEvidenceUrl: z.string().url().optional(),
  freeClassification: z.enum([
    'open_source',
    'free_forever',
    'freemium',
    'free_trial',
    'paid',
    'unknown',
  ]),
  freeTierLimitations: z.array(z.string()).default([]),
  githubStars: z.number().int().nonnegative().optional(),
  githubForks: z.number().int().nonnegative().optional(),
  lastRepositoryUpdate: z.string().optional(),
  lastVerified: z.string().optional(),
  evidenceUrls: z.array(z.string().url()).default([]),
  status: z.enum([
    'discovered',
    'researching',
    'verification_pending',
    'verified',
    'rejected',
    'published',
    'stale',
  ]),
  qualityScore: z.number().min(0).max(100).optional(),
  rejectionReason: z.string().optional(),
  contentHash: z.string().optional(),
  discoveredAt: z.string(),
  updatedAt: z.string(),
});

export type DiscoveredResource = z.infer<typeof DiscoveredResourceSchema>;

export const EvidenceRecordSchema = z.object({
  claimId: z.string(),
  claim: z.string(),
  sourceUrl: z.string().url(),
  sourceType: z.enum([
    'official_documentation',
    'repository_readme',
    'license_file',
    'pricing_page',
    'statutory_government_source',
    'release_announcement',
  ]),
  verifiedAt: z.string(),
  confidence: z.enum(['high', 'medium', 'low']),
});

export type EvidenceRecord = z.infer<typeof EvidenceRecordSchema>;

export const QualityScoreBreakdownSchema = z.object({
  developerUsefulness: z.number().min(0).max(100),
  documentationQuality: z.number().min(0).max(100),
  freeAccessibility: z.number().min(0).max(100),
  maintenanceConfidence: z.number().min(0).max(100),
  installationUsability: z.number().min(0).max(100),
  communitySignals: z.number().min(0).max(100),
  totalScore: z.number().min(0).max(100),
  summary: z.string(),
});

export type QualityScoreBreakdown = z.infer<typeof QualityScoreBreakdownSchema>;

export const TopicProposalSchema = z.object({
  topicId: z.string(),
  title: z.string().min(5),
  slug: z.string().min(3),
  category: z.string(),
  searchIntent: z.string(),
  targetKeywords: z.array(z.string()),
  evidenceReferences: z.array(z.string()),
  priorityScore: z.number().min(0).max(100),
  contentGapRationale: z.string(),
  recommendedPartner: z.enum(['digiformation', 'digibizos', 'none']).default('none'),
  approvedForDrafting: z.boolean().default(false),
  proposedAt: z.string(),
});

export type TopicProposal = z.infer<typeof TopicProposalSchema>;

export const ArticleDraftSchema = z.object({
  draftId: z.string(),
  topicId: z.string(),
  title: z.string().min(5),
  slug: z.string().min(3),
  description: z.string().min(10),
  category: z.string(),
  tags: z.array(z.string()),
  author: z.string(),
  readingTime: z.string(),
  partnerContext: z.enum(['digiformation', 'digibizos', 'both', 'none']),
  evidenceLedger: z.array(EvidenceRecordSchema),
  mdxContent: z.string(),
  status: z.enum([
    'drafted',
    'validation_pending',
    'validation_failed',
    'ready_for_review',
    'approved',
    'rejected',
    'published',
  ]),
  validationErrors: z.array(z.string()).default([]),
  editorialReviewNotes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ArticleDraft = z.infer<typeof ArticleDraftSchema>;

export interface VerificationStageResult {
  stage: string;
  passed: boolean;
  notes: string;
  evidenceUrl?: string;
}

export interface VerificationPipelineResult {
  resourceId: string;
  passed: boolean;
  finalClassification: FreeClassification;
  stages: VerificationStageResult[];
  reasons: string[];
  verifiedAt: string;
}

export interface FreshnessReport {
  checkedAt: string;
  totalMonitored: number;
  healthyCount: number;
  brokenLinkCount: number;
  staleCount: number;
  flaggedItems: Array<{
    id: string;
    url: string;
    issue: string;
  }>;
}
