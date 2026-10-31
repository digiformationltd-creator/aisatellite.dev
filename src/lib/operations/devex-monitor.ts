/**
 * AI Satellite — Module F: Developer Experience (DevEx) Monitor (Phase 10)
 * Collects and aggregates practical usability signals, zero-result search queries,
 * broken demo events, and interaction drop-offs with privacy-preserving tokenization.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { DevExIncident } from './types';

export class DevExMonitor {
  private dataDir: string;
  private devexFile: string;
  private incidents: Map<string, DevExIncident> = new Map();

  constructor(customDataDir?: string) {
    this.dataDir = customDataDir || path.join(process.cwd(), 'data', 'operations');
    this.devexFile = path.join(this.dataDir, 'devex-incidents.json');
    this.loadState();
  }

  private loadState(): void {
    try {
      if (fs.existsSync(this.devexFile)) {
        const raw = fs.readFileSync(this.devexFile, 'utf8');
        const list: DevExIncident[] = JSON.parse(raw);
        list.forEach((i) => this.incidents.set(i.id, i));
      }
    } catch {
      this.incidents.clear();
    }
  }

  private persistState(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      fs.writeFileSync(this.devexFile, JSON.stringify(Array.from(this.incidents.values()), null, 2), 'utf8');
    } catch {
      // Safe no-op
    }
  }

  /**
   * Sanitizes and hashes potentially sensitive query strings for privacy.
   */
  private sanitizeQuery(query: string): string {
    const trimmed = query.trim().toLowerCase();
    // Strip emails or potential secret keys
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) || /sk-[a-zA-Z0-9]{20,}/.test(trimmed)) {
      return `[REDACTED_SENSITIVE_INPUT_${crypto.createHash('sha256').update(trimmed).digest('hex').substring(0, 8)}]`;
    }
    return trimmed.substring(0, 60);
  }

  /**
   * Records a developer experience usability event with frequency aggregation.
   */
  public recordSignal(payload: {
    signalType: DevExIncident['signalType'];
    queryOrPath: string;
    description: string;
    proposedSolution?: string;
  }): DevExIncident {
    const safeTarget = this.sanitizeQuery(payload.queryOrPath);
    const dedupeKey = `${payload.signalType}:${safeTarget}`;

    const existing = Array.from(this.incidents.values()).find(
      (inc) => `${inc.signalType}:${inc.queryOrPath}` === dedupeKey && !inc.isResolved
    );

    if (existing) {
      existing.occurrenceCount += 1;
      existing.lastOccurredAt = new Date().toISOString();
      this.persistState();
      return existing;
    }

    const id = `DEVEX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const incident: DevExIncident = {
      id,
      signalType: payload.signalType,
      queryOrPath: safeTarget,
      occurrenceCount: 1,
      lastOccurredAt: new Date().toISOString(),
      description: payload.description,
      proposedSolution:
        payload.proposedSolution ||
        (payload.signalType === 'zero_result_search'
          ? `Research and catalog open-source alternatives matching search intent: "${safeTarget}"`
          : 'Inspect component rendering and verify error boundary fallback.'),
      isResolved: false,
    };

    this.incidents.set(id, incident);
    this.persistState();
    return incident;
  }

  public resolveIncident(id: string): boolean {
    const inc = this.incidents.get(id);
    if (!inc) return false;
    inc.isResolved = true;
    this.persistState();
    return true;
  }

  public getUnresolvedIncidents(): DevExIncident[] {
    return Array.from(this.incidents.values())
      .filter((i) => !i.isResolved)
      .sort((a, b) => b.occurrenceCount - a.occurrenceCount);
  }

  public getAllIncidents(): DevExIncident[] {
    return Array.from(this.incidents.values()).sort(
      (a, b) => new Date(b.lastOccurredAt).getTime() - new Date(a.lastOccurredAt).getTime()
    );
  }
}

export const devExMonitor = new DevExMonitor();
