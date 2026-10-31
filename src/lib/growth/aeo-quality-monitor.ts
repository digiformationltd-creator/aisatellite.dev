/**
 * AI Satellite — Phase 15 Advanced Answer Engine Optimization (AEO) Monitor
 * Evaluates technical pages for direct-answer extraction readiness: clear definitions,
 * structured troubleshooting, code examples, explicit limitations, and schema validity.
 */

import type { AEOEvaluation } from './types';
import { growthDatabase, GrowthDatabase } from './database';

export class AeoQualityMonitor {
  private db: GrowthDatabase;

  constructor(db?: GrowthDatabase) {
    this.db = db || growthDatabase;
    this.seedDefaultEvaluations();
  }

  /**
   * Evaluates content attributes for AEO readiness
   */
  public evaluatePageContent(input: {
    pageUrl: string;
    hasDirectAnswerDefinition: boolean;
    hasStructuredTroubleshooting: boolean;
    hasVerifiedCodeExample: boolean;
    hasExplicitLimitations: boolean;
    schemaTypesPresent: string[];
  }): AEOEvaluation {
    let score = 0;
    const recommendations: string[] = [];

    if (input.hasDirectAnswerDefinition) {
      score += 30;
    } else {
      recommendations.push('Add an executive direct-answer definition paragraph within the first 150 words.');
    }

    if (input.hasVerifiedCodeExample) {
      score += 25;
    } else {
      recommendations.push('Include a copyable, verified CLI command or code snippet illustrating implementation.');
    }

    if (input.hasExplicitLimitations) {
      score += 20;
    } else {
      recommendations.push('Document explicit hardware, pricing, or self-hosting limitations for technical honesty.');
    }

    if (input.hasStructuredTroubleshooting) {
      score += 15;
    }

    if (input.schemaTypesPresent.length > 0) {
      score += 10;
    } else {
      recommendations.push('Attach structured JSON-LD schema (TechArticle, HowTo, or SoftwareApplication).');
    }

    const evaluation: AEOEvaluation = {
      pageUrl: input.pageUrl,
      hasDirectAnswerDefinition: input.hasDirectAnswerDefinition,
      hasStructuredTroubleshooting: input.hasStructuredTroubleshooting,
      hasVerifiedCodeExample: input.hasVerifiedCodeExample,
      hasExplicitLimitations: input.hasExplicitLimitations,
      schemaTypesPresent: input.schemaTypesPresent,
      questionFramingScore: Math.min(100, score),
      overallAEOScore: Math.min(100, score),
      recommendations,
    };

    this.db.saveAeoEvaluation(evaluation);
    return evaluation;
  }

  public getEvaluation(pageUrl: string): AEOEvaluation | undefined {
    return this.db.getAeoEvaluations().find((e) => e.pageUrl === pageUrl);
  }

  public getAllEvaluations(): AEOEvaluation[] {
    return this.db.getAeoEvaluations();
  }

  public seedDefaultEvaluations(): void {
    const existing = this.db.getAeoEvaluations();
    if (existing.length > 0) return;

    this.evaluatePageContent({
      pageUrl: '/alternatives/zapier-alternatives',
      hasDirectAnswerDefinition: true,
      hasStructuredTroubleshooting: true,
      hasVerifiedCodeExample: true,
      hasExplicitLimitations: true,
      schemaTypesPresent: ['TechArticle', 'SoftwareApplication'],
    });

    this.evaluatePageContent({
      pageUrl: '/tutorials/ollama-local-llm-guide',
      hasDirectAnswerDefinition: true,
      hasStructuredTroubleshooting: true,
      hasVerifiedCodeExample: true,
      hasExplicitLimitations: true,
      schemaTypesPresent: ['HowTo', 'TechArticle'],
    });
  }
}

export const aeoQualityMonitor = new AeoQualityMonitor();
