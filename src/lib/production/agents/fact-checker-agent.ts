/**
 * AI SATELLITE — AGENT G: FACT CHECKER
 * Rigorous fact-checking against the Source Evidence Ledger and detection of conflicting claims.
 * Canonical Domain: https://aisatellite.dev
 */

import type { ArticleBrief } from '../../editorial/types';
import type { ArticleDraft } from '../types';
import { factCheckingEngine, type FactCheckReport } from '../fact-checker';

export class FactCheckerAgent {
  public readonly name = 'Agent G — Fact Checker';

  public auditFacts(brief: ArticleBrief, draft: ArticleDraft): FactCheckReport {
    return factCheckingEngine.auditDraft(brief, draft);
  }
}

export const factCheckerAgent = new FactCheckerAgent();
