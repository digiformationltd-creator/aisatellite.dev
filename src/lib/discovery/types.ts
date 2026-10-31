/**
 * AI Satellite — Phase 14 Autonomous Global Technology Discovery & Intelligence Network
 * Types, Enums, Interfaces, and Zod Validation Schemas
 * Permanent Canonical Domain: https://aisatellite.dev
 */

import { z } from 'zod';

// --- Enums & Categories ---

export type SourceType =
  | 'official_website'
  | 'official_docs'
  | 'github_repo'
  | 'github_releases'
  | 'package_registry'
  | 'changelog'
  | 'license_file'
  | 'security_advisory'
  | 'api_docs'
  | 'research_publication';

export type VerificationLevel = 'authoritative' | 'verified_secondary' | 'community_reported' | 'unverified';

export type SourceStatus = 'active' | 'rate_limited' | 'deprecated' | 'blocked';

export type JobCategory =
  | 'discover_ai_tools'
  | 'discover_open_source'
  | 'monitor_github_releases'
  | 'check_licenses'
  | 'verify_free_tiers'
  | 'detect_pricing_changes'
  | 'discover_frameworks'
  | 'monitor_mcp'
  | 'refresh_research'
  | 'emerging_topics';

export type JobStatus = 'scheduled' | 'running' | 'completed' | 'failed' | 'paused';

export type AlternativeClassification =
  | 'free_and_open_source'
  | 'free_proprietary'
  | 'freemium'
  | 'self_hosted_infra_cost'
  | 'paid_limited_trial'
  | 'no_verified_alternative';

export type TechnologyChangeType =
  | 'rebranding'
  | 'pricing_change'
  | 'free_tier_change'
  | 'licensing_change'
  | 'archived'
  | 'major_release'
  | 'api_deprecation'
  | 'feature_removal'
  | 'documentation_update'
  | 'security_notice';

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unverified';

export type KnowledgeNodeType =
  | 'product'
  | 'company'
  | 'repository'
  | 'license'
  | 'capability'
  | 'api'
  | 'framework'
  | 'tutorial'
  | 'prompt'
  | 'workflow';

export type KnowledgeRelationshipType =
  | 'replaces'
  | 'implements'
  | 'requires'
  | 'licensed_under'
  | 'maintained_by'
  | 'provides_capability'
  | 'has_alternative'
  | 'derived_from';

// Structured Capability Groups
export const CAPABILITY_TAXONOMY = [
  'workflow_automation',
  'crm',
  'project_management',
  'ai_coding',
  'image_editing',
  'video_editing',
  'office_productivity',
  'cloud_hosting',
  'databases',
  'analytics',
  'email_marketing',
  'developer_testing',
  'customer_support',
  'api_development',
  'vector_embeddings',
  'mcp_server',
] as const;

export type CapabilityGroup = (typeof CAPABILITY_TAXONOMY)[number];

// --- Core Data Entities ---

export interface TechnologySource {
  id: string;
  sourceUrl: string;
  sourceType: SourceType;
  organization: string;
  accessMethod: 'rest_api' | 'rss_atom' | 'html_scrape' | 'git_clone';
  verificationLevel: VerificationLevel;
  crawlPermissionsAllowed: boolean;
  rateLimitPerMinute: number;
  lastSuccessfulRetrieval?: string;
  lastVerification?: string;
  status: SourceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DiscoveryJob {
  id: string;
  category: JobCategory;
  scheduleCron: string;
  status: JobStatus;
  timeoutMs: number;
  retryLimit: number;
  currentRetries: number;
  concurrencyLimit: number;
  costBudgetUsd: number;
  lastRunAt?: string;
  nextRunAt?: string;
  lastRunDurationMs?: number;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GitHubIntelligenceRecord {
  id: string;
  repoUrl: string;
  owner: string;
  repoName: string;
  description: string;
  license: string;
  isOsiLicense: boolean;
  latestReleaseTag?: string;
  latestReleaseDate?: string;
  isArchived: boolean;
  supportedLanguages: string[];
  hasDocumentation: boolean;
  documentationUrl?: string;
  openIssueCount: number;
  securityAdvisoriesCount: number;
  installInstructions?: string;
  lastCheckedAt: string;
}

export interface AiToolProfile {
  id: string;
  name: string;
  slug: string;
  websiteUrl: string;
  developerOrg: string;
  primaryPurpose: string;
  capabilities: string[];
  pricingModel: 'free' | 'freemium' | 'paid' | 'open_source';
  freeTierConditions: string;
  apiAvailable: boolean;
  supportedPlatforms: string[];
  documentationUrl: string;
  confidence: ConfidenceLevel;
  lastVerifiedAt: string;
}

export interface FreeAlternativeFinding {
  id: string;
  paidToolName: string;
  alternativeName: string;
  alternativeUrl: string;
  license: string;
  classification: AlternativeClassification;
  capabilityOverlap: string[];
  deploymentOptions: ('cloud' | 'docker' | 'bare_metal' | 'kubernetes')[];
  limitations: string[];
  infrastructureCostEstimated: string;
  evidenceUrls: string[];
  verifiedAt: string;
  editorialProposalId?: string;
}

export interface TechnologyChangeEvent {
  id: string;
  resourceId: string;
  resourceName: string;
  changeType: TechnologyChangeType;
  previousValue: string;
  newValue: string;
  evidenceUrl: string;
  detectionTimestamp: string;
  verificationStatus: 'verified' | 'unconfirmed' | 'rejected';
  affectedResourceUrls: string[];
  proposedAction: string;
}

export interface ClaimEvidence {
  id: string;
  claimId: string;
  sourceUrl: string;
  sourceTitle: string;
  sourceType: SourceType;
  retrievalTimestamp: string;
  verificationTimestamp: string;
  claimSupported: string;
  relevantExcerpt: string;
  confidence: ConfidenceLevel;
  isAuthoritative: boolean;
  reviewStatus: 'approved' | 'pending' | 'rejected';
}

export interface KnowledgeGraphNode {
  id: string;
  type: KnowledgeNodeType;
  name: string;
  slug: string;
  attributes: Record<string, string | number | boolean | string[]>;
}

export interface KnowledgeGraphEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationship: KnowledgeRelationshipType;
  confidence: number; // 0.0 to 1.0
  evidenceId?: string;
}

export interface EditorialProposal {
  id: string;
  title: string;
  proposalType: 'tool_profile' | 'alternative_comparison' | 'project_review' | 'change_report' | 'tutorial_guide';
  researchEvidenceIds: string[];
  targetAudience: string;
  searchIntent: string;
  uniqueValue: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected';
  proposedByAgent: string;
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RadarTelemetryEntry {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  summary: string;
  license: string;
  pricingClassification: string;
  isTrending: boolean;
  replaces?: string[];
  verifiedAt: string;
  coordinates: {
    r: number; // radius distance (0 to 1)
    theta: number; // angle in degrees (0 to 360)
    quadrant: 'ai_models' | 'open_source' | 'frameworks' | 'alternatives';
  };
}

// --- Zod Validation Schemas ---

export const RegisterSourceSchema = z.object({
  sourceUrl: z.string().url('Must be a valid HTTPS URL'),
  sourceType: z.enum([
    'official_website',
    'official_docs',
    'github_repo',
    'github_releases',
    'package_registry',
    'changelog',
    'license_file',
    'security_advisory',
    'api_docs',
    'research_publication',
  ]),
  organization: z.string().min(2),
  accessMethod: z.enum(['rest_api', 'rss_atom', 'html_scrape', 'git_clone']).default('rest_api'),
  verificationLevel: z.enum(['authoritative', 'verified_secondary', 'community_reported', 'unverified']).default('authoritative'),
  crawlPermissionsAllowed: z.boolean().default(true),
  rateLimitPerMinute: z.number().int().min(1).max(120).default(30),
});

export const CreateDiscoveryJobSchema = z.object({
  category: z.enum([
    'discover_ai_tools',
    'discover_open_source',
    'monitor_github_releases',
    'check_licenses',
    'verify_free_tiers',
    'detect_pricing_changes',
    'discover_frameworks',
    'monitor_mcp',
    'refresh_research',
    'emerging_topics',
  ]),
  scheduleCron: z.string().default('0 */6 * * *'),
  timeoutMs: z.number().int().min(10).max(60000).default(15000),
  retryLimit: z.number().int().min(1).max(5).default(3),
  concurrencyLimit: z.number().int().min(1).max(10).default(2),
  costBudgetUsd: z.number().min(0).max(50).default(5.0),
});

export const CreateEvidenceSchema = z.object({
  claimId: z.string().min(2),
  sourceUrl: z.string().url(),
  sourceTitle: z.string().min(2),
  sourceType: z.enum([
    'official_website',
    'official_docs',
    'github_repo',
    'github_releases',
    'package_registry',
    'changelog',
    'license_file',
    'security_advisory',
    'api_docs',
    'research_publication',
  ]),
  claimSupported: z.string().min(5),
  relevantExcerpt: z.string().min(10).max(500), // Excerpts strictly limited to prevent copyright reproduction
  confidence: z.enum(['high', 'medium', 'low', 'unverified']).default('high'),
  isAuthoritative: z.boolean().default(true),
});

export const CreateEditorialProposalSchema = z.object({
  title: z.string().min(5).max(140),
  proposalType: z.enum(['tool_profile', 'alternative_comparison', 'project_review', 'change_report', 'tutorial_guide']),
  researchEvidenceIds: z.array(z.string()).min(1, 'Proposal must reference at least one verified evidence record'),
  targetAudience: z.string().min(3),
  searchIntent: z.string().min(5),
  uniqueValue: z.string().min(10),
  proposedByAgent: z.string().default('Autonomous Research Agent'),
});
