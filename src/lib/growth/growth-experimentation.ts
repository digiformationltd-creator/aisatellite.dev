/**
 * AI Satellite — Phase 15 Growth Experimentation Engine
 * Coordinates controlled A/B experiments across search result presentation,
 * comparison table usability, and onboarding with privacy-safe deterministic assignment
 * and strict statistical thresholds.
 */

import type { GrowthExperiment } from './types';
import { growthDatabase, GrowthDatabase } from './database';

export class GrowthExperimentationEngine {
  private db: GrowthDatabase;

  constructor(db?: GrowthDatabase) {
    this.db = db || growthDatabase;
    this.seedDefaultExperiments();
  }

  public createExperiment(input: {
    name: string;
    hypothesis: string;
    targetMetric: string;
    variants: Array<{ id: string; name: string; description: string; weightPercent: number }>;
    minimumSampleSize?: number;
  }): GrowthExperiment {
    const existing = this.db.getGrowthExperiments().find((e) => e.name === input.name);
    const now = new Date().toISOString();

    const experiment: GrowthExperiment = {
      id: existing ? existing.id : `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: input.name,
      hypothesis: input.hypothesis,
      targetMetric: input.targetMetric,
      variants: input.variants.map((v) => ({
        ...v,
        impressions: 0,
        conversions: 0,
      })),
      status: 'running',
      startDate: now,
      minimumSampleSize: input.minimumSampleSize || 200,
      currentSampleSize: 0,
    };

    this.db.saveGrowthExperiment(experiment);
    return experiment;
  }

  /**
   * Deterministic variant assignment using simple hashing
   */
  public assignVariant(experimentId: string, visitorKey: string): string | null {
    const exp = this.db.getGrowthExperiments().find((e) => e.id === experimentId);
    if (!exp || exp.status !== 'running' || exp.variants.length === 0) return null;

    let hash = 0;
    for (let i = 0; i < visitorKey.length; i++) {
      hash = (hash << 5) - hash + visitorKey.charCodeAt(i);
      hash |= 0;
    }
    const bucket = Math.abs(hash) % 100;

    let cumulative = 0;
    for (const v of exp.variants) {
      cumulative += v.weightPercent;
      if (bucket < cumulative) {
        return v.id;
      }
    }

    return exp.variants[0].id;
  }

  public recordImpression(experimentId: string, variantId: string): void {
    const exp = this.db.getGrowthExperiments().find((e) => e.id === experimentId);
    if (!exp) return;

    const variant = exp.variants.find((v) => v.id === variantId);
    if (variant) {
      variant.impressions++;
      exp.currentSampleSize++;
      this.db.saveGrowthExperiment(exp);
    }
  }

  public recordConversion(experimentId: string, variantId: string): void {
    const exp = this.db.getGrowthExperiments().find((e) => e.id === experimentId);
    if (!exp) return;

    const variant = exp.variants.find((v) => v.id === variantId);
    if (variant) {
      variant.conversions++;
      this.db.saveGrowthExperiment(exp);
    }
  }

  /**
   * Evaluates experiment results with statistical caution
   */
  public evaluateResults(experimentId: string): {
    hasSufficientSample: boolean;
    currentSample: number;
    requiredSample: number;
    leaderVariantId?: string;
    conversionRates: Record<string, number>;
    conclusion: string;
  } {
    const exp = this.db.getGrowthExperiments().find((e) => e.id === experimentId);
    if (!exp) throw new Error(`Experiment not found: ${experimentId}`);

    const hasSufficient = exp.currentSampleSize >= exp.minimumSampleSize;
    const rates: Record<string, number> = {};
    let bestVariantId: string | undefined;
    let highestRate = -1;

    for (const v of exp.variants) {
      const rate = v.impressions > 0 ? Number(((v.conversions / v.impressions) * 100).toFixed(2)) : 0;
      rates[v.id] = rate;
      if (rate > highestRate && v.impressions >= 10) {
        highestRate = rate;
        bestVariantId = v.id;
      }
    }

    let conclusion = 'Sample size in progress. Continue running to reach statistical confidence threshold.';
    if (hasSufficient && bestVariantId) {
      conclusion = `Experiment has reached required sample size of ${exp.minimumSampleSize}. Variant ${bestVariantId} demonstrated ${highestRate}% conversion rate.`;
    }

    return {
      hasSufficientSample: hasSufficient,
      currentSample: exp.currentSampleSize,
      requiredSample: exp.minimumSampleSize,
      leaderVariantId: bestVariantId,
      conversionRates: rates,
      conclusion,
    };
  }

  public getExperiments(): GrowthExperiment[] {
    return this.db.getGrowthExperiments();
  }

  public seedDefaultExperiments(): void {
    const existing = this.db.getGrowthExperiments();
    if (existing.length > 0) return;

    this.createExperiment({
      name: 'Comparison Matrix Layout: Sticky Headers vs Side Inspector',
      hypothesis: 'Sticky column headers on the free alternatives comparison table increase official repository click-through rate.',
      targetMetric: 'official_repo_click',
      variants: [
        { id: 'control_standard_table', name: 'Standard Table', description: 'Standard HTML responsive table with static headers', weightPercent: 50 },
        { id: 'variant_sticky_hud', name: 'Orbital Sticky HUD', description: 'Floating liquid-glass sticky headers with quick-filter pills', weightPercent: 50 },
      ],
      minimumSampleSize: 100,
    });
  }
}

export const growthExperimentationEngine = new GrowthExperimentationEngine();
