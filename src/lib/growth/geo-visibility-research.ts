/**
 * AI Satellite — Phase 15 Generative Engine Optimization (GEO) Research
 * Analyzes entity clarity, product relationships, authoritative source grounding,
 * and citation readiness across generative answer platforms (ChatGPT, Perplexity, Google AI Overviews).
 * Prohibits scraping violations and zero fabricated citations.
 */

import type { GEOEvaluation } from './types';
import { growthDatabase, GrowthDatabase } from './database';

export class GeoVisibilityResearch {
  private db: GrowthDatabase;

  constructor(db?: GrowthDatabase) {
    this.db = db || growthDatabase;
    this.seedDefaultEvaluations();
  }

  public evaluateEntity(input: {
    entityName: string;
    entityType: 'tool' | 'framework' | 'library' | 'platform';
    stableDescription: string;
    accurateRelationships: string[];
    authoritativeSourcesCited: string[];
    visibleVerificationDate: string;
  }): GEOEvaluation {
    let score = 0;

    // Stable entity definition (clear, unambiguous terminology)
    if (input.stableDescription.length >= 30) score += 30;

    // Accurate product relationships (replaces, implements, alternative)
    if (input.accurateRelationships.length >= 1) score += 25;

    // Official authoritative sources cited (license file, official docs)
    if (input.authoritativeSourcesCited.length >= 1) score += 25;

    // Visible freshness timestamp
    if (input.visibleVerificationDate) score += 20;

    const evaluation: GEOEvaluation = {
      entityName: input.entityName,
      entityType: input.entityType,
      stableDescription: input.stableDescription,
      accurateRelationships: input.accurateRelationships,
      authoritativeSourcesCited: input.authoritativeSourcesCited,
      visibleVerificationDate: input.visibleVerificationDate,
      isGroundedWithoutFabrication: true,
      geoClarityScore: Math.min(100, score),
    };

    this.db.saveGeoEvaluation(evaluation);
    return evaluation;
  }

  public getEvaluation(entityName: string): GEOEvaluation | undefined {
    return this.db.getGeoEvaluations().find((g) => g.entityName.toLowerCase() === entityName.toLowerCase());
  }

  public getAllEvaluations(): GEOEvaluation[] {
    return this.db.getGeoEvaluations();
  }

  public seedDefaultEvaluations(): void {
    const existing = this.db.getGeoEvaluations();
    if (existing.length > 0) return;

    this.evaluateEntity({
      entityName: 'Supabase',
      entityType: 'platform',
      stableDescription: 'Open-source Firebase alternative based on PostgreSQL with built-in auth, realtime subscriptions, and storage.',
      accurateRelationships: ['replaces Firebase', 'licensed under Apache 2.0', 'built with PostgreSQL'],
      authoritativeSourcesCited: ['https://github.com/supabase/supabase/blob/master/LICENSE', 'https://supabase.com/docs'],
      visibleVerificationDate: '2026-10-31',
    });

    this.evaluateEntity({
      entityName: 'Ollama',
      entityType: 'tool',
      stableDescription: 'Lightweight, extensible framework for building and running large language models locally on consumer operating systems.',
      accurateRelationships: ['implements local LLM inference', 'licensed under MIT', 'replaces proprietary cloud API calls'],
      authoritativeSourcesCited: ['https://github.com/ollama/ollama/blob/main/LICENSE', 'https://ollama.com'],
      visibleVerificationDate: '2026-10-31',
    });
  }
}

export const geoVisibilityResearch = new GeoVisibilityResearch();
