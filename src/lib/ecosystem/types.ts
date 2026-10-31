/**
 * AI Satellite — Phase 19 Ultimate Ecosystem Integration
 * Types, Enums, Interfaces, and Zod Validation Schemas
 * Permanent Canonical Domain: https://aisatellite.dev
 */

import { z } from 'zod';

// --- Role-Based Access Control (RBAC) ---

export type UserRole =
  | 'visitor'
  | 'registered_user'
  | 'contributor'
  | 'editor'
  | 'moderator'
  | 'administrator'
  | 'system_operator';

export type PlatformPermission =
  | 'read:public'
  | 'save:workspace'
  | 'submit:community'
  | 'review:editorial'
  | 'moderate:community'
  | 'trigger:agents'
  | 'manage:system';

export const ROLE_PERMISSIONS: Record<UserRole, PlatformPermission[]> = {
  visitor: ['read:public'],
  registered_user: ['read:public', 'save:workspace', 'submit:community'],
  contributor: ['read:public', 'save:workspace', 'submit:community'],
  editor: ['read:public', 'save:workspace', 'submit:community', 'review:editorial'],
  moderator: ['read:public', 'save:workspace', 'submit:community', 'moderate:community'],
  administrator: [
    'read:public',
    'save:workspace',
    'submit:community',
    'review:editorial',
    'moderate:community',
    'trigger:agents',
    'manage:system',
  ],
  system_operator: [
    'read:public',
    'save:workspace',
    'submit:community',
    'review:editorial',
    'moderate:community',
    'trigger:agents',
    'manage:system',
  ],
};

// --- Central Resource Identity System (CRIS) ---

export type CentralResourceType =
  | 'software_product'
  | 'open_source_project'
  | 'ai_tool'
  | 'free_alternative'
  | 'mcp_server'
  | 'free_api'
  | 'prompt'
  | 'tutorial'
  | 'lab_experiment';

export type VerificationStatus =
  | 'verified'
  | 'community_submitted'
  | 'in_review'
  | 'archived';

export type EditorialStatus =
  | 'draft'
  | 'researching'
  | 'verification_required'
  | 'ready_for_review'
  | 'changes_requested'
  | 'approved'
  | 'published'
  | 'archived';

export interface CentralResource {
  id: string; // e.g. "res_signoz" or "res_podman"
  slug: string; // canonical URL slug
  name: string;
  type: CentralResourceType;
  officialUrl: string;
  repositoryUrl?: string;
  license?: string;
  pricing?: string;
  capabilities: string[];
  categories: string[];
  verificationStatus: VerificationStatus;
  editorialStatus: EditorialStatus;
  verifiedAt: string;
  lastReviewedAt: string;
  metadata: Record<string, any>;
}

export const RegisterCentralResourceSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2),
  name: z.string().min(1),
  type: z.enum([
    'software_product',
    'open_source_project',
    'ai_tool',
    'free_alternative',
    'mcp_server',
    'free_api',
    'prompt',
    'tutorial',
    'lab_experiment',
  ]),
  officialUrl: z.string().url(),
  repositoryUrl: z.string().url().optional(),
  license: z.string().optional(),
  pricing: z.string().optional(),
  capabilities: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  verificationStatus: z.enum(['verified', 'community_submitted', 'in_review', 'archived']).default('in_review'),
  editorialStatus: z.enum([
    'draft',
    'researching',
    'verification_required',
    'ready_for_review',
    'changes_requested',
    'approved',
    'published',
    'archived',
  ]).default('draft'),
  metadata: z.record(z.any()).default({}),
});

// --- Unified Knowledge Graph ---

export type KnowledgeRelationship =
  | 'replaces'
  | 'alternative_to'
  | 'implements_capability'
  | 'licensed_under'
  | 'has_repository'
  | 'referenced_in_tutorial'
  | 'powered_by_prompt'
  | 'discussed_in_community'
  | 'saved_to_workspace';

export interface UnifiedKnowledgeGraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relationship: KnowledgeRelationship;
  confidence: number;
  verified: boolean;
  evidenceId?: string;
  createdAt: string;
}

// --- Platform Event Bus ---

export type PlatformEventType =
  | 'ResourceVerified'
  | 'ResourceUpdated'
  | 'AlternativeApproved'
  | 'TutorialPublished'
  | 'CommunitySubmissionApproved'
  | 'PromptSaved'
  | 'CollectionShared'
  | 'ResearchJobFailed'
  | 'DeploymentCompleted'
  | 'SearchIndexRefreshRequested';

export interface PlatformEvent<T = Record<string, any>> {
  id: string;
  eventType: PlatformEventType;
  payload: T;
  timestamp: string;
  emitter: string;
  traceId: string;
}

// --- Unified Notifications ---

export type NotificationCategory =
  | 'workspace'
  | 'community'
  | 'editorial'
  | 'security'
  | 'operations';

export interface UnifiedNotification {
  id: string;
  userId: string;
  category: NotificationCategory;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// --- Unified Analytics ---

export type UnifiedAnalyticsEventType =
  | 'ResourceViewed'
  | 'AlternativeCompared'
  | 'RepositoryOpened'
  | 'PromptSaved'
  | 'TutorialCompleted'
  | 'SearchPerformed'
  | 'WorkspaceCreated'
  | 'CommunityContributionApproved'
  | 'NewsletterSubscribed';

export interface UnifiedAnalyticsEvent {
  id: string;
  eventType: UnifiedAnalyticsEventType;
  resourceId?: string;
  properties: Record<string, any>;
  timestamp: string;
  anonymizedSessionId: string;
}

// --- Multi-Agent Orchestration ---

export type AgentCategory =
  | 'DiscoveryAgent'
  | 'GitHubResearchAgent'
  | 'VerificationAgent'
  | 'AlternativesAnalyst'
  | 'ContentResearchAgent'
  | 'TechnicalSEOAgent'
  | 'AEOGEOAgent'
  | 'QAAgent'
  | 'SecurityReviewAgent'
  | 'OperationsAgent';

export interface AgentExecutionRequest {
  agent: AgentCategory;
  task: string;
  parameters?: Record<string, any>;
  timeoutMs?: number;
  maxTokens?: number;
  dryRun?: boolean;
}

export interface AgentExecutionResult {
  executionId: string;
  agent: AgentCategory;
  status: 'success' | 'failed' | 'requires_human_approval';
  output: any;
  findings: string[];
  costEstimateUsd: number;
  durationMs: number;
  timestamp: string;
  error?: string;
}

// --- Unified Automation Scheduler ---

export interface ScheduledJobConfig {
  id: string;
  name: string;
  category: string;
  cronIntervalMinutes: number;
  lastRun?: string;
  nextRun: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  retryCount: number;
  maxRetries: number;
  idempotencyKey?: string;
}

// --- Standardized API Response ---

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    traceId: string;
    page?: number;
    total?: number;
  };
}

// --- System Health Telemetry ---

export interface SystemHealthStatus {
  publicAvailability: number;
  apiStatus: 'healthy' | 'degraded' | 'down';
  databaseStatus: 'healthy' | 'degraded' | 'down';
  searchStatus: 'healthy' | 'degraded' | 'down';
  activeAgents: number;
  queuedJobs: number;
  pendingEditorial: number;
  pendingModeration: number;
  lastBackupTime: string;
  securityAlertsCount: number;
}
