/**
 * AI SATELLITE — AGENT I: RESOURCE RECOMMENDATION ANALYST
 * Recommends verified free developer tools and validates internal links across AI Satellite directories.
 * Canonical Domain: https://aisatellite.dev
 */

import type { ArticleBrief } from '../../editorial/types';
import type { ArticleDraft } from '../types';
import { internalLinkingAgent, type InternalLinkValidationResult } from '../internal-linking';

export class ResourceRecommendationAgent {
  public readonly name = 'Agent I — Resource Recommendation Analyst';

  public evaluateResources(
    brief: ArticleBrief,
    draft: ArticleDraft
  ): {
    recommendedFreeTools: string[];
    internalLinkValidation: InternalLinkValidationResult;
  } {
    const recommendedFreeTools = internalLinkingAgent.recommendFreeResources(
      brief.topicCategory,
      [brief.primaryKeyword, ...brief.supportingKeywords]
    );

    const internalLinkValidation = internalLinkingAgent.validateInternalLinks(
      draft.suggestedInternalLinks
    );

    return {
      recommendedFreeTools,
      internalLinkValidation,
    };
  }
}

export const resourceRecommendationAgent = new ResourceRecommendationAgent();
