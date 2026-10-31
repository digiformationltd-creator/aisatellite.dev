/**
 * AI Satellite — Developer Project Workspaces (Phase 12)
 * Manages developer projects, status lifecycles, associated tools, prompts, and research notes.
 */

import crypto from 'node:crypto';
import { workspaceDatabase } from './database';
import { authorizationGuard } from './authorization';
import type { DeveloperProject, ProjectStatus } from './types';
import { CreateProjectSchema } from './types';

export class ProjectManager {
  /**
   * Creates a private developer project workspace.
   */
  public createProject(
    userId: string,
    input: {
      name: string;
      description: string;
      techStack?: string[];
      status?: ProjectStatus;
      externalRepoUrl?: string;
      researchNotes?: string;
    }
  ): { success: boolean; project?: DeveloperProject; error?: string } {
    const validated = CreateProjectSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || 'Invalid project inputs.' };
    }

    const now = new Date().toISOString();
    const project: DeveloperProject = {
      id: `prj-${crypto.randomBytes(6).toString('hex')}`,
      userId,
      name: input.name.trim(),
      description: input.description.trim(),
      techStack: input.techStack || ['TypeScript', 'React'],
      status: input.status || 'planning',
      relatedToolIds: [],
      savedPromptIds: [],
      codeSnippetIds: [],
      tutorialIds: [],
      externalRepoUrl: input.externalRepoUrl || undefined,
      researchNotes: input.researchNotes || '',
      createdAt: now,
      updatedAt: now,
    };

    workspaceDatabase.insertProject(project);
    return { success: true, project };
  }

  /**
   * Updates an existing project.
   */
  public updateProject(
    userId: string,
    projectId: string,
    updates: Partial<Omit<DeveloperProject, 'id' | 'userId' | 'createdAt'>>
  ): { success: boolean; project?: DeveloperProject; error?: string } {
    const existing = workspaceDatabase.findProjectById(projectId);
    const auth = authorizationGuard.canMutate(userId, existing);
    if (!auth.allowed || !existing) {
      return { success: false, error: auth.error || 'Project not found.' };
    }

    if (updates.name) existing.name = updates.name.trim();
    if (updates.description) existing.description = updates.description.trim();
    if (updates.techStack) existing.techStack = updates.techStack;
    if (updates.status) existing.status = updates.status;
    if (updates.relatedToolIds) existing.relatedToolIds = updates.relatedToolIds;
    if (updates.savedPromptIds) existing.savedPromptIds = updates.savedPromptIds;
    if (updates.codeSnippetIds) existing.codeSnippetIds = updates.codeSnippetIds;
    if (updates.tutorialIds) existing.tutorialIds = updates.tutorialIds;
    if (updates.externalRepoUrl !== undefined) existing.externalRepoUrl = updates.externalRepoUrl;
    if (updates.researchNotes !== undefined) existing.researchNotes = updates.researchNotes;

    existing.updatedAt = new Date().toISOString();
    workspaceDatabase.updateProject(existing);

    return { success: true, project: existing };
  }

  /**
   * Deletes a project.
   */
  public deleteProject(userId: string, projectId: string): boolean {
    const existing = workspaceDatabase.findProjectById(projectId);
    const auth = authorizationGuard.canMutate(userId, existing);
    if (!auth.allowed) return false;
    return workspaceDatabase.deleteProject(userId, projectId);
  }

  /**
   * Retrieves all projects for a user.
   */
  public getUserProjects(userId: string): DeveloperProject[] {
    return workspaceDatabase.getProjects(userId);
  }

  /**
   * Retrieves a single project.
   */
  public getProject(userId: string, projectId: string): DeveloperProject | undefined {
    const project = workspaceDatabase.findProjectById(projectId);
    const auth = authorizationGuard.canAccess(userId, project);
    if (!auth.allowed) return undefined;
    return project;
  }
}

export const projectManager = new ProjectManager();
