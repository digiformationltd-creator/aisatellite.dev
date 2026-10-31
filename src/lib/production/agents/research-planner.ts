/**
 * AI SATELLITE — AGENT A: RESEARCH PLANNER
 * Transforms approved article briefs into structured research tasks and key inquiry vectors.
 * Canonical Domain: https://aisatellite.dev
 */

import type { ArticleBrief } from '../../editorial/types';

export interface ResearchPlan {
  articleId: string;
  inquiryVectors: string[];
  requiredSourceCategories: string[];
  methodologyNotes: string;
  plannedAt: string;
}

export class ResearchPlannerAgent {
  public readonly name = 'Agent A — Research Planner';

  public planResearch(brief: ArticleBrief): ResearchPlan {
    const vectors = [
      ...brief.researchQuestions,
      `What are the verified minimum system and infrastructure requirements for ${brief.primaryKeyword}?`,
      `How does ${brief.topicCategory} impact operational overhead and capital expenditure?`,
    ];

    const sourceCategories = [
      'Official Documentation',
      'Technical Standard Specifications',
      'Audited Source Code Repositories',
    ];

    if (brief.geography !== 'Global') {
      sourceCategories.push(`Official Statutory Guidance for ${brief.geography}`);
    }

    return {
      articleId: brief.articleId,
      inquiryVectors: vectors,
      requiredSourceCategories: sourceCategories,
      methodologyNotes: `Methodology for ${brief.articleId}: Independent empirical validation with strict non-fabrication of unverified metrics.`,
      plannedAt: new Date().toISOString(),
    };
  }
}

export const researchPlannerAgent = new ResearchPlannerAgent();
