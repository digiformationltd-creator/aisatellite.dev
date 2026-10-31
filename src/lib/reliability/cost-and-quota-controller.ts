/**
 * AI SATELLITE — COST & QUOTA PROTECTION CONTROLLER
 * Tracks cloud infrastructure usage against defined budget caps and implements automated circuit breakers.
 */

import type { CostSensitiveService } from './types';
import { reliabilityDb } from './database';

export class CostAndQuotaController {
  /**
   * Retrieves all monitored cost-sensitive services and their quota status.
   */
  public getQuotaStatus(): CostSensitiveService[] {
    return reliabilityDb.getData().costQuotas;
  }

  /**
   * Records newly observed usage for a specific cloud service and evaluates circuit breakers.
   */
  public recordUsage(
    serviceName: string,
    additionalUsage: number
  ): {
    service: CostSensitiveService;
    usagePercent: number;
    isCircuitBreakerTripped: boolean;
    recommendation?: string;
  } {
    const store = reliabilityDb.getData();
    const service = store.costQuotas.find((s) => s.service.toLowerCase().includes(serviceName.toLowerCase()));

    if (!service) {
      throw new Error(`Service "${serviceName}" not found in quota monitor.`);
    }

    service.observedMonthlyUsage += additionalUsage;
    reliabilityDb.persist();

    const usagePercent = Number(((service.observedMonthlyUsage / service.monthlyLimit) * 100).toFixed(1));
    const isCircuitBreakerTripped = usagePercent >= service.circuitBreakerThresholdPercent;

    let recommendation: string | undefined;
    if (usagePercent >= 90.0) {
      recommendation = `CRITICAL: ${service.service} has reached ${usagePercent}% of monthly budget. Suspend non-critical background jobs immediately.`;
    } else if (usagePercent >= service.circuitBreakerThresholdPercent) {
      recommendation = `WARNING: ${service.service} has crossed the ${service.circuitBreakerThresholdPercent}% circuit breaker threshold.`;
    }

    return {
      service,
      usagePercent,
      isCircuitBreakerTripped,
      recommendation,
    };
  }

  /**
   * Evaluates whether non-critical background tasks should be throttled or suspended.
   */
  public shouldSuspendNonCriticalJobs(): boolean {
    const quotas = this.getQuotaStatus();
    return quotas.some((q) => (q.observedMonthlyUsage / q.monthlyLimit) * 100 >= 90.0);
  }
}

export const costAndQuotaController = new CostAndQuotaController();
