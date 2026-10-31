/**
 * AI Satellite — Universal Knowledge Engine (Phase 11)
 * Centralized knowledge query and search aggregator spanning all 14 developer resource categories.
 */

import type { UniversalResourceBase, KnowledgeCategory, FreeClassification } from './types';
import { freeAPIDirectory } from './free-apis';
import { troubleshootingEngine } from './troubleshooting-engine';
import { mcpAndAgentsEngine } from './mcp-and-agents-engine';
import { promptGalaxyEngine } from '../prompts/prompt-galaxy';
import { tutorialEngine } from '../tutorials/tutorial-engine';
import { uiComponentEngine } from '../ui-components/component-engine';
import { freeAlternativesVerificationEngine } from '../operations/alternatives-verification';

export interface KnowledgeSearchQuery {
  query?: string;
  category?: KnowledgeCategory | 'all';
  license?: string;
  freeClassification?: FreeClassification | 'all';
  technology?: string;
  limit?: number;
}

export interface UniversalSearchResult {
  resource: UniversalResourceBase;
  matchScore: number;
  highlightedSnippet: string;
}

export class UniversalKnowledgeEngine {
  private indexedResources: UniversalResourceBase[] = [];

  constructor() {
    this.buildUniversalIndex();
  }

  private buildUniversalIndex(): void {
    const list: UniversalResourceBase[] = [];

    // 1. Free APIs
    freeAPIDirectory.getAllAPIs().forEach((api) => list.push(api));

    // 2. Troubleshooting guides
    troubleshootingEngine.getAllSolutions().forEach((sol) => list.push(sol));

    // 3. MCP Servers
    mcpAndAgentsEngine.getAllServers().forEach((srv) => list.push(srv));

    // 4. Prompts (adapted to UniversalResourceBase)
    promptGalaxyEngine.getAllTemplates().forEach((p) => {
      list.push({
        id: `prompt-${p.slug}`,
        title: p.title,
        slug: p.slug,
        summary: p.description,
        category: 'ai_prompts',
        tags: [p.category.toLowerCase(), p.targetModel.toLowerCase()],
        authorOrMaintainer: 'AI Satellite Prompt Engineering Lab',
        sourceReferences: [{ title: 'Prompt Specification', url: `https://aisatellite.dev/prompts/${p.slug}` }],
        verificationStatus: 'verified',
        lastVerifiedDate: '2026-10-31',
        publishedDate: '2026-10-31',
        updatedDate: '2026-10-31',
        relatedResourceIds: [],
        editorialStatus: 'published',
        searchKeywords: [p.title.toLowerCase(), p.category.toLowerCase(), ...p.variables.map((v) => v.name.toLowerCase())],
      });
    });

    // 5. Tutorials
    tutorialEngine.getAllTutorials().forEach((tut) => {
      list.push({
        id: `tut-${tut.slug}`,
        title: tut.title,
        slug: tut.slug,
        summary: tut.problemStatement,
        category: 'developer_tutorials',
        tags: [tut.category.toLowerCase(), tut.language.toLowerCase()],
        authorOrMaintainer: 'AI Satellite Technical Content Team',
        sourceReferences: [{ title: 'Official Implementation Guide', url: `https://aisatellite.dev/tutorials/${tut.slug}` }],
        verificationStatus: 'verified',
        lastVerifiedDate: tut.lastVerified,
        publishedDate: '2026-10-31',
        updatedDate: '2026-10-31',
        relatedResourceIds: [],
        editorialStatus: 'published',
        searchKeywords: [tut.title.toLowerCase(), tut.category.toLowerCase(), tut.language.toLowerCase()],
      });
    });

    // 6. CSS & UI Components
    uiComponentEngine.getAllComponents().forEach((comp) => {
      list.push({
        id: `ui-${comp.slug}`,
        title: comp.title,
        slug: comp.slug,
        summary: comp.description,
        category: 'css_components',
        tags: [comp.category.toLowerCase(), 'css', 'tailwind', 'glassmorphism'],
        authorOrMaintainer: 'AI Satellite Design System Engineer',
        sourceReferences: [{ title: 'Component Spec', url: `https://aisatellite.dev/components/${comp.slug}` }],
        verificationStatus: 'verified',
        lastVerifiedDate: comp.lastVerified,
        publishedDate: '2026-10-31',
        updatedDate: '2026-10-31',
        relatedResourceIds: [],
        editorialStatus: 'published',
        searchKeywords: [comp.title.toLowerCase(), comp.category.toLowerCase()],
      });
    });

    // 7. Free Alternatives
    freeAlternativesVerificationEngine.getAllVerifications().forEach((alt) => {
      list.push({
        id: `alt-${alt.resourceId}`,
        title: alt.resourceName,
        slug: alt.resourceId,
        summary: alt.limitationsExplanation || `${alt.resourceName} verified under license ${alt.license}`,
        category: 'free_alternatives',
        tags: [alt.freeClassification, alt.license.toLowerCase(), ...alt.platformCompatibility.map((p) => p.toLowerCase())],
        authorOrMaintainer: alt.resourceName,
        sourceReferences: alt.evidenceUrls && alt.evidenceUrls.length > 0
          ? alt.evidenceUrls.map((u) => ({ title: 'Primary Source', url: u }))
          : [{ title: 'AI Satellite Radar Analysis', url: 'https://aisatellite.dev/radar' }],
        verificationStatus: alt.status === 'verification_pending' ? 'pending' : alt.status,
        lastVerifiedDate: alt.lastVerifiedAt,
        publishedDate: '2026-10-31',
        updatedDate: '2026-10-31',
        relatedResourceIds: [],
        editorialStatus: 'published',
        searchKeywords: [alt.resourceName.toLowerCase(), alt.license.toLowerCase(), alt.freeClassification],
      });
    });

    this.indexedResources = list;
  }

  /**
   * Multi-faceted search across all knowledge universe items.
   */
  public search(params: KnowledgeSearchQuery): UniversalSearchResult[] {
    const query = (params.query || '').trim().toLowerCase();
    const category = params.category && params.category !== 'all' ? params.category : undefined;
    const technology = params.technology?.toLowerCase();

    const filtered = this.indexedResources.filter((item) => {
      if (category && item.category !== category) return false;
      if (technology && !item.tags.some((t) => t.includes(technology))) return false;
      return true;
    });

    if (!query) {
      return filtered.slice(0, params.limit || 50).map((resource) => ({
        resource,
        matchScore: 1.0,
        highlightedSnippet: resource.summary,
      }));
    }

    const scored = filtered
      .map((resource) => {
        let score = 0;
        const titleLower = resource.title.toLowerCase();
        const summaryLower = resource.summary.toLowerCase();
        const keywords = resource.searchKeywords.join(' ').toLowerCase();

        if (titleLower === query) score += 100;
        else if (titleLower.includes(query)) score += 50;

        if (summaryLower.includes(query)) score += 25;
        if (keywords.includes(query)) score += 20;
        if (resource.tags.some((t) => t.includes(query))) score += 30;

        return {
          resource,
          matchScore: score,
          highlightedSnippet: resource.summary,
        };
      })
      .filter((res) => res.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    return scored.slice(0, params.limit || 50);
  }

  public getAllResources(): UniversalResourceBase[] {
    return [...this.indexedResources];
  }

  public getResourceById(id: string): UniversalResourceBase | undefined {
    return this.indexedResources.find((r) => r.id === id);
  }

  public getResourceBySlug(category: KnowledgeCategory, slug: string): UniversalResourceBase | undefined {
    return this.indexedResources.find((r) => r.category === category && r.slug === slug);
  }
}

export const universalKnowledgeEngine = new UniversalKnowledgeEngine();
