/**
 * AI Satellite — Phase 12 Intelligent Personal Workspace & Developer Productivity Ecosystem
 * Types, interfaces, and Zod schemas for user authentication, private workspace entities,
 * prompt versioning, code snippets, project workspaces, and data portability.
 */

import { z } from 'zod';

export type UserRole = 'user' | 'contributor' | 'maintainer' | 'admin';

export type ProjectStatus = 'planning' | 'active' | 'paused' | 'completed' | 'archived';

export type NotificationType =
  | 'price_change'
  | 'license_update'
  | 'security_alert'
  | 'learning_reminder'
  | 'availability_change';

// --- User & Authentication Entities ---

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  salt: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  token: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface UserPreferences {
  userId: string;
  interests: string[];
  defaultStack: string;
  telemetryEnabled: boolean;
  personalizationEnabled: boolean;
  notificationPreferences: {
    priceAlerts: boolean;
    licenseAlerts: boolean;
    securityAlerts: boolean;
    learningReminders: boolean;
    availabilityAlerts: boolean;
  };
  theme: 'dark' | 'cosmic' | 'minimal';
  updatedAt: string;
}

// --- Workspace Resource Entities ---

export interface SavedResource {
  id: string;
  userId: string;
  resourceId: string;
  resourceCategory: string;
  title: string;
  originalUrl: string;
  notes: string;
  tags: string[];
  collectionId?: string;
  savedAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  description: string;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PromptVersion {
  id: string;
  promptId: string;
  version: number;
  content: string;
  changeSummary: string;
  timestamp: string;
  ownerId: string;
}

export interface PersonalPrompt {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  templateText: string;
  variables: Array<{ name: string; label: string; defaultValue: string }>;
  currentVersion: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CodeSnippet {
  id: string;
  userId: string;
  title: string;
  description: string;
  language: string;
  code: string;
  tags: string[];
  collectionId?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeveloperProject {
  id: string;
  userId: string;
  name: string;
  description: string;
  techStack: string[];
  status: ProjectStatus;
  relatedToolIds: string[];
  savedPromptIds: string[];
  codeSnippetIds: string[];
  tutorialIds: string[];
  externalRepoUrl?: string;
  researchNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningProgress {
  id: string;
  userId: string;
  pathId: string;
  completedLessonIds: string[];
  bookmarkedLessonIds: string[];
  currentStep: number;
  lastActiveAt: string;
  percentComplete: number;
}

export interface ResearchCollection {
  id: string;
  userId: string;
  title: string;
  description: string;
  resourceIds: string[];
  notes: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowTemplate {
  id: string;
  title: string;
  category: string;
  purpose: string;
  requiredInputs: string[];
  steps: Array<{ stepNumber: number; title: string; action: string; toolRecommendation?: string }>;
  expectedOutputs: string[];
  limitations: string[];
  isCustom: boolean;
  userId?: string;
}

export interface WorkspaceNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  resourceId?: string;
  read: boolean;
  createdAt: string;
}

export interface WorkspaceAuditEvent {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  timestamp: string;
  ipAddress?: string;
  details?: Record<string, unknown>;
}

// --- Zod Validation Schemas ---

export const RegisterUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').default('Developer'),
});

export const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

export const CreatePromptSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  category: z.string().default('General'),
  templateText: z.string().min(10),
  variables: z.array(z.object({
    name: z.string(),
    label: z.string(),
    defaultValue: z.string(),
  })).default([]),
  isPublic: z.boolean().default(false),
});

export const CreateSnippetSchema = z.object({
  title: z.string().min(2),
  description: z.string().default(''),
  language: z.enum(['javascript', 'typescript', 'python', 'html', 'css', 'sql', 'bash', 'json']),
  code: z.string().min(1),
  tags: z.array(z.string()).default([]),
  collectionId: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export const CreateProjectSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
  techStack: z.array(z.string()).default(['TypeScript', 'React']),
  status: z.enum(['planning', 'active', 'paused', 'completed', 'archived']).default('planning'),
  externalRepoUrl: z.string().url().optional().or(z.literal('')),
  researchNotes: z.string().default(''),
});
