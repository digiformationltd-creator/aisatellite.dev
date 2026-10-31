/**
 * AI SATELLITE — AGENT K: EDITORIAL QUALITY CONTROLLER
 * Evaluates completeness, originality, and scores drafts against the 11-dimension quality rubric.
 * Canonical Domain: https://aisatellite.dev
 */

import type { ArticleBrief } from '../../editorial/types';
import type { ArticleDraft, EditorialQualityRubric, DuplicationCheckResult } from '../types';
import { editorialQualityEngine } from '../quality-rubric';

export class EditorialQualityAgent {
  public readonly name = 'Agent K — Editorial Quality Controller';

  public assessQuality(
    brief: ArticleBrief,
    draft: ArticleDraft
  ): {
    qualityRubric: EditorialQualityRubric;
    duplicationCheck: DuplicationCheckResult;
  } {
    const qualityRubric = editorialQualityEngine.evaluateDraft(brief, draft, this.name);
    const duplicationCheck = editorialQualityEngine.checkDuplication(
      draft.title,
      draft.slug,
      brief.primaryKeyword
    );

    return {
      qualityRubric,
      duplicationCheck,
    };
  }
}

export const editorialQualityAgent = new EditorialQualityAgent();
