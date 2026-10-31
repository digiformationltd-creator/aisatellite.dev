/**
 * AI SATELLITE — SLO & RELIABILITY METRICS ENGINE
 * Measures Service Level Indicators (SLIs), tracks error budgets, and enforces Service Level Objectives (SLOs).
 */

import type { ServiceLevelObjective, SLIName } from './types';
import { reliabilityDb } from './database';

export class SloAndMetricsEngine {
  /**
   * Retrieves all defined SLOs with up-to-date compliance evaluations.
   */
  public getSloStatus(): ServiceLevelObjective[] {
    const slos = reliabilityDb.getData().slos;
    return slos.map((slo) => this.evaluateSlo(slo));
  }

  /**
   * Records a new observed measurement for a specific SLI.
   */
  public recordObservation(
    sliName: SLIName,
    observedValue: number
  ): ServiceLevelObjective {
    const slos = reliabilityDb.getData().slos;
    const index = slos.findIndex((s) => s.sliName === sliName);

    if (index === -1) {
      throw new Error(`SLI with name "${sliName}" is not registered in the catalog.`);
    }

    slos[index].observedValue = observedValue;
    const updated = this.evaluateSlo(slos[index]);
    slos[index] = updated;
    reliabilityDb.persist();

    return updated;
  }

  /**
   * Evaluates compliance and calculates remaining error budget.
   */
  private evaluateSlo(slo: ServiceLevelObjective): ServiceLevelObjective {
    let errorBudgetRemaining = 100.0;
    let status: 'COMPLIANT' | 'AT_RISK' | 'BREACHED' = 'COMPLIANT';

    if (slo.unit === '%') {
      if (slo.sliName === 'deployment_failure_rate') {
        // Lower is better (target is maximum allowed failure rate)
        const allowedBudget = slo.targetValue; // e.g. 2.0%
        const usedBudget = slo.observedValue;
        errorBudgetRemaining = Math.max(0, ((allowedBudget - usedBudget) / allowedBudget) * 100);

        if (slo.observedValue > slo.targetValue) {
          status = 'BREACHED';
        } else if (slo.observedValue > slo.targetValue * 0.7) {
          status = 'AT_RISK';
        } else {
          status = 'COMPLIANT';
        }
      } else {
        // Higher is better (e.g. 99.5% availability, 99.9% API success)
        const allowedUnavailability = 100.0 - slo.targetValue; // e.g., 0.5%
        const observedUnavailability = Math.max(0, 100.0 - slo.observedValue);
        errorBudgetRemaining = Math.max(0, ((allowedUnavailability - observedUnavailability) / allowedUnavailability) * 100);

        if (slo.observedValue < slo.targetValue) {
          status = 'BREACHED';
        } else if (errorBudgetRemaining < 25.0) {
          status = 'AT_RISK';
        } else {
          status = 'COMPLIANT';
        }
      }
    } else if (slo.unit === 'ms') {
      // Latency: Lower is better (target 250ms)
      if (slo.observedValue > slo.targetValue) {
        status = 'BREACHED';
        errorBudgetRemaining = 0;
      } else {
        errorBudgetRemaining = Math.max(0, ((slo.targetValue - slo.observedValue) / slo.targetValue) * 100);
        status = errorBudgetRemaining < 20.0 ? 'AT_RISK' : 'COMPLIANT';
      }
    } else if (slo.unit === 'hours') {
      // Freshness: Lower is better (target 24h)
      if (slo.observedValue > slo.targetValue) {
        status = 'BREACHED';
        errorBudgetRemaining = 0;
      } else {
        errorBudgetRemaining = Math.max(0, ((slo.targetValue - slo.observedValue) / slo.targetValue) * 100);
        status = errorBudgetRemaining < 20.0 ? 'AT_RISK' : 'COMPLIANT';
      }
    }

    return {
      ...slo,
      status,
      errorBudgetRemainingPercent: Number(errorBudgetRemaining.toFixed(1)),
    };
  }

  /**
   * Returns a high-level operational health score (0-100) based on all SLOs.
   */
  public calculateHealthScore(): { score: number; compliantCount: number; totalCount: number } {
    const slos = this.getSloStatus();
    const compliant = slos.filter((s) => s.status === 'COMPLIANT').length;
    const atRisk = slos.filter((s) => s.status === 'AT_RISK').length;

    // Weight compliant as 1.0, at-risk as 0.5, breached as 0.0
    const weightedSum = compliant * 1.0 + atRisk * 0.5;
    const score = Math.round((weightedSum / slos.length) * 100);

    return {
      score,
      compliantCount: compliant,
      totalCount: slos.length,
    };
  }
}

export const sloAndMetricsEngine = new SloAndMetricsEngine();
