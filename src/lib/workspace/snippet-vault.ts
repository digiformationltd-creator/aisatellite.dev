/**
 * AI Satellite — Code Snippet Vault (Phase 12)
 * Secure personal code snippet repository with syntax classifications, safe HTML escaping,
 * and authorization guards.
 */

import crypto from 'node:crypto';
import { workspaceDatabase } from './database';
import { authorizationGuard } from './authorization';
import type { CodeSnippet } from './types';
import { CreateSnippetSchema } from './types';

export class SnippetVault {
  /**
   * Sanitizes code snippets for safe rendering in HTML contexts, preventing script execution.
   */
  public sanitizeSnippet(code: string): string {
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Creates a private code snippet.
   */
  public createSnippet(
    userId: string,
    input: {
      title: string;
      description?: string;
      language: string;
      code: string;
      tags?: string[];
      collectionId?: string;
      isPublic?: boolean;
    }
  ): { success: boolean; snippet?: CodeSnippet; error?: string } {
    const validated = CreateSnippetSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || 'Invalid snippet parameters.' };
    }

    const now = new Date().toISOString();
    const snippet: CodeSnippet = {
      id: `snp-${crypto.randomBytes(6).toString('hex')}`,
      userId,
      title: input.title.trim(),
      description: input.description?.trim() || '',
      language: input.language.toLowerCase(),
      code: input.code,
      tags: input.tags || [],
      collectionId: input.collectionId,
      isPublic: input.isPublic || false,
      createdAt: now,
      updatedAt: now,
    };

    workspaceDatabase.insertSnippet(snippet);
    return { success: true, snippet };
  }

  /**
   * Retrieves snippets belonging to the user.
   */
  public getUserSnippets(userId: string): CodeSnippet[] {
    return workspaceDatabase.getSnippets(userId);
  }

  /**
   * Retrieves a single snippet with ownership protection.
   */
  public getSnippet(userId: string, snippetId: string): CodeSnippet | undefined {
    const snippet = workspaceDatabase.findSnippetById(snippetId);
    const auth = authorizationGuard.canAccess(userId, snippet);
    if (!auth.allowed) return undefined;
    return snippet;
  }

  /**
   * Deletes a snippet.
   */
  public deleteSnippet(userId: string, snippetId: string): boolean {
    const snippet = workspaceDatabase.findSnippetById(snippetId);
    const auth = authorizationGuard.canMutate(userId, snippet);
    if (!auth.allowed) return false;
    return workspaceDatabase.deleteSnippet(userId, snippetId);
  }
}

export const snippetVault = new SnippetVault();
