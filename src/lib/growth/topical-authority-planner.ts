/**
 * AI Satellite — Phase 15 Topical Authority Planner
 * Structures comprehensive content clusters across 13 topic families with pillar pages,
 * distinct supporting resources, and meaningful internal links without keyword repetition.
 */

import type { AuthorityCluster, TopicFamily, SearchIntent, ContentFormat } from './types';
import { TOPIC_FAMILIES } from './types';
import { growthDatabase, GrowthDatabase } from './database';

export class TopicalAuthorityPlanner {
  private db: GrowthDatabase;

  constructor(db?: GrowthDatabase) {
    this.db = db || growthDatabase;
    this.seedDefaultClusters();
  }

  public getTopicFamilies(): readonly TopicFamily[] {
    return TOPIC_FAMILIES;
  }

  public getClusters(): AuthorityCluster[] {
    return this.db.getAuthorityClusters();
  }

  public getClusterBySlug(slug: string): AuthorityCluster | undefined {
    return this.db.getAuthorityClusters().find((c) => c.pillarSlug === slug);
  }

  public createCluster(input: {
    pillarTitle: string;
    pillarSlug: string;
    topicFamily: TopicFamily;
    targetSearchIntent: SearchIntent;
    supportingResources: Array<{
      title: string;
      slug: string;
      format: ContentFormat;
      distinctValue: string;
      internalLinkAnchor: string;
    }>;
  }): AuthorityCluster {
    const existing = this.db.getAuthorityClusters().find((c) => c.pillarSlug === input.pillarSlug);
    const now = new Date().toISOString();

    const cluster: AuthorityCluster = {
      id: existing ? existing.id : `cluster-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      pillarTitle: input.pillarTitle,
      pillarSlug: input.pillarSlug,
      topicFamily: input.topicFamily,
      targetSearchIntent: input.targetSearchIntent,
      supportingResources: input.supportingResources,
      internalLinkDepthMax: 2,
      coverageScore: Math.min(100, input.supportingResources.length * 20),
      freshnessStatus: 'fresh',
      updatedAt: now,
    };

    this.db.saveAuthorityCluster(cluster);
    return cluster;
  }

  /**
   * Generates contextual internal link recommendations for a given cluster
   */
  public generateInternalLinkRecommendations(clusterSlug: string): Array<{
    sourceUrl: string;
    targetUrl: string;
    anchorText: string;
    reason: string;
  }> {
    const cluster = this.getClusterBySlug(clusterSlug);
    if (!cluster) return [];

    const recommendations: Array<{
      sourceUrl: string;
      targetUrl: string;
      anchorText: string;
      reason: string;
    }> = [];

    // Link pillar to each supporting resource
    for (const res of cluster.supportingResources) {
      recommendations.push({
        sourceUrl: cluster.pillarSlug,
        targetUrl: res.slug,
        anchorText: res.internalLinkAnchor,
        reason: `Pillar context link to in-depth supporting resource: ${res.distinctValue}`,
      });

      // Reciprocal contextual breadcrumb link from supporting resource back to pillar
      recommendations.push({
        sourceUrl: res.slug,
        targetUrl: cluster.pillarSlug,
        anchorText: cluster.pillarTitle,
        reason: 'Supporting page links back to parent topical authority pillar.',
      });
    }

    return recommendations;
  }

  public seedDefaultClusters(): void {
    const existing = this.db.getAuthorityClusters();
    if (existing.length > 0) return;

    this.createCluster({
      pillarTitle: 'Best Free and Open-Source Automation Tools',
      pillarSlug: '/alternatives/automation',
      topicFamily: 'Self-hosted automation',
      targetSearchIntent: 'tool_discovery',
      supportingResources: [
        {
          title: 'Zapier Alternatives: Verified Free and Self-Hosted Options',
          slug: '/alternatives/zapier-alternatives',
          format: 'comparison_matrix',
          distinctValue: 'Direct feature-by-feature cost comparison between Zapier, n8n, and Activepieces.',
          internalLinkAnchor: 'verified Zapier alternatives',
        },
        {
          title: 'Deploying n8n on Docker: Complete Self-Hosting Guide',
          slug: '/tutorials/deploy-n8n-docker-vps',
          format: 'step_tutorial',
          distinctValue: 'Step-by-step production Docker Compose configuration with HTTPS reverse proxy.',
          internalLinkAnchor: 'self-host n8n on Docker',
        },
        {
          title: 'Self-Hosted Automation Infrastructure Cost Breakdown',
          slug: '/solutions/automation-cost-breakdown',
          format: 'original_research_report',
          distinctValue: 'Measured monthly hosting costs across AWS, Hetzner, and DigitalOcean.',
          internalLinkAnchor: 'automation server costs',
        },
      ],
    });

    this.createCluster({
      pillarTitle: 'Local AI Development & Open-Weight LLM Inference',
      pillarSlug: '/topics/ai-development',
      topicFamily: 'Open-source AI tools',
      targetSearchIntent: 'developer_implementation',
      supportingResources: [
        {
          title: 'Ollama Setup: Running LLMs Locally on Mac, Linux, and Windows',
          slug: '/tutorials/ollama-local-llm-guide',
          format: 'step_tutorial',
          distinctValue: 'Benchmarking Llama 3.3 and Mistral memory consumption on consumer hardware.',
          internalLinkAnchor: 'run local LLMs with Ollama',
        },
        {
          title: 'High-Throughput Inference with vLLM PagedAttention',
          slug: '/tutorials/vllm-production-inference',
          format: 'step_tutorial',
          distinctValue: 'Production API server setup for concurrent developer agent workloads.',
          internalLinkAnchor: 'scale LLM serving with vLLM',
        },
      ],
    });

    this.createCluster({
      pillarTitle: 'Open-Source Backend & Database Infrastructure',
      pillarSlug: '/topics/databases',
      topicFamily: 'Free alternatives to paid software',
      targetSearchIntent: 'open_source_evaluation',
      supportingResources: [
        {
          title: 'Supabase vs Firebase: The Self-Hosted Relational Alternative',
          slug: '/alternatives/firebase-alternatives',
          format: 'comparison_matrix',
          distinctValue: 'Full comparison of Postgres row-level security vs Firebase rules.',
          internalLinkAnchor: 'open-source Firebase alternatives',
        },
        {
          title: 'Vector Search with Qdrant: Production Semantic Retrieval',
          slug: '/tutorials/qdrant-vector-search',
          format: 'step_tutorial',
          distinctValue: 'Setting up Rust-based vector search for local and cloud RAG pipelines.',
          internalLinkAnchor: 'deploy Qdrant vector database',
        },
      ],
    });
  }
}

export const topicalAuthorityPlanner = new TopicalAuthorityPlanner();
