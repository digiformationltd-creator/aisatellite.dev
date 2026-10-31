/**
 * AI Satellite — Community Search Engine (Phase 13)
 * Full-text search across public community entities: approved discussions,
 * opt-in developer profiles, verified open-source projects, published collections, and public Q&A.
 * Enforces strict authorization to exclude private, unapproved, or sensitive data.
 */

import { communityDatabase } from './database';

export interface CommunitySearchResult {
  id: string;
  type: 'discussion' | 'profile' | 'project' | 'collection' | 'question';
  title: string;
  description: string;
  url: string;
  tags: string[];
  author?: string;
  matchedField: string;
}

export class CommunitySearchEngine {
  /**
   * Searches public community records.
   * Strictly filters out private profiles, private collections, and unapproved items.
   */
  public search(query: string): CommunitySearchResult[] {
    const cleanQuery = query.toLowerCase().trim();
    if (!cleanQuery) return [];

    const results: CommunitySearchResult[] = [];

    // 1. Approved Discussions (not hidden)
    const discussions = communityDatabase.getDiscussions().filter((d) => !d.isHidden);
    for (const d of discussions) {
      if (
        d.title.toLowerCase().includes(cleanQuery) ||
        d.content.toLowerCase().includes(cleanQuery) ||
        d.tags.some((t) => t.includes(cleanQuery))
      ) {
        results.push({
          id: d.id,
          type: 'discussion',
          title: d.title,
          description: d.content.slice(0, 160) + (d.content.length > 160 ? '...' : ''),
          url: `/community/discussions#${d.id}`,
          tags: d.tags,
          author: d.authorUsername,
          matchedField: d.title.toLowerCase().includes(cleanQuery) ? 'title' : 'content',
        });
      }
    }

    // 2. Opt-in Public Profiles ONLY
    const profiles = communityDatabase.getProfiles().filter((p) => p.isPublicProfile);
    for (const p of profiles) {
      if (
        p.username.toLowerCase().includes(cleanQuery) ||
        p.displayName.toLowerCase().includes(cleanQuery) ||
        p.bio?.toLowerCase().includes(cleanQuery) ||
        p.technicalInterests.some((t) => t.toLowerCase().includes(cleanQuery))
      ) {
        results.push({
          id: p.userId,
          type: 'profile',
          title: `${p.displayName} (@${p.username})`,
          description: p.bio || `Developer interested in ${p.technicalInterests.join(', ')}`,
          url: `/u/${p.username}`,
          tags: p.technicalInterests,
          author: p.username,
          matchedField: p.username.toLowerCase().includes(cleanQuery) ? 'username' : 'bio',
        });
      }
    }

    // 3. Approved Project Showcases ONLY
    const projects = communityDatabase.getProjects().filter((p) => p.status === 'approved');
    for (const prj of projects) {
      if (
        prj.name.toLowerCase().includes(cleanQuery) ||
        prj.description.toLowerCase().includes(cleanQuery) ||
        prj.maintainerAttribution.toLowerCase().includes(cleanQuery) ||
        prj.license.toLowerCase().includes(cleanQuery)
      ) {
        results.push({
          id: prj.id,
          type: 'project',
          title: prj.name,
          description: prj.description.slice(0, 160) + '...',
          url: `/community/projects#${prj.id}`,
          tags: [prj.license, ...prj.supportedPlatforms],
          author: prj.maintainerAttribution,
          matchedField: prj.name.toLowerCase().includes(cleanQuery) ? 'name' : 'description',
        });
      }
    }

    // 4. Published Collections ONLY (isPublic === true)
    const collections = communityDatabase.getCollaborativeCollections().filter((c) => c.isPublic);
    for (const col of collections) {
      if (
        col.title.toLowerCase().includes(cleanQuery) ||
        col.description.toLowerCase().includes(cleanQuery) ||
        col.tags.some((t) => t.toLowerCase().includes(cleanQuery))
      ) {
        results.push({
          id: col.id,
          type: 'collection',
          title: col.title,
          description: col.description || `Collaborative collection with ${col.resourceIds.length} resources`,
          url: `/community/collections#${col.id}`,
          tags: col.tags,
          author: col.ownerUsername,
          matchedField: col.title.toLowerCase().includes(cleanQuery) ? 'title' : 'tags',
        });
      }
    }

    // 5. Public Q&A
    const questions = communityDatabase.getQuestions();
    for (const q of questions) {
      if (
        q.title.toLowerCase().includes(cleanQuery) ||
        q.technicalContext.toLowerCase().includes(cleanQuery) ||
        q.tags.some((t) => t.toLowerCase().includes(cleanQuery))
      ) {
        results.push({
          id: q.id,
          type: 'question',
          title: q.title,
          description: q.technicalContext.slice(0, 160) + '...',
          url: `/community/qa#${q.id}`,
          tags: q.tags,
          author: q.authorUsername,
          matchedField: q.title.toLowerCase().includes(cleanQuery) ? 'title' : 'context',
        });
      }
    }

    return results;
  }
}

export const communitySearchEngine = new CommunitySearchEngine();
