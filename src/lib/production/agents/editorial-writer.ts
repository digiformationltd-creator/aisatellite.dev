/**
 * AI SATELLITE — AGENT F: EDITORIAL WRITER
 * Orchestrates outline generation and transforms research evidence into a professional long-form draft.
 * Canonical Domain: https://aisatellite.dev
 */

import type { ArticleBrief } from '../../editorial/types';
import type { ArticleDraft, ArticleOutline } from '../types';
import { articleOutlineGenerator } from '../outline-generator';
import { writingEngine } from '../writing-engine';

export class EditorialWriterAgent {
  public readonly name = 'Agent F — Editorial Writer';

  public createOutline(brief: ArticleBrief): ArticleOutline {
    return articleOutlineGenerator.generateOutline(brief);
  }

  public draftArticle(brief: ArticleBrief, outline: ArticleOutline): ArticleDraft {
    return writingEngine.generateDraft(brief, outline);
  }
}

export const editorialWriterAgent = new EditorialWriterAgent();
