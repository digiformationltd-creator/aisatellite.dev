/**
 * AI Satellite — Phase 15 Content Gap Intelligence Engine
 * Discovers content gaps between published resources and user demand
 * (internal zero-result searches, community questions, upstream technology changes),
 * generating reviewable proposals without auto-publishing thin pages.
 */

import type { ContentGapProposal, TopicFamily, SearchIntent } from './types';
import { growthDatabase, GrowthDatabase } from './database';

export class ContentGapIntelligenceEngine {
  private db: GrowthDatabase;

  constructor(db?: GrowthDatabase) {
    this.db = db || growthDatabase;
    this.seedDefaultGaps();
  }

  public getProposals(status?: 'proposed' | 'under_review' | 'approved' | 'rejected'): ContentGapProposal[] {
    const list = this.db.getContentGapProposals();
    if (!status) return list;
    return list.filter((p) => p.status === status);
  }

  public createProposal(input: {
    title: string;
    topicFamily: TopicFamily;
    searchIntent: SearchIntent;
    targetAudience: string;
    identifiedVia: 'zero_result_search' | 'community_question' | 'tech_radar_change' | 'search_console_query';
    unmetNeedExplanation: string;
    evidenceRequirement: string;
  }): ContentGapProposal {
    // Check for duplicate proposal
    const existing = this.db.getContentGapProposals().find(
      (p) => p.title.toLowerCase().trim() === input.title.toLowerCase().trim()
    );

    if (existing) {
      return existing;
    }

    const proposal: ContentGapProposal = {
      id: `gap-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: input.title,
      topicFamily: input.topicFamily,
      searchIntent: input.searchIntent,
      targetAudience: input.targetAudience,
      identifiedVia: input.identifiedVia,
      unmetNeedExplanation: input.unmetNeedExplanation,
      evidenceRequirement: input.evidenceRequirement,
      status: 'proposed',
      proposedAt: new Date().toISOString(),
    };

    this.db.saveContentGapProposal(proposal);
    return proposal;
  }

  public reviewProposal(id: string, decision: 'approved' | 'rejected', notes?: string): ContentGapProposal {
    const list = this.db.getContentGapProposals();
    const item = list.find((p) => p.id === id);
    if (!item) throw new Error(`Content gap proposal not found: ${id}`);

    item.status = decision;
    this.db.saveContentGapProposal(item);
    return item;
  }

  public seedDefaultGaps(): void {
    const existing = this.db.getContentGapProposals();
    if (existing.length > 0) return;

    this.createProposal({
      title: 'Valkey Migration Guide for Production Redis Deployments',
      topicFamily: 'Free alternatives to paid software',
      searchIntent: 'developer_implementation',
      targetAudience: 'DevOps engineers and backend architects',
      identifiedVia: 'tech_radar_change',
      unmetNeedExplanation: 'Users searching for open-source BSD Redis replacements lack a step-by-step wire-compatible migration guide.',
      evidenceRequirement: 'Official Valkey Linux Foundation releases and benchmark latency tests against Redis 7.2.',
    });

    this.createProposal({
      title: 'Building Stateful Agent Workflows with LangGraph and Ollama',
      topicFamily: 'AI agents',
      searchIntent: 'tutorial',
      targetAudience: 'AI engineers building privacy-first agents',
      identifiedVia: 'zero_result_search',
      unmetNeedExplanation: 'Developers query for multi-actor state graph agent tutorials that operate 100% offline without OpenAI API credits.',
      evidenceRequirement: 'Working Python code repo tested on macOS Apple Silicon and Linux Docker.',
    });

    this.createProposal({
      title: 'Self-Hosted Airtable Alternative: Baserow vs NocoDB',
      topicFamily: 'Open-source productivity software',
      searchIntent: 'comparative',
      targetAudience: 'Product teams and operations engineers',
      identifiedVia: 'community_question',
      unmetNeedExplanation: 'Discussions show confusion around Baserow vs NocoDB performance on large datasets (>50k rows).',
      evidenceRequirement: 'Standardized Postgres indexing benchmarks and docker-compose RAM consumption metrics.',
    });
  }
}

export const contentGapIntelligenceEngine = new ContentGapIntelligenceEngine();
