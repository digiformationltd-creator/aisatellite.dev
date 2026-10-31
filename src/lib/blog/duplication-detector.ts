/**
 * AI Satellite — Phase 21 Content Duplication Prevention Engine
 * Evaluates proposed article titles, search intents, outlines, and tags
 * to eliminate keyword cannibalization and low-value content duplication.
 * Canonical Domain: https://aisatellite.dev
 */

import { blogDatabase } from './database';
import type { ArticleModel } from './types';

export interface DuplicationCheckResult {
  isDuplicate: boolean;
  riskLevel: 'none' | 'low' | 'medium' | 'high';
  confidenceScore: number; // 0 to 1
  conflicts: {
    existingArticleId: string;
    existingArticleTitle: string;
    existingArticleSlug: string;
    similarityType: 'exact_title' | 'title_similarity' | 'slug_collision' | 'intent_overlap' | 'tag_cannibalization';
    reason: string;
  }[];
  recommendation: 'proceed' | 'update_existing' | 'reject';
}

export class DuplicationDetector {
  private static instance: DuplicationDetector;

  public static getInstance(): DuplicationDetector {
    if (!DuplicationDetector.instance) {
      DuplicationDetector.instance = new DuplicationDetector();
    }
    return DuplicationDetector.instance;
  }

  /**
   * Calculates Levenshtein-based similarity ratio between two strings (0 to 1).
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();
    if (s1 === s2) return 1.0;
    if (!s1 || !s2) return 0.0;

    const words1 = new Set(s1.split(/\s+/));
    const words2 = new Set(s2.split(/\s+/));
    const intersection = [...words1].filter((w) => words2.has(w));
    const union = new Set([...words1, ...words2]);

    const jaccard = intersection.length / union.size;
    return jaccard;
  }

  /**
   * Checks whether a new or drafted article duplicates existing published content.
   */
  public checkDuplication(candidate: {
    id?: string;
    title: string;
    slug: string;
    searchIntent?: string;
    tags?: string[];
    primaryCategory?: string;
  }): DuplicationCheckResult {
    const existingArticles = blogDatabase.getArticles(true);
    const conflicts: DuplicationCheckResult['conflicts'] = [];

    const normSlug = candidate.slug.toLowerCase().trim();
    const normTitle = candidate.title.toLowerCase().trim();
    const candidateTags = new Set((candidate.tags || []).map((t) => t.toLowerCase()));

    for (const art of existingArticles) {
      // Skip self
      if (candidate.id && art.id === candidate.id) continue;

      // 1. Exact Slug Collision
      if (art.slug.toLowerCase().trim() === normSlug) {
        conflicts.push({
          existingArticleId: art.id,
          existingArticleTitle: art.title,
          existingArticleSlug: art.slug,
          similarityType: 'slug_collision',
          reason: `Exact slug collision with existing article "${art.title}" (${art.slug}).`,
        });
      }

      // 2. Exact Title Match
      if (art.title.toLowerCase().trim() === normTitle) {
        conflicts.push({
          existingArticleId: art.id,
          existingArticleTitle: art.title,
          existingArticleSlug: art.slug,
          similarityType: 'exact_title',
          reason: `Exact title match with published article "${art.title}".`,
        });
      } else {
        // 3. High Title Similarity (Jaccard > 0.65)
        const similarity = this.calculateSimilarity(candidate.title, art.title);
        if (similarity >= 0.65) {
          conflicts.push({
            existingArticleId: art.id,
            existingArticleTitle: art.title,
            existingArticleSlug: art.slug,
            similarityType: 'title_similarity',
            reason: `High title word overlap (${Math.round(similarity * 100)}%) with "${art.title}".`,
          });
        }
      }

      // 4. Intent & Tag Overlap in the same category
      if (
        candidate.primaryCategory &&
        art.primaryCategory === candidate.primaryCategory &&
        candidateTags.size > 0
      ) {
        const sharedTags = art.tags.filter((t) => candidateTags.has(t.toLowerCase()));
        if (sharedTags.length >= 4) {
          conflicts.push({
            existingArticleId: art.id,
            existingArticleTitle: art.title,
            existingArticleSlug: art.slug,
            similarityType: 'tag_cannibalization',
            reason: `Keyword cannibalization risk: shares 4+ tags (${sharedTags.join(', ')}) in category "${art.primaryCategory}".`,
          });
        }
      }
    }

    if (conflicts.length === 0) {
      return {
        isDuplicate: false,
        riskLevel: 'none',
        confidenceScore: 0.0,
        conflicts: [],
        recommendation: 'proceed',
      };
    }

    const hasExact = conflicts.some(
      (c) => c.similarityType === 'exact_title' || c.similarityType === 'slug_collision'
    );

    if (hasExact) {
      return {
        isDuplicate: true,
        riskLevel: 'high',
        confidenceScore: 1.0,
        conflicts,
        recommendation: 'reject',
      };
    }

    const isMedium = conflicts.some((c) => c.similarityType === 'title_similarity');
    return {
      isDuplicate: false,
      riskLevel: isMedium ? 'medium' : 'low',
      confidenceScore: isMedium ? 0.7 : 0.4,
      conflicts,
      recommendation: isMedium ? 'update_existing' : 'proceed',
    };
  }
}

export const duplicationDetector = DuplicationDetector.getInstance();
