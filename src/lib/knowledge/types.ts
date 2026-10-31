/**
 * AI Satellite — Phase 11 Universal Content Data Models & Schemas
 * Universal schemas supporting all 14 knowledge universe resource categories,
 * editorial lifecycle workflows, semantic knowledge graph links, and search indexing.
 */

import { z } from 'zod';

export type EditorialStatus =
  | 'draft'
  | 'researching'
  | 'fact_checking'
  | 'technical_review'
  | 'editorial_review'
  | 'approved'
  | 'published'
  | 'needs_update'
  | 'archived';

export type KnowledgeCategory =
  | 'free_alternatives'
  | 'open_source'
  | 'ai_tools'
  | 'ai_agents'
  | 'mcp_servers'
  | 'ai_prompts'
  | 'developer_tutorials'
  | 'css_components'
  | 'threejs_webgl'
  | 'free_apis'
  | 'automation_workflows'
  | 'software_comparisons'
  | 'developer_troubleshooting'
  | 'research_reports';

export type FreeClassification =
  | 'free_open_source'
  | 'free_self_hosted'
  | 'free_tier_hosted'
  | 'freemium'
  | 'free_trial'
  | 'paid_only';

// --- Universal Base Resource Interface ---
export interface UniversalResourceBase {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: KnowledgeCategory;
  tags: string[];
  authorOrMaintainer: string;
  sourceReferences: Array<{ title: string; url: string }>;
  verificationStatus: 'verified' | 'partially_verified' | 'pending' | 'outdated' | 'conflicting_evidence';
  lastVerifiedDate: string;
  publishedDate: string;
  updatedDate: string;
  relatedResourceIds: string[];
  editorialStatus: EditorialStatus;
  searchKeywords: string[];
}

// --- Specific Resource Models ---

// 1. Free Software Alternative
export interface FreeAlternativeResource extends UniversalResourceBase {
  category: 'free_alternatives';
  originalProduct: string;
  freeClassification: FreeClassification;
  license: string;
  isGenuinelyFree: boolean;
  isOpenSource: boolean;
  selfHostingRequirements: string[];
  hostedFreeTierLimitations: string[];
  keyDifferences: string[];
  platformCompatibility: string[];
  suitableUseCases: string[];
  knownDisadvantages: string[];
  officialSources: string[];
}

// 2. Open-Source Project Profile
export interface OpenSourceProjectResource extends UniversalResourceBase {
  category: 'open_source';
  repositoryUrl: string;
  license: string;
  installationOptions: string[];
  supportedOperatingSystems: string[];
  keyFeatures: string[];
  documentationUrl: string;
  latestVerifiedRelease?: string;
  maintenanceSignals: {
    isActive: boolean;
    commitFrequency: 'high' | 'moderate' | 'low';
    archived: boolean;
  };
  securityConsiderations: string[];
}

// 3. AI Tool Profile
export interface AIToolResource extends UniversalResourceBase {
  category: 'ai_tools';
  pricingModel: 'Free' | 'Freemium' | 'Paid' | 'Open Source' | 'Self-Hosted';
  freeTierLimitsDescription: string;
  capabilities: string[];
  requiresApiKey: boolean;
  localExecutionSupported: boolean;
  officialPricingUrl: string;
}

// 4. Free API Profile
export interface FreeAPIResource extends UniversalResourceBase {
  category: 'free_apis';
  endpointBaseUrl: string;
  documentationUrl: string;
  authenticationType: 'None' | 'API Key (Free)' | 'OAuth2' | 'Bearer Token';
  freeTierQuota: string;
  rateLimitsVerified: string;
  commercialUsageAllowed: boolean;
  exampleRequestSnippet: string; // Must use safe placeholders, NEVER real keys
  supportedLanguages: string[];
  knownLimitations: string[];
}

// 5. Developer Troubleshooting Solution
export interface TroubleshootingResource extends UniversalResourceBase {
  category: 'developer_troubleshooting';
  symptoms: string[];
  likelyCauses: string[];
  diagnosticSteps: string[];
  verifiedFixes: Array<{
    title: string;
    explanation: string;
    codeSnippet?: string;
    risk: 'low' | 'medium' | 'high';
  }>;
  applicableVersions: string[];
  referenceLinks: string[];
}

// 6. AI Agent & MCP Server Profile
export interface MCPServerResource extends UniversalResourceBase {
  category: 'mcp_servers';
  mcpProtocolVersion: string;
  serverType: 'stdio' | 'sse' | 'http';
  toolsProvided: Array<{
    name: string;
    description: string;
    inputSchemaSummary: string;
  }>;
  permissionsRequired: string[];
  securityAdvisories: string[];
  installationSnippet: string;
  testedClients: string[]; // e.g. Claude Desktop, Cursor, AI Satellite
}

// --- Zod Validation Schema for Universal Content ---
export const UniversalResourceBaseSchema = z.object({
  id: z.string().min(3),
  title: z.string().min(5),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  summary: z.string().min(10),
  category: z.enum([
    'free_alternatives',
    'open_source',
    'ai_tools',
    'ai_agents',
    'mcp_servers',
    'ai_prompts',
    'developer_tutorials',
    'css_components',
    'threejs_webgl',
    'free_apis',
    'automation_workflows',
    'software_comparisons',
    'developer_troubleshooting',
    'research_reports',
  ]),
  tags: z.array(z.string()).min(1),
  authorOrMaintainer: z.string().min(2),
  sourceReferences: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
  })).min(1),
  verificationStatus: z.enum(['verified', 'partially_verified', 'pending', 'outdated', 'conflicting_evidence']),
  lastVerifiedDate: z.string(),
  publishedDate: z.string(),
  updatedDate: z.string(),
  relatedResourceIds: z.array(z.string()).default([]),
  editorialStatus: z.enum([
    'draft',
    'researching',
    'fact_checking',
    'technical_review',
    'editorial_review',
    'approved',
    'published',
    'needs_update',
    'archived',
  ]),
  searchKeywords: z.array(z.string()).default([]),
});
