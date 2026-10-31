/**
 * AI SATELLITE — AGENT J: COMMERCIAL RELEVANCE REVIEWER
 * Evaluates contextual recommendations for DigiFormation and Digi Biz OS with strict statutory disclosures.
 * Canonical Domain: https://aisatellite.dev
 */

import type { ArticleBrief } from '../../editorial/types';
import type { ArticleDraft, CommercialReviewResult } from '../types';
import { commercialRelevance } from '../commercial-relevance';

export class CommercialRelevanceAgent {
  public readonly name = 'Agent J — Commercial Relevance Reviewer';

  public reviewCommercialAspects(brief: ArticleBrief, draft: ArticleDraft): CommercialReviewResult {
    const hasCta = Boolean(draft.commercialCtaPlacement);
    return commercialRelevance.reviewCommercialContent({
      category: brief.topicCategory,
      hasCommercialCta: hasCta,
      partner:
        draft.commercialCtaPlacement?.partner === 'digiformation' ||
        draft.commercialCtaPlacement?.partner === 'digibizos'
          ? draft.commercialCtaPlacement.partner
          : undefined,
      destinationUrl: draft.commercialCtaPlacement?.destinationUrl,
      disclosureText: draft.commercialCtaPlacement?.disclosure,
      contentBody: draft.rawMdxContent,
    });
  }
}

export const commercialRelevanceAgent = new CommercialRelevanceAgent();
