/**
 * AI Satellite — Phase 14 Autonomous Global Technology Discovery & Intelligence Network
 * Engine J: Global Technology Radar & Interactive Orbital Telemetry
 * 
 * Computes 3D polar telemetry (r, theta, quadrant) for the Global Technology Radar,
 * distributing technologies across 4 orbital quadrants: ai_models, open_source,
 * frameworks, and alternatives.
 */

import { uuidv4 } from './id-generator';
import type { RadarTelemetryEntry } from './types';
import { discoveryDatabase, DiscoveryDatabase } from './database';

export type RadarQuadrant = 'ai_models' | 'open_source' | 'frameworks' | 'alternatives';

export class RadarEngine {
  private db: DiscoveryDatabase;

  constructor(db?: DiscoveryDatabase) {
    this.db = db || discoveryDatabase;
    this.seedDefaultRadarEntries();
  }

  public getTelemetryEntries(): RadarTelemetryEntry[] {
    return this.db.getRadarEntries();
  }

  public getEntriesByQuadrant(quadrant: RadarQuadrant): RadarTelemetryEntry[] {
    return this.db.getRadarEntries().filter((e) => e.coordinates.quadrant === quadrant);
  }

  public registerTelemetryEntry(input: {
    name: string;
    slug: string;
    categorySlug: string;
    summary: string;
    license: string;
    pricingClassification: string;
    isTrending: boolean;
    replaces?: string[];
    coordinates: {
      r: number;
      theta: number;
      quadrant: RadarQuadrant;
    };
  }): RadarTelemetryEntry {
    const existing = this.db.getRadarEntries().find((r) => r.slug === input.slug);
    const now = new Date().toISOString();

    const entry: RadarTelemetryEntry = {
      id: existing ? existing.id : `rad-${uuidv4().slice(0, 8)}`,
      name: input.name,
      slug: input.slug,
      categorySlug: input.categorySlug,
      summary: input.summary,
      license: input.license,
      pricingClassification: input.pricingClassification,
      isTrending: input.isTrending,
      replaces: input.replaces,
      verifiedAt: now,
      coordinates: input.coordinates,
    };

    this.db.saveRadarEntry(entry);
    return entry;
  }

  /**
   * Helper to compute orbital angles based on quadrant
   */
  public getQuadrantAngleRange(quadrant: RadarQuadrant): { minTheta: number; maxTheta: number } {
    switch (quadrant) {
      case 'ai_models':
        return { minTheta: 0, maxTheta: 90 };
      case 'open_source':
        return { minTheta: 90, maxTheta: 180 };
      case 'frameworks':
        return { minTheta: 180, maxTheta: 270 };
      case 'alternatives':
        return { minTheta: 270, maxTheta: 360 };
    }
  }

  public seedDefaultRadarEntries(): void {
    const existing = this.db.getRadarEntries();
    if (existing.length > 0) return;

    const defaults: Array<{
      name: string;
      slug: string;
      categorySlug: string;
      summary: string;
      license: string;
      pricingClassification: string;
      isTrending: boolean;
      replaces?: string[];
      coordinates: {
        r: number;
        theta: number;
        quadrant: RadarQuadrant;
      };
    }> = [
      {
        name: 'Ollama',
        slug: 'ollama',
        categorySlug: 'local-llm',
        summary: 'Local execution of open-weight LLMs on consumer GPUs & Apple Silicon.',
        license: 'MIT',
        pricingClassification: 'Free & Open Source',
        isTrending: true,
        coordinates: { r: 0.15, theta: 45, quadrant: 'ai_models' },
      },
      {
        name: 'vLLM',
        slug: 'vllm',
        categorySlug: 'inference-engine',
        summary: 'High-throughput PagedAttention inference server for production LLM workloads.',
        license: 'Apache-2.0',
        pricingClassification: 'Free & Open Source',
        isTrending: true,
        coordinates: { r: 0.22, theta: 65, quadrant: 'ai_models' },
      },
      {
        name: 'Supabase',
        slug: 'supabase',
        categorySlug: 'database-backend',
        summary: 'Open source Postgres backend with auth, storage, and realtime subscriptions.',
        license: 'Apache-2.0',
        pricingClassification: 'Free Core & Freemium Cloud',
        isTrending: true,
        replaces: ['Firebase'],
        coordinates: { r: 0.18, theta: 135, quadrant: 'open_source' },
      },
      {
        name: 'Qdrant',
        slug: 'qdrant',
        categorySlug: 'vector-db',
        summary: 'High-performance Rust vector similarity engine for semantic search and RAG.',
        license: 'Apache-2.0',
        pricingClassification: 'Free Core & Freemium Cloud',
        isTrending: true,
        replaces: ['Pinecone'],
        coordinates: { r: 0.28, theta: 160, quadrant: 'open_source' },
      },
      {
        name: 'LangGraph',
        slug: 'langgraph',
        categorySlug: 'agent-framework',
        summary: 'Multi-agent orchestration framework with cyclical state graphs and human-in-the-loop controls.',
        license: 'MIT',
        pricingClassification: 'Free & Open Source',
        isTrending: true,
        coordinates: { r: 0.25, theta: 220, quadrant: 'frameworks' },
      },
      {
        name: 'n8n',
        slug: 'n8n',
        categorySlug: 'automation',
        summary: 'Self-hosted workflow automation platform with AI node support and 400+ integrations.',
        license: 'Sustainable-Use-License',
        pricingClassification: 'Free Self-Hosted',
        isTrending: true,
        replaces: ['Zapier', 'Make.com'],
        coordinates: { r: 0.20, theta: 315, quadrant: 'alternatives' },
      },
      {
        name: 'Bruno',
        slug: 'bruno',
        categorySlug: 'api-testing',
        summary: 'Git-friendly, fast, offline-first open source desktop API client.',
        license: 'MIT',
        pricingClassification: 'Free & Open Source',
        isTrending: true,
        replaces: ['Postman', 'Insomnia'],
        coordinates: { r: 0.16, theta: 340, quadrant: 'alternatives' },
      },
    ];

    for (const d of defaults) {
      this.registerTelemetryEntry(d);
    }
  }
}

export const radarEngine = new RadarEngine();
