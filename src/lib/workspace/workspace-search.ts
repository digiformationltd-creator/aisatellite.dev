/**
 * AI Satellite — Private Workspace Search Engine (Phase 12)
 * Searches exclusively within an authenticated user's private records with server-side authorization.
 */

import { workspaceDatabase } from './database';

export interface WorkspaceSearchResult {
  id: string;
  type: 'saved_tool' | 'saved_alternative' | 'prompt' | 'snippet' | 'project' | 'collection';
  title: string;
  snippet: string;
  tags: string[];
  url?: string;
  score: number;
}

export class WorkspaceSearchEngine {
  /**
   * Executes an authorization-enforced search across user's private workspace items.
   */
  public search(userId: string, query: string): WorkspaceSearchResult[] {
    if (!userId) return [];
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: WorkspaceSearchResult[] = [];

    // 1. Search Prompts
    const prompts = workspaceDatabase.getPrompts(userId);
    for (const p of prompts) {
      let score = 0;
      if (p.title.toLowerCase().includes(q)) score += 50;
      if (p.description.toLowerCase().includes(q)) score += 30;
      if (p.templateText.toLowerCase().includes(q)) score += 20;

      if (score > 0) {
        results.push({
          id: p.id,
          type: 'prompt',
          title: p.title,
          snippet: p.description || p.templateText.slice(0, 120),
          tags: [p.category],
          score,
        });
      }
    }

    // 2. Search Code Snippets
    const snippets = workspaceDatabase.getSnippets(userId);
    for (const s of snippets) {
      let score = 0;
      if (s.title.toLowerCase().includes(q)) score += 50;
      if (s.description.toLowerCase().includes(q)) score += 30;
      if (s.code.toLowerCase().includes(q)) score += 25;
      if (s.tags.some((t) => t.toLowerCase().includes(q))) score += 20;

      if (score > 0) {
        results.push({
          id: s.id,
          type: 'snippet',
          title: s.title,
          snippet: s.description || s.code.slice(0, 100),
          tags: [s.language, ...s.tags],
          score,
        });
      }
    }

    // 3. Search Projects
    const projects = workspaceDatabase.getProjects(userId);
    for (const prj of projects) {
      let score = 0;
      if (prj.name.toLowerCase().includes(q)) score += 50;
      if (prj.description.toLowerCase().includes(q)) score += 30;
      if (prj.researchNotes.toLowerCase().includes(q)) score += 25;
      if (prj.techStack.some((t) => t.toLowerCase().includes(q))) score += 20;

      if (score > 0) {
        results.push({
          id: prj.id,
          type: 'project',
          title: prj.name,
          snippet: prj.description || prj.researchNotes.slice(0, 100),
          tags: [prj.status, ...prj.techStack],
          score,
        });
      }
    }

    // 4. Search Saved Resources
    const saved = workspaceDatabase.getSavedResources(userId);
    for (const item of saved) {
      let score = 0;
      if (item.title.toLowerCase().includes(q)) score += 50;
      if (item.notes.toLowerCase().includes(q)) score += 30;
      if (item.tags.some((t) => t.toLowerCase().includes(q))) score += 20;

      if (score > 0) {
        results.push({
          id: item.id,
          type: item.resourceCategory === 'free_alternatives' ? 'saved_alternative' : 'saved_tool',
          title: item.title,
          snippet: item.notes || `Saved in ${item.resourceCategory}`,
          tags: item.tags,
          url: item.originalUrl,
          score,
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }
}

export const workspaceSearchEngine = new WorkspaceSearchEngine();
