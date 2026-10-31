/**
 * AI Satellite — Workspace Data Portability & Export Service (Phase 12)
 * Packages complete user-owned workspace data into documented JSON archives for GDPR/portability compliance.
 */

import { workspaceDatabase } from './database';
import { authorizationGuard } from './authorization';

export interface WorkspaceExportPayload {
  exportMetadata: {
    origin: string;
    userId: string;
    exportTimestamp: string;
    schemaVersion: string;
  };
  preferences?: unknown;
  savedResources: unknown[];
  collections: unknown[];
  prompts: Array<{
    prompt: unknown;
    versions: unknown[];
  }>;
  codeSnippets: unknown[];
  projects: unknown[];
  learningProgress: unknown[];
  notifications: unknown[];
}

export class ExportService {
  /**
   * Generates a complete portable JSON export of all personal workspace assets.
   */
  public exportUserData(userId: string): WorkspaceExportPayload {
    const preferences = workspaceDatabase.getPreferences(userId);
    const savedResources = workspaceDatabase.getSavedResources(userId);
    const collections = workspaceDatabase.getCollections(userId);
    const prompts = workspaceDatabase.getPrompts(userId);
    const snippets = workspaceDatabase.getSnippets(userId);
    const projects = workspaceDatabase.getProjects(userId);
    const learningProgress = workspaceDatabase.getAllLearningProgress(userId);
    const notifications = workspaceDatabase.getNotifications(userId);

    const compiledPrompts = prompts.map((p) => ({
      prompt: p,
      versions: workspaceDatabase.getPromptVersions(p.id),
    }));

    return {
      exportMetadata: {
        origin: 'https://aisatellite.dev',
        userId,
        exportTimestamp: new Date().toISOString(),
        schemaVersion: '1.2.0',
      },
      preferences,
      savedResources,
      collections,
      prompts: compiledPrompts,
      codeSnippets: snippets,
      projects,
      learningProgress,
      notifications,
    };
  }

  /**
   * Generates serialized JSON string for file download.
   */
  public generateExportJson(userId: string): string {
    const data = this.exportUserData(userId);
    return JSON.stringify(data, null, 2);
  }
}

export const exportService = new ExportService();
