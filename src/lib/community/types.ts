/**
 * AI Satellite — Phase 13 Global Developer Community & Collaboration Ecosystem
 * Core Types, Enums, Interfaces, and Zod Validation Schemas
 * Permanent Canonical Domain: https://aisatellite.dev
 */

import { z } from 'zod';

// --- Categories & Enums ---

export type DiscussionCategory =
  | 'ai_development'
  | 'open_source'
  | 'free_alternatives'
  | 'frontend'
  | 'backend'
  | 'cloud_infrastructure'
  | 'ai_agents'
  | 'mcp_servers'
  | 'automation'
  | 'css_ui'
  | 'threejs_webgl'
  | 'troubleshooting';

export const DISCUSSION_CATEGORIES: { id: DiscussionCategory; label: string; description: string }[] = [
  { id: 'ai_development', label: 'AI Development', description: 'LLMs, local model execution, prompts, and embeddings' },
  { id: 'open_source', label: 'Open-Source Software', description: 'Self-hosted tools, frameworks, and OS ecosystems' },
  { id: 'free_alternatives', label: 'Free Alternatives', description: 'Evaluating, testing, and replacing expensive SaaS' },
  { id: 'frontend', label: 'Frontend Development', description: 'React, Astro, Vue, Next.js, and client architectures' },
  { id: 'backend', label: 'Backend Development', description: 'Node.js, Go, Python, distributed systems, and APIs' },
  { id: 'cloud_infrastructure', label: 'Cloud Infrastructure', description: 'Cloudflare Pages, Workers, D1, Docker, and edge computing' },
  { id: 'ai_agents', label: 'AI Agents', description: 'Autonomous agent design, multi-agent swarms, and tool calling' },
  { id: 'mcp_servers', label: 'MCP Servers', description: 'Model Context Protocol server implementations and extensions' },
  { id: 'automation', label: 'Automation', description: 'CI/CD, GitHub Actions, workflows, and developer scripts' },
  { id: 'css_ui', label: 'CSS & UI Engineering', description: 'Tailwind CSS, design systems, glassmorphism, and responsive layouts' },
  { id: 'threejs_webgl', label: 'Three.js & WebGL', description: '3D graphics, shaders, particle systems, and canvas performance' },
  { id: 'troubleshooting', label: 'Developer Troubleshooting', description: 'Debugging obscure errors, stack traces, and environment fixes' },
];

export type SubmissionCategory =
  | 'free_alternative'
  | 'open_source_tool'
  | 'ai_tool'
  | 'mcp_server'
  | 'free_api'
  | 'ai_prompt'
  | 'coding_tutorial'
  | 'css_component'
  | 'threejs_example'
  | 'automation_workflow';

export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested';

export type ReportReason = 'spam' | 'abuse' | 'misinformation' | 'license_violation' | 'duplicate' | 'other';

export type ReportStatus = 'open' | 'investigating' | 'resolved' | 'dismissed';

export type CollectionRole = 'owner' | 'editor' | 'viewer';

export type ReputationEventType =
  | 'approved_resource'
  | 'verified_alternative'
  | 'published_tutorial'
  | 'accepted_answer'
  | 'helpful_answer_upvote'
  | 'accepted_correction'
  | 'approved_code_example'
  | 'curated_collection'
  | 'moderation_deduction';

export type CommunityBadge =
  | 'early_contributor'
  | 'open_source_champion'
  | 'troubleshooter'
  | 'verified_curator'
  | 'prompt_architect'
  | 'code_steward';

// Recognized OSI and Permissive Open Source Licenses
export const RECOGNIZED_OPEN_SOURCE_LICENSES = [
  'MIT',
  'Apache-2.0',
  'GPL-3.0',
  'GPL-2.0',
  'AGPL-3.0',
  'LGPL-3.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'MPL-2.0',
  'ISC',
  'Unlicense',
  'CC0-1.0',
  'EPL-2.0',
];

// Reserved Usernames to prevent impersonation
export const RESERVED_USERNAMES = new Set([
  'admin',
  'administrator',
  'system',
  'aisatellite',
  'satellite',
  'mod',
  'moderator',
  'root',
  'help',
  'security',
  'staff',
  'official',
  'support',
  'api',
  'bot',
  'null',
  'undefined',
  'workspace',
  'community',
  'about',
  'terms',
  'privacy',
  'search',
]);

// --- Core Community Entities ---

export interface PublicProfile {
  userId: string;
  username: string; // alphanumeric lowercase, hyphens allowed, 3-24 chars
  displayName: string;
  bio?: string;
  technicalInterests: string[];
  publicWebsite?: string;
  githubUsername?: string;
  isPublicProfile: boolean; // Opt-in strictly enforced
  reputationScore: number;
  badges: CommunityBadge[];
  createdAt: string;
  updatedAt: string;
}

export interface GitHubConnection {
  userId: string;
  githubUserId: string;
  githubUsername: string;
  profileUrl: string;
  avatarUrl: string;
  publicRepoCount: number;
  linkedRepoUrls: string[];
  connectedAt: string;
  lastSyncedAt: string;
}

export interface CommunityDiscussion {
  id: string;
  authorId: string;
  authorUsername: string;
  category: DiscussionCategory;
  title: string;
  content: string;
  tags: string[];
  replyCount: number;
  isResolved: boolean;
  isLocked: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionReply {
  id: string;
  discussionId: string;
  authorId: string;
  authorUsername: string;
  content: string;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityQuestion {
  id: string;
  authorId: string;
  authorUsername: string;
  title: string;
  technicalContext: string;
  codeSnippet?: string;
  tags: string[];
  acceptedAnswerId?: string;
  isAnswered: boolean;
  answerCount: number;
  relatedDocUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestionAnswer {
  id: string;
  questionId: string;
  authorId: string;
  authorUsername: string;
  content: string;
  codeExample?: string;
  isAccepted: boolean;
  isOutdated: boolean;
  upvoteCount: number;
  upvoterUserIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectShowcase {
  id: string;
  submitterId: string;
  submitterUsername: string;
  name: string;
  description: string;
  repoUrl: string;
  maintainerAttribution: string;
  license: string;
  isLicenseVerified: boolean;
  supportedPlatforms: string[];
  docUrl: string;
  installInstructions: string;
  verifiedReleaseVersion: string;
  status: ModerationStatus;
  editorialNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceSubmission {
  id: string;
  submitterId: string;
  submitterUsername: string;
  category: SubmissionCategory;
  title: string;
  url: string;
  description: string;
  license?: string;
  replacesPaidTool?: string;
  tags: string[];
  status: ModerationStatus;
  editorialNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContributionRecord {
  id: string;
  userId: string;
  username: string;
  type: 'submission' | 'alternative' | 'tutorial' | 'correction' | 'answer' | 'example' | 'collection';
  resourceId: string;
  resourceTitle: string;
  pointsAwarded: number;
  verifiedAt: string;
  evidenceUrl?: string;
}

export interface ReputationEvent {
  id: string;
  userId: string;
  eventType: ReputationEventType;
  pointsDelta: number;
  sourceEntityId: string;
  description: string;
  isReversed: boolean;
  createdAt: string;
}

export interface CollectionMember {
  userId: string;
  username: string;
  role: CollectionRole;
  addedAt: string;
}

export interface CollaborativeCollection {
  id: string;
  ownerId: string;
  ownerUsername: string;
  title: string;
  description: string;
  isPublic: boolean;
  resourceIds: string[];
  notes: string;
  tags: string[];
  version: number;
  members: CollectionMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CommunityReport {
  id: string;
  reporterId: string;
  targetType: 'discussion' | 'reply' | 'question' | 'answer' | 'project' | 'profile';
  targetId: string;
  reason: ReportReason;
  details: string;
  status: ReportStatus;
  actionTaken?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ModerationAction {
  id: string;
  moderatorId: string;
  moderatorUsername: string;
  action:
    | 'hide'
    | 'restore'
    | 'request_changes'
    | 'remove_spam'
    | 'restrict_user'
    | 'suspend_user'
    | 'approve_submission'
    | 'reject_submission';
  targetType: string;
  targetId: string;
  reason: string;
  timestamp: string;
}

export interface ModerationAppeal {
  id: string;
  userId: string;
  moderationActionId: string;
  statement: string;
  status: 'pending' | 'accepted' | 'rejected';
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Zod Validation Schemas ---

export const CreateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(24, 'Username cannot exceed 24 characters')
    .regex(/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, hyphens, and underscores'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50),
  bio: z.string().max(280, 'Bio cannot exceed 280 characters').optional().default(''),
  technicalInterests: z.array(z.string()).default([]),
  publicWebsite: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isPublicProfile: z.boolean().default(false),
});

export const CreateDiscussionSchema = z.object({
  category: z.enum([
    'ai_development',
    'open_source',
    'free_alternatives',
    'frontend',
    'backend',
    'cloud_infrastructure',
    'ai_agents',
    'mcp_servers',
    'automation',
    'css_ui',
    'threejs_webgl',
    'troubleshooting',
  ]),
  title: z.string().min(5, 'Title must be at least 5 characters').max(150),
  content: z.string().min(20, 'Content must be at least 20 characters').max(10000),
  tags: z.array(z.string()).min(1, 'Add at least one tag').max(5),
});

export const CreateReplySchema = z.object({
  discussionId: z.string().min(1),
  content: z.string().min(3, 'Reply must be at least 3 characters').max(5000),
});

export const CreateQuestionSchema = z.object({
  title: z.string().min(10, 'Question title must be at least 10 characters').max(160),
  technicalContext: z.string().min(30, 'Technical context must be at least 30 characters').max(8000),
  codeSnippet: z.string().max(10000).optional().default(''),
  tags: z.array(z.string()).min(1).max(5),
  relatedDocUrls: z.array(z.string().url()).default([]),
});

export const CreateAnswerSchema = z.object({
  questionId: z.string().min(1),
  content: z.string().min(15, 'Answer must be at least 15 characters').max(8000),
  codeExample: z.string().max(10000).optional().default(''),
});

export const SubmitProjectSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(20).max(1000),
  repoUrl: z.string().url().regex(/^https:\/\/(github\.com|gitlab\.com|codeberg\.org)\//, 'Must be a valid GitHub, GitLab, or Codeberg repository URL'),
  maintainerAttribution: z.string().min(2).max(100),
  license: z.string().min(2),
  supportedPlatforms: z.array(z.string()).default(['Linux', 'macOS', 'Windows']),
  docUrl: z.string().url(),
  installInstructions: z.string().min(5),
  verifiedReleaseVersion: z.string().default('v1.0.0'),
});

export const SubmitResourceSchema = z.object({
  category: z.enum([
    'free_alternative',
    'open_source_tool',
    'ai_tool',
    'mcp_server',
    'free_api',
    'ai_prompt',
    'coding_tutorial',
    'css_component',
    'threejs_example',
    'automation_workflow',
  ]),
  title: z.string().min(3).max(120),
  url: z.string().url(),
  description: z.string().min(15).max(1000),
  license: z.string().optional().default(''),
  replacesPaidTool: z.string().optional().default(''),
  tags: z.array(z.string()).default([]),
});

export const CreateCollaborativeCollectionSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).default(''),
  isPublic: z.boolean().default(false),
  resourceIds: z.array(z.string()).default([]),
  notes: z.string().default(''),
  tags: z.array(z.string()).default([]),
});

export const CreateReportSchema = z.object({
  targetType: z.enum(['discussion', 'reply', 'question', 'answer', 'project', 'profile']),
  targetId: z.string().min(1),
  reason: z.enum(['spam', 'abuse', 'misinformation', 'license_violation', 'duplicate', 'other']),
  details: z.string().min(5).max(1000),
});

export const SubmitAppealSchema = z.object({
  moderationActionId: z.string().min(1),
  statement: z.string().min(20, 'Appeal statement must be at least 20 characters').max(2000),
});
