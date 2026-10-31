/**
 * AI Satellite — Phase 10 Autonomous Operations Data Models & Schemas
 * Comprehensive types for website health, technology change tracking, free-tier re-verification,
 * content freshness, SEO/AEO/GEO optimization, developer experience, security, and improvement tickets.
 */

import { z } from 'zod';

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';

export type ImprovementStatus =
  | 'detected'
  | 'researching'
  | 'proposed'
  | 'awaiting_approval'
  | 'approved'
  | 'in_progress'
  | 'testing'
  | 'completed'
  | 'failed'
  | 'rejected';

export type VerificationStatus =
  | 'verified'
  | 'partially_verified'
  | 'verification_pending'
  | 'conflicting_evidence'
  | 'outdated';

export type ServiceHealthStatus = 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE';

// --- Module A: Website Health Monitor Models ---
export interface HealthIncident {
  id: string; // INC-xxxx
  service:
    | 'http_availability'
    | 'dns_resolution'
    | 'tls_certificate'
    | 'broken_routes'
    | 'failed_endpoints'
    | 'static_assets'
    | 'client_js_runtime'
    | 'server_runtime'
    | 'cloudflare_deployment'
    | 'search_system'
    | 'newsletter_form'
    | 'interactive_components'
    | 'webgl_threejs_runtime';
  timestamp: string;
  severity: IssueSeverity;
  evidence: string;
  status: 'detected' | 'investigating' | 'mitigated' | 'resolved';
  assignedAction: string;
  resolutionTimestamp?: string;
  retryCount: number;
}

export interface WebsiteHealthSummary {
  overallStatus: ServiceHealthStatus;
  lastCheckedAt: string;
  activeIncidentsCount: number;
  criticalIncidentsCount: number;
  uptimePercent30Days: number;
  services: Record<string, { status: ServiceHealthStatus; latencyMs: number; lastChecked: string }>;
}

// --- Module B: Technology Intelligence Monitor Models ---
export type TechnologyChangeType =
  | 'new_release'
  | 'deprecation'
  | 'license_change'
  | 'free_tier_change'
  | 'pricing_change'
  | 'api_change'
  | 'project_archival'
  | 'documentation_update'
  | 'security_advisory';

export interface TechnologySourceChange {
  id: string;
  resourceId: string;
  resourceName: string;
  changeType: TechnologyChangeType;
  sourceUrl: string;
  detectedAt: string;
  summary: string;
  previousValue?: string;
  newValue?: string;
  requiresReview: boolean;
  isResolved: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
}

// --- Module C: Free Alternatives Verification Models ---
export interface FreeAlternativeVerification {
  resourceId: string;
  resourceName: string;
  status: VerificationStatus;
  license: string;
  isFreeAvailable: boolean;
  freeClassification: 'free_open_source' | 'free_self_hosted' | 'free_tier_hosted' | 'freemium' | 'paid_only';
  hostedFreeTierLimitations: string[];
  selfHostingRequirements: string[];
  infrastructureCostEstimateUsdMonth: number;
  featureCompatibilityScore: number; // 0-100
  platformCompatibility: string[];
  maintenanceStatus: 'active' | 'infrequent' | 'archived' | 'abandoned';
  officialDocumentationUrl: string;
  lastVerifiedAt: string;
  nextRecheckDue: string;
  limitationsExplanation?: string;
  evidenceUrls: string[];
}

// --- Module D: Content Freshness Models ---
export type ManagedContentType =
  | 'software_review'
  | 'free_alternative'
  | 'ai_tool_comparison'
  | 'coding_tutorial'
  | 'css_tutorial'
  | 'threejs_demo'
  | 'ai_prompt'
  | 'api_guide'
  | 'mcp_tutorial'
  | 'automation_workflow'
  | 'technical_blog';

export interface ContentFreshnessRecord {
  id: string;
  contentSlug: string;
  contentType: ManagedContentType;
  title: string;
  lastAuditedAt: string;
  daysStale: number;
  isOutdated: boolean;
  evidenceUrls: string[];
  proposedChanges: string[];
  changeHistory: Array<{
    timestamp: string;
    editor: string;
    summary: string;
  }>;
  status: 'current' | 'review_required' | 'proposal_pending' | 'updated';
}

// --- Module E: Search, AEO & GEO Optimization Models ---
export interface SEOAuditFinding {
  id: string;
  url: string;
  category:
    | 'canonical'
    | 'indexability'
    | 'sitemap'
    | 'robots'
    | 'redirect_chain'
    | 'broken_link'
    | 'duplicate_metadata'
    | 'orphan_page'
    | 'structured_data'
    | 'core_web_vitals'
    | 'image_optimization'
    | 'mobile_usability';
  severity: IssueSeverity;
  evidence: string;
  recommendedFix: string;
  priority: number; // 1 (highest) to 10
  status: 'open' | 'fixing' | 'resolved' | 'ignored';
  detectedAt: string;
}

export interface AEOEvaluation {
  pageSlug: string;
  directAnswerClarityScore: number; // 0-100
  definitionAccuracyScore: number; // 0-100
  technicalCompletenessScore: number; // 0-100
  sourceGroundingScore: number; // 0-100
  codeExampleQualityScore: number; // 0-100
  hasStructuredDefinitions: boolean;
  suggestedImprovements: string[];
  evaluatedAt: string;
}

export interface GEOEvaluation {
  entitySlug: string;
  entityName: string;
  clearDescriptionScore: number; // 0-100
  verifiedLicenseDisclosed: boolean;
  sourceGroundedClaimsCount: number;
  originalResearchPresent: boolean;
  productRelationshipsAccurate: boolean;
  stableCanonicalPresent: boolean;
  citationRealismDisclaimer: string;
  overallGeoScore: number; // 0-100
  evaluatedAt: string;
}

// --- Module F: Developer Experience Models ---
export interface DevExIncident {
  id: string;
  signalType:
    | 'zero_result_search'
    | 'broken_code_example'
    | 'failed_copy_button'
    | 'broken_demo'
    | 'invalid_download_link'
    | 'unclear_filter'
    | 'mobile_defect'
    | 'accessibility_error';
  queryOrPath: string;
  occurrenceCount: number;
  lastOccurredAt: string;
  description: string;
  proposedSolution: string;
  isResolved: boolean;
}

// --- Module G: Security & Dependency Models ---
export interface SecurityAuditFinding {
  id: string;
  scanType:
    | 'dependency_vulnerability'
    | 'secret_exposure'
    | 'security_headers'
    | 'auth_enforcement'
    | 'rate_limiting'
    | 'input_validation'
    | 'prompt_injection';
  severity: IssueSeverity;
  target: string;
  description: string;
  remediation: string;
  status: 'open' | 'resolved' | 'acknowledged';
  detectedAt: string;
}

// --- Module H: Improvement Planner Models ---
export interface ImprovementTicket {
  id: string; // TKT-xxxx
  title: string;
  description: string;
  severity: IssueSeverity;
  status: ImprovementStatus;
  priorityTier: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  // 1: Critical security, 2: Outages, 3: Broken core, 4: Incorrect claims, 5: Indexability, 6: Accessibility, 7: Performance, 8: Content, 9: Cosmetic
  evidenceUrls: string[];
  affectedResources: string[];
  proposedSolution: string;
  estimatedComplexity: 'low' | 'medium' | 'high';
  riskLevel: 'low' | 'medium' | 'high';
  requiredApproval: 'lead_architect' | 'editorial_lead' | 'security_officer' | 'none';
  validationPlan: string;
  rollbackPlan: string;
  approvalSignature?: string;
  approvedAt?: string;
  executionLogs: string[];
  createdAt: string;
  updatedAt: string;
}

// --- Module I & K: Scheduler, Cost Control & Rollback Models ---
export interface ScheduledJobRecord {
  id: string;
  name: string;
  cadence: 'few_minutes' | 'daily' | 'weekly' | 'monthly';
  description: string;
  lastRunAt?: string;
  nextRunDue: string;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'disabled';
  runCount: number;
  failureCount: number;
  maxRetries: number;
  isIdempotent: boolean;
}

export interface CostControlBudget {
  monthlyBudgetUsd: number;
  estimatedSpentUsd: number;
  apiCallsThisMonth: number;
  quotaRemainingPercent: number;
  concurrencyLimit: number;
  isNoncriticalThrottled: boolean;
  costEstimates: {
    hostingPages: number;
    searchConsoleApi: number;
    dnsAndEdge: number;
    aiResearchTokens: number;
    totalEstimatedMonthlyUsd: number;
  };
}

export interface RollbackSnapshot {
  id: string;
  ticketId: string;
  targetFileOrResource: string;
  snapshotData: string; // JSON payload or text
  createdAt: string;
  restoredAt?: string;
  reason: string;
}

// --- Zod Validation Schemas ---
export const ImprovementTicketSchema = z.object({
  id: z.string().startsWith('TKT-'),
  title: z.string().min(5),
  description: z.string().min(10),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  status: z.enum([
    'detected',
    'researching',
    'proposed',
    'awaiting_approval',
    'approved',
    'in_progress',
    'testing',
    'completed',
    'failed',
    'rejected',
  ]),
  priorityTier: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
    z.literal(7),
    z.literal(8),
    z.literal(9),
  ]),
  evidenceUrls: z.array(z.string().url()).min(1),
  affectedResources: z.array(z.string()),
  proposedSolution: z.string().min(5),
  estimatedComplexity: z.enum(['low', 'medium', 'high']),
  riskLevel: z.enum(['low', 'medium', 'high']),
  requiredApproval: z.enum(['lead_architect', 'editorial_lead', 'security_officer', 'none']),
  validationPlan: z.string(),
  rollbackPlan: z.string(),
  executionLogs: z.array(z.string()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});
