/**
 * AI SATELLITE — AGENT H: SEO / AEO / GEO REVIEWER
 * Audits search discoverability, direct answer readiness, and generative grounding without keyword stuffing.
 * Canonical Domain: https://aisatellite.dev
 */

import type { ArticleBrief } from '../../editorial/types';
import type { ArticleDraft, SeoReviewResult, AeoGeoReviewResult } from '../types';
import { seoAeoGeoReviewer } from '../seo-aeo-geo-reviewer';

export class SeoAeoGeoReviewerAgent {
  public readonly name = 'Agent H — SEO/AEO/GEO Reviewer';

  public performReview(
    brief: ArticleBrief,
    draft: ArticleDraft
  ): { seo: SeoReviewResult; aeoGeo: AeoGeoReviewResult } {
    const seo = seoAeoGeoReviewer.reviewSeo(brief, draft);
    const aeoGeo = seoAeoGeoReviewer.reviewAeoGeo(draft);

    return { seo, aeoGeo };
  }
}

export const seoAeoGeoReviewerAgent = new SeoAeoGeoReviewerAgent();
