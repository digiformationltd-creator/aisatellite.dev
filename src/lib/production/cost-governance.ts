/**
 * AI SATELLITE — PHASE 23 EDITORIAL COST GOVERNANCE
 * Enforces token limits, monthly financial budgets, alerts, and automatic circuit breakers.
 * Canonical Domain: https://aisatellite.dev
 */

import type { CostBudgetGovernance } from './types';

export class CostGovernanceManager {
  private static instance: CostGovernanceManager;

  private governance: CostBudgetGovernance = {
    monthlyBudgetUsd: 150.0,
    currentSpendUsd: 0.0,
    tokensUsedTotal: 0,
    maxCostPerArticleUsd: 0.5,
    isBudgetExceeded: false,
    isPaused: false,
    alertThresholdPercent: 80, // Alert at 80% of budget
    alertsSent: [],
  };

  public static getInstance(): CostGovernanceManager {
    if (!CostGovernanceManager.instance) {
      CostGovernanceManager.instance = new CostGovernanceManager();
    }
    return CostGovernanceManager.instance;
  }

  public getStatus(): CostBudgetGovernance {
    return { ...this.governance };
  }

  /**
   * Records token and financial usage for an operation.
   * Throws an error or pauses operations if budget limits are breached.
   */
  public recordUsage(tokens: number, costUsd: number, operationDescription: string): { allowed: boolean; alertTriggered?: string } {
    if (this.governance.isPaused) {
      return { allowed: false, alertTriggered: 'OPERATIONS_PAUSED_BUDGET_REACHED' };
    }

    this.governance.tokensUsedTotal += tokens;
    this.governance.currentSpendUsd = Number((this.governance.currentSpendUsd + costUsd).toFixed(4));

    let alertTriggered: string | undefined;

    // Check alert threshold
    const percentUsed = (this.governance.currentSpendUsd / this.governance.monthlyBudgetUsd) * 100;
    if (percentUsed >= this.governance.alertThresholdPercent && !this.governance.alertsSent.includes('THRESHOLD_80_PERCENT')) {
      alertTriggered = `Warning: Spend reached ${percentUsed.toFixed(1)}% of monthly budget ($${this.governance.currentSpendUsd} / $${this.governance.monthlyBudgetUsd}).`;
      this.governance.alertsSent.push('THRESHOLD_80_PERCENT');
    }

    // Check circuit breaker limit
    if (this.governance.currentSpendUsd >= this.governance.monthlyBudgetUsd) {
      this.governance.isBudgetExceeded = true;
      this.governance.isPaused = true;
      alertTriggered = `Circuit Breaker: Monthly budget of $${this.governance.monthlyBudgetUsd} reached. AI production operations paused.`;
      this.governance.alertsSent.push('BUDGET_EXCEEDED');
      return { allowed: false, alertTriggered };
    }

    return { allowed: true, alertTriggered };
  }

  /**
   * Validates if a proposed article generation is within per-article cost bounds.
   */
  public validateArticleCostPrecheck(estimatedCost: number): boolean {
    if (this.governance.isPaused) return false;
    return estimatedCost <= this.governance.maxCostPerArticleUsd;
  }

  public setMonthlyBudget(newBudget: number): void {
    this.governance.monthlyBudgetUsd = newBudget;
    this.governance.isBudgetExceeded = this.governance.currentSpendUsd >= newBudget;
    if (!this.governance.isBudgetExceeded) {
      this.governance.isPaused = false;
    }
  }

  public resetSpendForNewMonth(): void {
    this.governance.currentSpendUsd = 0.0;
    this.governance.tokensUsedTotal = 0;
    this.governance.isBudgetExceeded = false;
    this.governance.isPaused = false;
    this.governance.alertsSent = [];
  }

  public pauseOperations(reason = 'Manual administrative pause'): void {
    this.governance.isPaused = true;
    this.governance.alertsSent.push(`MANUAL_PAUSE: ${reason}`);
  }

  public resumeOperations(): void {
    if (this.governance.currentSpendUsd < this.governance.monthlyBudgetUsd) {
      this.governance.isPaused = false;
      this.governance.isBudgetExceeded = false;
    }
  }
}

export const costGovernance = CostGovernanceManager.getInstance();
