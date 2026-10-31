import { z } from 'zod';

export type ResourceKind =
  | 'software'
  | 'ai_tool'
  | 'open_source'
  | 'prompt'
  | 'workflow'
  | 'tutorial'
  | 'project'
  | 'api'
  | 'mcp_server';

export type VerificationStatus = 'verified' | 'pending' | 'outdated';

export type PricingClassification =
  | 'open_source'
  | 'free_forever'
  | 'free_tier'
  | 'freemium'
  | 'free_trial'
  | 'self_hosted'
  | 'paid_infrastructure_required'
  | 'verification_pending';

export type SearchIntent =
  | 'find_alternative'
  | 'compare_tools'
  | 'solve_problem'
  | 'find_prompt'
  | 'find_ai_tool'
  | 'find_workflow'
  | 'find_open_source'
  | 'find_tutorial'
  | 'explore_topic';

export interface SourceCitation {
  title: string;
  url: string;
  domain: string;
  retrievedAt: string;
  sourceType: 'official_docs' | 'github_repo' | 'release_notes' | 'verified_benchmark';
}

export interface TechnologyResource {
  id: string;
  slug: string;
  title: string;
  kind: ResourceKind;
  description: string;
  categories: string[];
  tags: string[];
  officialUrl?: string;
  repositoryUrl?: string;
  documentationUrl?: string;
  evidenceUrls: string[];
  verificationStatus: VerificationStatus;
  lastVerified: string;
  createdAt: string;
  updatedAt: string;
  license?: string;
  pricingClassification: PricingClassification[];
  selfHosted: boolean;
  freeHostedTier: boolean;
  paidInfrastructureRequired: boolean;
  replaces?: string[]; // e.g., ['Zapier'], ['Photoshop']
  features?: string[];
  limitations?: string[];
  setupComplexity?: 'Low' | 'Medium' | 'High';
  stars?: number;
}

export interface RadarCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  cluster: 'ai' | 'open_source' | 'development' | 'automation' | 'infrastructure' | 'design' | 'business' | 'security';
  resourceCount: number;
  iconName: string;
}

export interface GroundedAnswer {
  directAnswer: string;
  recommendedResources: Array<{
    id: string;
    slug: string;
    title: string;
    url?: string;
    whyItFits: string;
    limitations: string[];
    freeClassification: string;
    setupComplexity: string;
    documentationUrl?: string;
  }>;
  freeAndPaidLimitations: string[];
  setupComplexitySummary: string;
  usefulDocumentation: Array<{ title: string; url: string }>;
  relatedPrompts: Array<{ title: string; slug: string; category: string }>;
  relatedTutorials: Array<{ title: string; url: string }>;
  evidenceReferences: SourceCitation[];
  lastVerifiedDate: string;
  hasUnverifiedClaims: boolean;
  unverifiedNotes?: string;
}

export interface DeveloperSolution {
  id: string;
  slug: string;
  problem: string;
  recommendedApproach: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  requiredTools: Array<{ name: string; url: string; openSource: boolean }>;
  implementationSteps: Array<{
    step: number;
    title: string;
    description: string;
    codeSnippet?: string;
    language?: string;
  }>;
  verificationSteps: string[];
  commonErrors: Array<{ error: string; resolution: string }>;
  alternatives: string[];
  sources: Array<{ title: string; url: string }>;
  lastVerified: string;
}

export interface PromptVariable {
  name: string;
  label: string;
  defaultValue: string;
  description: string;
}

export interface PromptTemplate {
  id: string;
  slug: string;
  title: string;
  category: string;
  format: 'short' | 'advanced' | 'master' | 'workflow' | 'agent' | 'system' | 'template';
  description: string;
  targetModel: string;
  systemPrompt: string;
  templateText: string;
  variables: PromptVariable[];
  exampleUsage: string;
  expectedOutput: string;
  limitations: string[];
  compatibleEnvironments: string[];
  version: string;
  lastVerified: string;
}

// Zod Schemas
export const TechnologyResourceSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  kind: z.enum([
    'software',
    'ai_tool',
    'open_source',
    'prompt',
    'workflow',
    'tutorial',
    'project',
    'api',
    'mcp_server',
  ]),
  description: z.string().min(1),
  categories: z.array(z.string()).min(1),
  tags: z.array(z.string()).default([]),
  officialUrl: z.string().url().optional(),
  repositoryUrl: z.string().url().optional(),
  documentationUrl: z.string().url().optional(),
  evidenceUrls: z.array(z.string().url()).min(1),
  verificationStatus: z.enum(['verified', 'pending', 'outdated']),
  lastVerified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  createdAt: z.string(),
  updatedAt: z.string(),
  license: z.string().optional(),
  pricingClassification: z.array(
    z.enum([
      'open_source',
      'free_forever',
      'free_tier',
      'freemium',
      'free_trial',
      'self_hosted',
      'paid_infrastructure_required',
      'verification_pending',
    ])
  ).min(1),
  selfHosted: z.boolean().default(false),
  freeHostedTier: z.boolean().default(false),
  paidInfrastructureRequired: z.boolean().default(false),
  replaces: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  limitations: z.array(z.string()).optional(),
  setupComplexity: z.enum(['Low', 'Medium', 'High']).optional(),
  stars: z.number().optional(),
});

export const SearchQuerySchema = z.object({
  query: z.string().trim().max(300),
  category: z.string().optional(),
  pricing: z.string().optional(),
  selfHostedOnly: z.boolean().optional(),
  license: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(10),
});
