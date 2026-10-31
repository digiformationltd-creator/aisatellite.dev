import { z } from 'zod';

// ==========================================
// 1. Factory Project Status & Types
// ==========================================

export const FactoryProjectStatusSchema = z.enum([
  'idea',
  'proposal',
  'awaiting_approval',
  'approved',
  'planning',
  'developing',
  'testing',
  'security_review',
  'release_candidate',
  'release_approval',
  'published',
  'paused',
  'failed',
]);

export type FactoryProjectStatus = z.infer<typeof FactoryProjectStatusSchema>;

export const FactoryProjectTypeSchema = z.enum([
  'web',
  'desktop',
  'cli',
  'mcp',
  'automation',
  'library',
]);

export type FactoryProjectType = z.infer<typeof FactoryProjectTypeSchema>;

export const BudgetConfigSchema = z.object({
  maxIterations: z.number().int().min(1).default(25),
  maxTokens: z.number().int().min(1000).default(500000),
  maxBuildMinutes: z.number().int().min(1).default(15),
  maxRetries: z.number().int().min(0).default(3),
  consumedTokens: z.number().int().default(0),
  consumedIterations: z.number().int().default(0),
});

export type BudgetConfig = z.infer<typeof BudgetConfigSchema>;

export const FactoryProjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  projectType: FactoryProjectTypeSchema,
  status: FactoryProjectStatusSchema.default('idea'),
  license: z.string().default('MIT'),
  repositoryUrl: z.string().url().optional(),
  targetPlatforms: z.array(z.string()).default(['universal']),
  approvedBy: z.string().optional(),
  approvedAt: z.string().optional(),
  rejectionReason: z.string().optional(),
  budgetConfig: BudgetConfigSchema.default({}),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
});

export type FactoryProject = z.infer<typeof FactoryProjectSchema>;
export type FactoryProjectInput = z.input<typeof FactoryProjectSchema>;

// ==========================================
// 2. Agent Task Schema
// ==========================================

export const AgentTaskStatusSchema = z.enum([
  'pending',
  'running',
  'completed',
  'failed',
  'cancelled',
]);

export type AgentTaskStatus = z.infer<typeof AgentTaskStatusSchema>;

export const AgentTaskSchema = z.object({
  taskId: z.string().min(1),
  projectId: z.string().min(1),
  assignedAgent: z.string().min(1),
  objective: z.string().min(1),
  inputReferences: z.array(z.string()).default([]),
  outputRequirements: z.array(z.string()).default([]),
  allowedTools: z.array(z.string()).default([]),
  budget: z.object({
    maxTokens: z.number().default(50000),
    timeoutSeconds: z.number().default(120),
    maxRetries: z.number().default(3),
  }).default({}),
  timeout: z.number().default(120),
  retryCount: z.number().default(0),
  status: AgentTaskStatusSchema.default('pending'),
  evidence: z.array(z.string()).default([]),
  result: z.record(z.unknown()).optional(),
  errorMessage: z.string().optional(),
  createdAt: z.string().default(() => new Date().toISOString()),
  completedAt: z.string().optional(),
});

export type AgentTask = z.infer<typeof AgentTaskSchema>;

// ==========================================
// 3. Product Opportunity & Proposal Schema
// ==========================================

export const OpportunityScoreSchema = z.object({
  usefulness: z.number().min(0).max(100),    // Weight: 30%
  feasibility: z.number().min(0).max(100),   // Weight: 20%
  ecosystemGap: z.number().min(0).max(100),  // Weight: 20%
  sustainability: z.number().min(0).max(100),// Weight: 15%
  distribution: z.number().min(0).max(100),  // Weight: 10%
  originality: z.number().min(0).max(100),   // Weight: 5%
  weightedTotal: z.number().min(0).max(100),
});

export type OpportunityScore = z.infer<typeof OpportunityScoreSchema>;

export const ProductProposalSchema = z.object({
  proposalId: z.string().min(1),
  projectId: z.string().min(1),
  name: z.string().min(1),
  problemStatement: z.string().min(10),
  targetUsers: z.array(z.string()).min(1),
  existingAlternatives: z.array(z.string()).default([]),
  proposedDifferentiation: z.string().min(10),
  mvpFeatures: z.array(z.string()).min(1),
  excludedFeatures: z.array(z.string()).default([]),
  suggestedStack: z.array(z.string()).min(1),
  securityConsiderations: z.array(z.string()).default([]),
  licenseRecommendation: z.string().default('MIT'),
  estimatedComplexity: z.enum(['low', 'medium', 'high']).default('medium'),
  evidenceReferences: z.array(z.string()).default([]),
  scores: OpportunityScoreSchema,
  status: z.enum(['draft', 'pending_review', 'approved', 'rejected']).default('draft'),
  createdAt: z.string().default(() => new Date().toISOString()),
});

export type ProductProposal = z.infer<typeof ProductProposalSchema>;

// ==========================================
// 4. Product Requirements Document (PRD) Schema
// ==========================================

export const PRDSchema = z.object({
  prdId: z.string().min(1),
  projectId: z.string().min(1),
  version: z.string().default('1.0.0'),
  executiveSummary: z.string().min(10),
  problemDefinition: z.string().min(10),
  targetUsers: z.array(z.string()).min(1),
  userStories: z.array(z.string()).min(1),
  coreFeatures: z.array(z.string()).min(1),
  nonGoals: z.array(z.string()).default([]),
  technicalRequirements: z.array(z.string()).min(1),
  securityRequirements: z.array(z.string()).default([]),
  privacyRequirements: z.array(z.string()).default([]),
  accessibilityRequirements: z.array(z.string()).default([]),
  performanceRequirements: z.array(z.string()).default([]),
  acceptanceTests: z.array(z.string()).min(1),
  releaseCriteria: z.array(z.string()).min(1),
  knownRisks: z.array(z.string()).default([]),
  futureRoadmap: z.array(z.string()).default([]),
  approved: z.boolean().default(false),
  approvedBy: z.string().optional(),
  approvedAt: z.string().optional(),
  createdAt: z.string().default(() => new Date().toISOString()),
});

export type ProductRequirementDocument = z.infer<typeof PRDSchema>;

// ==========================================
// 5. Architecture & Implementation Plan Schema
// ==========================================

export const ImplementationTaskItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  targetFiles: z.array(z.string()).default([]),
  dependencies: z.array(z.string()).default([]),
  estimatedHours: z.number().default(1),
  completed: z.boolean().default(false),
});

export type ImplementationTaskItem = z.infer<typeof ImplementationTaskItemSchema>;

export const ArchitecturePlanSchema = z.object({
  planId: z.string().min(1),
  projectId: z.string().min(1),
  selectedStack: z.object({
    language: z.string(),
    framework: z.string(),
    tooling: z.array(z.string()).default([]),
    packageManager: z.string().default('npm'),
  }),
  moduleDiagram: z.string(),
  directoryStructure: z.array(z.string()),
  apiContracts: z.array(z.string()).default([]),
  dataModels: z.array(z.string()).default([]),
  securityBoundaries: z.array(z.string()).default([]),
  implementationTasks: z.array(ImplementationTaskItemSchema).min(1),
  createdAt: z.string().default(() => new Date().toISOString()),
});

export type ArchitecturePlan = z.infer<typeof ArchitecturePlanSchema>;

// ==========================================
// 6. Build Run Schema
// ==========================================

export const BuildArtifactSchema = z.object({
  filename: z.string(),
  path: z.string(),
  size: z.number(),
  sha256: z.string(),
});

export type BuildArtifact = z.infer<typeof BuildArtifactSchema>;

export const BuildRunSchema = z.object({
  buildId: z.string().min(1),
  projectId: z.string().min(1),
  commitSha: z.string().default('HEAD'),
  status: z.enum(['pending', 'running', 'success', 'failed']),
  logs: z.array(z.string()).default([]),
  durationMs: z.number().default(0),
  artifacts: z.array(BuildArtifactSchema).default([]),
  exitCode: z.number().default(0),
  createdAt: z.string().default(() => new Date().toISOString()),
});

export type BuildRun = z.infer<typeof BuildRunSchema>;

// ==========================================
// 7. Test Report Schema
// ==========================================

export const TestSuiteResultSchema = z.object({
  name: z.string(),
  status: z.enum(['passed', 'failed']),
  durationMs: z.number().default(0),
  errorDetails: z.string().optional(),
});

export type TestSuiteResult = z.infer<typeof TestSuiteResultSchema>;

export const TestReportSchema = z.object({
  testId: z.string().min(1),
  projectId: z.string().min(1),
  status: z.enum(['passed', 'failed', 'error']),
  totalTests: z.number().default(0),
  passed: z.number().default(0),
  failed: z.number().default(0),
  skipped: z.number().default(0),
  durationMs: z.number().default(0),
  coveragePercent: z.number().optional(),
  testSuites: z.array(TestSuiteResultSchema).default([]),
  logs: z.array(z.string()).default([]),
  createdAt: z.string().default(() => new Date().toISOString()),
});

export type TestReport = z.infer<typeof TestReportSchema>;

// ==========================================
// 8. Security & Licensing Report Schema
// ==========================================

export const SecurityFindingSchema = z.object({
  file: z.string(),
  line: z.number(),
  rule: z.string(),
  snippet: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
});

export type SecurityFinding = z.infer<typeof SecurityFindingSchema>;

export const DependencyFindingSchema = z.object({
  package: z.string(),
  version: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string(),
  advisoryUrl: z.string().optional(),
});

export type DependencyFinding = z.infer<typeof DependencyFindingSchema>;

export const SecurityReportSchema = z.object({
  reportId: z.string().min(1),
  projectId: z.string().min(1),
  cveFindings: z.array(DependencyFindingSchema).default([]),
  secretFindings: z.array(SecurityFindingSchema).default([]),
  licenseCheck: z.object({
    valid: z.boolean(),
    license: z.string(),
    compatible: z.boolean(),
    issues: z.array(z.string()).default([]),
  }),
  overallRiskScore: z.number().min(0).max(100).default(0),
  isBlocked: z.boolean().default(false),
  notes: z.array(z.string()).default([]),
  createdAt: z.string().default(() => new Date().toISOString()),
});

export type SecurityReport = z.infer<typeof SecurityReportSchema>;

// ==========================================
// 9. Release Candidate Schema
// ==========================================

export const ReleaseAssetSchema = z.object({
  platform: z.string(),
  filename: z.string(),
  url: z.string(),
  sizeBytes: z.number(),
  sha256: z.string().regex(/^[a-fA-F0-9]{64}$/, 'Must be a 64-character SHA-256 hash'),
});

export type ReleaseAsset = z.infer<typeof ReleaseAssetSchema>;

export const ReleaseCandidateSchema = z.object({
  releaseId: z.string().min(1),
  projectId: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+/, 'Must be valid SemVer'),
  gitTag: z.string(),
  changelog: z.string().min(10),
  artifacts: z.array(ReleaseAssetSchema).min(1),
  status: z.enum(['draft', 'awaiting_approval', 'approved', 'rejected', 'published']).default('draft'),
  approvalRecord: z.object({
    approvedBy: z.string(),
    approvedAt: z.string(),
    comments: z.string().optional(),
  }).optional(),
  publishedAt: z.string().optional(),
  createdAt: z.string().default(() => new Date().toISOString()),
});

export type ReleaseCandidate = z.infer<typeof ReleaseCandidateSchema>;

// ==========================================
// 10. Audit Log Schema
// ==========================================

export const AuditLogSchema = z.object({
  logId: z.string().min(1),
  timestamp: z.string().default(() => new Date().toISOString()),
  actor: z.string().min(1),
  action: z.string().min(1),
  projectId: z.string().optional(),
  details: z.record(z.unknown()).default({}),
  signature: z.string().default(''),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;

// ==========================================
// 11. Maintenance Queue Item Schema
// ==========================================

export const MaintenanceTaskSchema = z.object({
  maintenanceId: z.string().min(1),
  projectId: z.string().min(1),
  type: z.enum(['dependency_update', 'security_patch', 'broken_link', 'bug_fix']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string(),
  description: z.string(),
  status: z.enum(['detected', 'patch_prepared', 'testing', 'awaiting_review', 'resolved', 'dismissed']).default('detected'),
  pullRequestUrl: z.string().url().optional(),
  createdAt: z.string().default(() => new Date().toISOString()),
  resolvedAt: z.string().optional(),
});

export type MaintenanceTask = z.infer<typeof MaintenanceTaskSchema>;
