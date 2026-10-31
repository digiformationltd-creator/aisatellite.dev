import { z } from 'zod';

export type EvidenceStatus =
  | 'verified'
  | 'partially_verified'
  | 'unverified'
  | 'conflicting'
  | 'outdated';

export type EditorialStatus =
  | 'research'
  | 'draft'
  | 'verification'
  | 'technical_review'
  | 'editorial_review'
  | 'approved'
  | 'published'
  | 'needs_update'
  | 'rejected';

export type ClaimVolatility = 'high' | 'medium' | 'low';

export interface ResearchClaim {
  id: string;
  resourceId: string;
  statement: string;
  evidenceUrls: string[];
  status: EvidenceStatus;
  sourceType: 'official_docs' | 'pricing_page' | 'github_repo' | 'license_file' | 'release_notes' | 'community_lead';
  retrievalTimestamp: string;
  verifiedAt?: string;
  verificationMethod: 'primary_source_inspection' | 'sha256_hash_match' | 'spdx_license_match' | 'http_status_check';
  reviewerStatus: 'unreviewed' | 'analyst_verified' | 'editor_signed';
  volatility: ClaimVolatility;
  recheckIntervalDays: number;
}

export interface EditorialArticle {
  id: string;
  slug: string;
  title: string;
  articleType:
    | 'alternative_guide'
    | 'software_comparison'
    | 'opensource_review'
    | 'ai_tool_guide'
    | 'developer_tutorial'
    | 'coding_walkthrough'
    | 'architecture_guide'
    | 'troubleshooting'
    | 'prompt_collection'
    | 'agent_tutorial'
    | 'mcp_guide'
    | 'threejs_tutorial'
    | 'css_component_guide'
    | 'api_tutorial'
    | 'deployment_guide'
    | 'research_report';
  primaryTopic: string;
  targetKeywords: string[];
  searchIntent: string;
  claimIds: string[];
  sourceIds: string[];
  status: EditorialStatus;
  approvedBy?: string;
  approvedAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentCluster {
  id: string;
  slug: string;
  title: string;
  pillarPageUrl: string;
  supportingUrls: string[];
  category: string;
  description: string;
}

export const ResearchClaimSchema = z.object({
  id: z.string().min(1),
  resourceId: z.string().min(1),
  statement: z.string().min(5),
  evidenceUrls: z.array(z.string().url()).min(1),
  status: z.enum(['verified', 'partially_verified', 'unverified', 'conflicting', 'outdated']),
  sourceType: z.enum([
    'official_docs',
    'pricing_page',
    'github_repo',
    'license_file',
    'release_notes',
    'community_lead',
  ]),
  retrievalTimestamp: z.string(),
  verifiedAt: z.string().optional(),
  verificationMethod: z.enum([
    'primary_source_inspection',
    'sha256_hash_match',
    'spdx_license_match',
    'http_status_check',
  ]),
  reviewerStatus: z.enum(['unreviewed', 'analyst_verified', 'editor_signed']),
  volatility: z.enum(['high', 'medium', 'low']),
  recheckIntervalDays: z.number().int().positive(),
});

export const EditorialArticleSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(5),
  articleType: z.enum([
    'alternative_guide',
    'software_comparison',
    'opensource_review',
    'ai_tool_guide',
    'developer_tutorial',
    'coding_walkthrough',
    'architecture_guide',
    'troubleshooting',
    'prompt_collection',
    'agent_tutorial',
    'mcp_guide',
    'threejs_tutorial',
    'css_component_guide',
    'api_tutorial',
    'deployment_guide',
    'research_report',
  ]),
  primaryTopic: z.string().min(1),
  targetKeywords: z.array(z.string()).default([]),
  searchIntent: z.string().min(1),
  claimIds: z.array(z.string()).default([]),
  sourceIds: z.array(z.string()).default([]),
  status: z.enum([
    'research',
    'draft',
    'verification',
    'technical_review',
    'editorial_review',
    'approved',
    'published',
    'needs_update',
    'rejected',
  ]),
  approvedBy: z.string().optional(),
  approvedAt: z.string().optional(),
  publishedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
