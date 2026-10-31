/**
 * AI Satellite — Personal Prompt Library & Versioning Vault (Phase 12)
 * Manages user-created prompts, variables, immutable version history, and export capabilities.
 */

import crypto from 'node:crypto';
import { workspaceDatabase } from './database';
import { authorizationGuard } from './authorization';
import type { PersonalPrompt, PromptVersion } from './types';
import { CreatePromptSchema } from './types';

export class PromptVault {
  /**
   * Creates a private prompt and records its initial Version 1.
   */
  public createPrompt(
    userId: string,
    input: {
      title: string;
      description: string;
      category?: string;
      templateText: string;
      variables?: Array<{ name: string; label: string; defaultValue: string }>;
      isPublic?: boolean;
    }
  ): { success: boolean; prompt?: PersonalPrompt; error?: string } {
    const validated = CreatePromptSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || 'Invalid prompt data' };
    }

    const now = new Date().toISOString();
    const promptId = `pmt-${crypto.randomBytes(6).toString('hex')}`;

    const prompt: PersonalPrompt = {
      id: promptId,
      userId,
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category?.trim() || 'General',
      templateText: input.templateText.trim(),
      variables: input.variables || [],
      currentVersion: 1,
      isPublic: input.isPublic || false,
      createdAt: now,
      updatedAt: now,
    };

    workspaceDatabase.insertPrompt(prompt);

    // Record Version 1 in history
    const initialVersion: PromptVersion = {
      id: `ver-${crypto.randomBytes(6).toString('hex')}`,
      promptId,
      version: 1,
      content: prompt.templateText,
      changeSummary: 'Initial creation',
      timestamp: now,
      ownerId: userId,
    };

    workspaceDatabase.insertPromptVersion(initialVersion);
    return { success: true, prompt };
  }

  /**
   * Updates prompt content and records a new immutable version.
   */
  public updatePrompt(
    userId: string,
    promptId: string,
    updates: {
      title?: string;
      description?: string;
      templateText?: string;
      variables?: Array<{ name: string; label: string; defaultValue: string }>;
      changeSummary?: string;
      isPublic?: boolean;
    }
  ): { success: boolean; prompt?: PersonalPrompt; error?: string } {
    const existing = workspaceDatabase.findPromptById(promptId);
    const auth = authorizationGuard.canMutate(userId, existing);
    if (!auth.allowed || !existing) {
      return { success: false, error: auth.error || 'Prompt not found.' };
    }

    const now = new Date().toISOString();
    const isContentChanged = updates.templateText && updates.templateText.trim() !== existing.templateText;

    if (updates.title) existing.title = updates.title.trim();
    if (updates.description) existing.description = updates.description.trim();
    if (updates.variables) existing.variables = updates.variables;
    if (updates.isPublic !== undefined) existing.isPublic = updates.isPublic;

    if (isContentChanged && updates.templateText) {
      existing.templateText = updates.templateText.trim();
      existing.currentVersion += 1;

      // Log new version
      const versionRecord: PromptVersion = {
        id: `ver-${crypto.randomBytes(6).toString('hex')}`,
        promptId: existing.id,
        version: existing.currentVersion,
        content: existing.templateText,
        changeSummary: updates.changeSummary?.trim() || `Update to version ${existing.currentVersion}`,
        timestamp: now,
        ownerId: userId,
      };

      workspaceDatabase.insertPromptVersion(versionRecord);
    }

    existing.updatedAt = now;
    workspaceDatabase.updatePrompt(existing);

    return { success: true, prompt: existing };
  }

  /**
   * Retrieves all historical versions for a prompt with ownership verification.
   */
  public getVersionHistory(userId: string, promptId: string): PromptVersion[] {
    const prompt = workspaceDatabase.findPromptById(promptId);
    const auth = authorizationGuard.canAccess(userId, prompt);
    if (!auth.allowed) return [];

    return workspaceDatabase.getPromptVersions(promptId).sort((a, b) => b.version - a.version);
  }

  /**
   * Retrieves user prompts.
   */
  public getUserPrompts(userId: string): PersonalPrompt[] {
    return workspaceDatabase.getPrompts(userId);
  }

  /**
   * Exports a prompt into clean Markdown or JSON format.
   */
  public exportPrompt(
    userId: string,
    promptId: string,
    format: 'markdown' | 'json' = 'markdown'
  ): { success: boolean; content?: string; filename?: string; error?: string } {
    const prompt = workspaceDatabase.findPromptById(promptId);
    const auth = authorizationGuard.canAccess(userId, prompt);
    if (!auth.allowed || !prompt) {
      return { success: false, error: auth.error || 'Prompt not found.' };
    }

    const versions = this.getVersionHistory(userId, promptId);

    if (format === 'json') {
      const payload = {
        prompt,
        versions,
        exportedAt: new Date().toISOString(),
      };
      return {
        success: true,
        content: JSON.stringify(payload, null, 2),
        filename: `${prompt.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-v${prompt.currentVersion}.json`,
      };
    }

    // Markdown format
    const md = `# ${prompt.title} (v${prompt.currentVersion})
**Category:** ${prompt.category}  
**Last Updated:** ${prompt.updatedAt}

## Description
${prompt.description}

## Template Directive
\`\`\`markdown
${prompt.templateText}
\`\`\`

## Variables
${prompt.variables.map((v) => `- \`${v.name}\`: ${v.label} (Default: "${v.defaultValue}")`).join('\n')}

---
*Exported from AI Satellite My Orbit Workspace — https://aisatellite.dev*`;

    return {
      success: true,
      content: md,
      filename: `${prompt.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-v${prompt.currentVersion}.md`,
    };
  }
}

export const promptVault = new PromptVault();
