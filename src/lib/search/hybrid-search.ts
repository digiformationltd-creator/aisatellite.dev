import { type TechnologyResource, type SearchIntent } from '../radar/schemas';
import { radarStore } from '../radar/radar-store';
import { intentClassifier, type IntentClassificationResult } from './intent-classifier';
import { searchSecurityGuard } from '../security/search-security';

export interface SearchFilterOptions {
  category?: string;
  selfHostedOnly?: boolean;
  pricing?: string;
  license?: string;
}

export interface ScoredSearchResult {
  resource: TechnologyResource;
  score: number;
  matchReasons: string[];
  isAlternativeMatch: boolean;
}

export interface HybridSearchResponse {
  query: string;
  intentResult: IntentClassificationResult;
  results: ScoredSearchResult[];
  totalMatches: number;
  isSemanticEnabled: boolean;
  latencyMs: number;
}

export class HybridSearchEngine {
  private semanticProviderConfigured: boolean = false;

  constructor() {
    // Detect optional provider agnostic embeddings (e.g. env var)
    this.semanticProviderConfigured = Boolean(process.env.OPENAI_API_KEY || process.env.VECTOR_SEARCH_ENDPOINT);
  }

  /**
   * Primary Hybrid Retrieval Pipeline.
   */
  public search(query: string, filters?: SearchFilterOptions): HybridSearchResponse {
    const startTime = Date.now();
    const { cleanQuery } = searchSecurityGuard.sanitizeSearchQuery(query);

    // 1. Classify Intent
    const intentResult = intentClassifier.classify(cleanQuery);
    const resources = radarStore.getAllResources();

    const scoredItems: ScoredSearchResult[] = [];
    const queryTokens = cleanQuery.toLowerCase().split(/\s+/).filter(Boolean);

    for (const res of resources) {
      let score = 0;
      const matchReasons: string[] = [];
      let isAlternativeMatch = false;

      // --- Layer 2: Structured Filtering ---
      if (filters?.category && !res.categories.includes(filters.category)) {
        continue;
      }
      if (filters?.selfHostedOnly && !res.selfHosted) {
        continue;
      }
      if (filters?.pricing && !res.pricingClassification.includes(filters.pricing as any)) {
        continue;
      }
      if (filters?.license && res.license?.toLowerCase() !== filters.license.toLowerCase()) {
        continue;
      }

      // --- Layer 1: Keyword Scoring ---
      const titleLower = res.title.toLowerCase();
      const descLower = res.description.toLowerCase();
      const tagsLower = res.tags.map((t) => t.toLowerCase());
      const replacesLower = (res.replaces || []).map((r) => r.toLowerCase());

      // Exact title match
      if (titleLower === cleanQuery.toLowerCase()) {
        score += 100;
        matchReasons.push('Exact title match');
      } else if (titleLower.includes(cleanQuery.toLowerCase())) {
        score += 60;
        matchReasons.push('Title match');
      }

      // Direct replacement match (e.g. searching "Zapier" matches n8n)
      for (const entity of intentResult.extractedEntities) {
        if (replacesLower.some((r) => r.includes(entity) || entity.includes(r))) {
          score += 85;
          isAlternativeMatch = true;
          matchReasons.push(`Direct verified alternative to ${entity}`);
        }
      }

      for (const token of queryTokens) {
        if (titleLower.includes(token)) score += 15;
        if (tagsLower.includes(token)) score += 10;
        if (descLower.includes(token)) score += 5;
        if (replacesLower.some((r) => r.includes(token))) {
          score += 25;
          isAlternativeMatch = true;
        }
      }

      // --- Layer 3: Semantic Retrieval (Local TF-IDF / Term overlap) ---
      const combinedText = `${res.title} ${res.description} ${res.tags.join(' ')} ${res.categories.join(' ')}`.toLowerCase();
      let termOverlapCount = 0;
      for (const token of queryTokens) {
        if (combinedText.includes(token)) termOverlapCount++;
      }
      if (queryTokens.length > 0) {
        const overlapRatio = termOverlapCount / queryTokens.length;
        score += overlapRatio * 20;
      }

      // --- Layer 4: Intent-Based Ranking Boosts ---
      if (intentResult.intent === 'find_alternative' && (isAlternativeMatch || res.categories.includes('free-saas-alternatives'))) {
        score += 35;
      }
      if (intentResult.intent === 'find_ai_tool' && (res.kind === 'ai_tool' || res.categories.includes('ai-models'))) {
        score += 30;
      }
      if (intentResult.intent === 'find_open_source' && res.pricingClassification.includes('open_source')) {
        score += 25;
      }

      // Status bonus: Verified resources score higher than pending
      if (res.verificationStatus === 'verified') {
        score += 15;
      }

      if (score > 0 || queryTokens.length === 0) {
        scoredItems.push({
          resource: res,
          score: Math.round(score),
          matchReasons,
          isAlternativeMatch,
        });
      }
    }

    // Sort by deterministic rank score descending
    scoredItems.sort((a, b) => b.score - a.score || a.resource.title.localeCompare(b.resource.title));

    const latencyMs = Date.now() - startTime;

    return {
      query: cleanQuery,
      intentResult,
      results: scoredItems,
      totalMatches: scoredItems.length,
      isSemanticEnabled: this.semanticProviderConfigured,
      latencyMs,
    };
  }
}

export const hybridSearchEngine = new HybridSearchEngine();
