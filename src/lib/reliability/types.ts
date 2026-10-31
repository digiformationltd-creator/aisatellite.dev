/**
 * AI SATELLITE — PHASE 16: PRODUCTION RELIABILITY & SCALE TYPE SYSTEM
 * Permanent Production Domain: https://aisatellite.dev
 */

import { z } from 'zod';

// ==============================================================================
// 1. PRODUCTION ARCHITECTURE AUDIT & DEPENDENCY MAP
// ==============================================================================

export type ArchitectureLayer = 'edge-cdn' | 'application' | 'database' | 'search' | 'background-workers' | 'external-apis';

export interface ArchitectureNode {
  id: string;
  name: string;
  layer: ArchitectureLayer;
  technology: string;
  isPublic: boolean;
  costSensitive: boolean;
  failureRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
}

export interface ArchitectureEdge {
  source: string;
  target: string;
  protocol: 'HTTPS' | 'D1-SQL' | 'R2-S3' | 'IPC' | 'FILE-IO';
  crossesSecurityBoundary: boolean;
  description: string;
}

export interface FailurePoint {
  id: string;
  component: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  failureMode: string;
  recoveryStrategy: string;
}

export interface CostSensitiveService {
  service: string;
  quotaUnit: string;
  monthlyLimit: number;
  observedMonthlyUsage: number;
  circuitBreakerThresholdPercent: number;
}

export interface ProductionDependencyMap {
  version: string;
  canonicalOrigin: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  failurePoints: FailurePoint[];
  costSensitiveServices: CostSensitiveService[];
  auditedAt: string;
}

// ==============================================================================
// 2. SERVICE LEVEL OBJECTIVES (SLOs) & INDICATORS (SLIs)
// ==============================================================================

export type SLIName =
  | 'public_page_availability'
  | 'api_request_success_rate'
  | 'response_latency_p95'
  | 'search_availability'
  | 'auth_session_reliability'
  | 'background_job_success_rate'
  | 'data_freshness_sla'
  | 'deployment_failure_rate';

export interface ServiceLevelObjective {
  sliName: SLIName;
  label: string;
  targetValue: number;
  observedValue: number;
  unit: '%' | 'ms' | 'hours';
  status: 'COMPLIANT' | 'AT_RISK' | 'BREACHED';
  errorBudgetRemainingPercent: number;
  description: string;
}

// ==============================================================================
// 3. GLOBAL EDGE DELIVERY & CACHING
// ==============================================================================

export interface EdgeCacheRule {
  pathPattern: string;
  cacheControl: string;
  isPublicCache: boolean;
  edgeTtlSeconds: number;
  browserTtlSeconds: number;
  staleWhileRevalidateSeconds?: number;
  requiresAuthentication: boolean;
}

export interface RegionalLatencyCheck {
  region: string; // e.g. 'iad' (US-East), 'lhr' (EU-West), 'nrt' (Asia-East)
  locationName: string;
  measuredLatencyMs: number;
  status: 'OPTIMAL' | 'DEGRADED';
}

// ==============================================================================
// 4. BACKGROUND JOBS & IDEMPOTENCY
// ==============================================================================

export type BackgroundJobType =
  | 'tech-discovery'
  | 'github-research'
  | 'software-verification'
  | 'content-freshness'
  | 'search-indexing'
  | 'seo-monitoring'
  | 'newsletter-distribution'
  | 'analytics-aggregation';

export type JobStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'DEAD_LETTER';

export interface BackgroundJob {
  id: string;
  jobType: BackgroundJobType;
  idempotencyKey: string;
  payload: Record<string, any>;
  status: JobStatus;
  attempts: number;
  maxRetries: number;
  backoffFactorMs: number;
  timeoutMs: number;
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface DeadLetterJob {
  jobId: string;
  jobType: BackgroundJobType;
  failureReason: string;
  payload: Record<string, any>;
  attempts: number;
  firstFailedAt: string;
  lastFailedAt: string;
  replayed: boolean;
  replayedAt?: string;
}

// ==============================================================================
// 5. SEARCH INFRASTRUCTURE HARDENING
// ==============================================================================

export interface SearchHealthCheck {
  isIndexHealthy: boolean;
  indexedPagesCount: number;
  indexedWordsCount: number;
  indexSizeBytes: number;
  privateDataExcluded: boolean;
  sanitizationActive: boolean;
  fallbackAvailable: boolean;
  lastVerifiedAt: string;
}

// ==============================================================================
// 6. AUTHENTICATION & AUTHORIZATION SECURITY (IDOR PROTECTION)
// ==============================================================================

export interface SessionSecurityPolicy {
  cookieName: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'Strict' | 'Lax' | 'None';
  maxAgeSeconds: number;
  inactivityTimeoutSeconds: number;
  csrfTokenRequired: boolean;
}

export interface ResourceAccessRequest {
  requestingUserId: string;
  resourceOwnerId: string;
  resourceType: 'workspace' | 'snippet' | 'prompt' | 'project' | 'admin-console';
  action: 'READ' | 'WRITE' | 'DELETE';
  requestingUserRoles?: string[];
}

export interface AuthorizationResult {
  granted: boolean;
  denialReason?: string;
  isIdorAttemptDetected?: boolean;
}

// ==============================================================================
// 7. APPLICATION SECURITY & SSRF PROTECTION
// ==============================================================================

export interface SSRFValidationResult {
  isSafe: boolean;
  targetUrl: string;
  hostname: string;
  blockedReason?: string;
}

// ==============================================================================
// 8. AI AGENT SECURITY BOUNDARY
// ==============================================================================

export interface AIAgentSecurityRule {
  agentName: string;
  allowedTools: string[];
  blockedTools: string[];
  maxExecutionDurationSeconds: number;
  maxTokensPerExecution: number;
  promptInjectionDefenseActive: boolean;
  requiresHumanApprovalForProductionMutation: boolean;
}

// ==============================================================================
// 9. SECRETS & CREDENTIAL AUDIT
// ==============================================================================

export interface CredentialAuditItem {
  credentialName: string;
  purpose: string;
  storageMechanism: 'Cloudflare-Worker-Secret' | 'GitHub-Encrypted-Secret' | 'Environment-Variable';
  isExposedInClientBundle: boolean;
  rotationIntervalDays: number;
  lastRotatedDaysAgo: number;
  status: 'SECURE' | 'ROTATION_DUE' | 'EXPOSED_RISK';
}

// ==============================================================================
// 10. BACKUP & DISASTER RECOVERY
// ==============================================================================

export type DisasterRecoveryScenarioId =
  | 'database-corruption'
  | 'accidental-deletion'
  | 'failed-deployment'
  | 'compromised-credentials'
  | 'third-party-api-outage'
  | 'search-index-corruption'
  | 'cloudflare-service-disruption'
  | 'background-job-failure'
  | 'broken-production-config';

export interface BackupRecord {
  id: string;
  targetComponent: string;
  backupType: 'FULL' | 'INCREMENTAL' | 'SNAPSHOT';
  storageLocation: string;
  checksumSha256: string;
  byteSize: number;
  retentionDays: number;
  status: 'PENDING' | 'COMPLETED' | 'VERIFIED' | 'FAILED' | 'EXPIRED';
  createdAt: string;
  expiresAt: string;
}

export interface DisasterRecoveryRunbook {
  scenarioId: DisasterRecoveryScenarioId;
  title: string;
  severity: 'P1-CRITICAL' | 'P2-HIGH' | 'P3-MEDIUM';
  rtoMinutes: number; // Recovery Time Objective
  rpoMinutes: number; // Recovery Point Objective
  ownerRole: string;
  prerequisites: string[];
  executionSteps: string[];
  validationChecklist: string[];
  communicationTemplate: string;
}

// ==============================================================================
// 11. SAFE DEPLOYMENT & ROLLBACK PIPELINE
// ==============================================================================

export interface PipelineStageCheck {
  stageNumber: number;
  stageName: string;
  passed: boolean;
  outputDetails: string;
  durationMs: number;
}

export interface DeploymentRecord {
  id: string;
  commitSha: string;
  environment: 'production' | 'staging' | 'preview';
  branch: string;
  migrationVersion: number;
  buildDurationMs: number;
  status: 'PENDING' | 'VALIDATED' | 'DEPLOYED' | 'ROLLED_BACK' | 'FAILED';
  deployedBy: string;
  verifiedAt: string;
  createdAt: string;
}

export interface RollbackPlan {
  targetDeploymentId: string;
  targetCommitSha: string;
  currentMigrationVersion: number;
  targetMigrationVersion: number;
  isMigrationSafeToRollback: boolean;
  rollbackAction: 'SAFE_APPLICATION_ROLLBACK' | 'BLOCKED_REQUIRES_MANUAL_MIGRATION' | 'UNSUPPORTED';
  stepByStepGuide: string[];
}

// ==============================================================================
// 12. OBSERVABILITY, INCIDENTS & ALERTING
// ==============================================================================

export type IncidentSeverity = 'P1-CRITICAL' | 'P2-HIGH' | 'P3-MEDIUM' | 'P4-LOW';
export type IncidentStatus = 'DETECTED' | 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED' | 'POST_MORTEM';

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  category: 'DATABASE' | 'EDGE_CDN' | 'AUTH' | 'SEARCH' | 'BACKGROUND_JOBS' | 'DEPLOYMENT' | 'SECURITY' | 'THIRD_PARTY';
  status: IncidentStatus;
  impactSummary: string;
  detectedAt: string;
  mitigatedAt?: string;
  resolvedAt?: string;
  rootCause?: string;
  actionItems: string[];
}

export interface OperationalAlert {
  id: string;
  fingerprint: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  summary: string;
  sourceComponent: string;
  status: 'FIRING' | 'ACKNOWLEDGED' | 'RESOLVED' | 'SUPPRESSED';
  firstSeenAt: string;
  lastSeenAt: string;
  occurrences: number;
}

// ==============================================================================
// 13. CAPACITY & LOAD BENCHMARK
// ==============================================================================

export interface LoadBenchmarkResult {
  scenarioName: string;
  virtualUsers: number;
  durationSeconds: number;
  totalRequests: number;
  requestsPerSecond: number;
  latencyP50Ms: number;
  latencyP95Ms: number;
  latencyP99Ms: number;
  errorRatePercent: number;
  bottleneckDetected: string | null;
  testedAt: string;
}

// ==============================================================================
// ZOD VALIDATION SCHEMAS
// ==============================================================================

export const CreateIncidentSchema = z.object({
  title: z.string().min(5),
  severity: z.enum(['P1-CRITICAL', 'P2-HIGH', 'P3-MEDIUM', 'P4-LOW']),
  category: z.enum(['DATABASE', 'EDGE_CDN', 'AUTH', 'SEARCH', 'BACKGROUND_JOBS', 'DEPLOYMENT', 'SECURITY', 'THIRD_PARTY']),
  impactSummary: z.string().min(10),
  actionItems: z.array(z.string()).default([]),
});

export const RegisterJobSchema = z.object({
  jobType: z.enum([
    'tech-discovery',
    'github-research',
    'software-verification',
    'content-freshness',
    'search-indexing',
    'seo-monitoring',
    'newsletter-distribution',
    'analytics-aggregation',
  ]),
  idempotencyKey: z.string().min(8),
  payload: z.record(z.any()),
  maxRetries: z.number().int().min(1).max(5).default(3),
  timeoutMs: z.number().int().min(1000).max(60000).default(15000),
});

export const CreateBackupSchema = z.object({
  targetComponent: z.string().min(3),
  backupType: z.enum(['FULL', 'INCREMENTAL', 'SNAPSHOT']).default('SNAPSHOT'),
  storageLocation: z.string().min(3),
  byteSize: z.number().int().positive(),
  retentionDays: z.number().int().min(1).max(365).default(30),
});
