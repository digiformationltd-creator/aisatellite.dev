/**
 * AI Satellite — Module B: Global Technology Intelligence Monitor (Phase 10)
 * Tracks upstream software changes, monitors official documentation, releases, licenses,
 * pricing pages, and flags critical changes for human editorial review.
 */

import fs from 'node:fs';
import path from 'node:path';
import type { TechnologySourceChange, TechnologyChangeType } from './types';

export interface ExternalSourcePayload {
  resourceId: string;
  resourceName: string;
  sourceUrl: string;
  changeType: TechnologyChangeType;
  summary: string;
  previousValue?: string;
  newValue?: string;
}

export class TechnologyIntelligenceMonitor {
  private dataDir: string;
  private changesFile: string;
  private changes: Map<string, TechnologySourceChange> = new Map();

  constructor(customDataDir?: string) {
    this.dataDir = customDataDir || path.join(process.cwd(), 'data', 'operations');
    this.changesFile = path.join(this.dataDir, 'technology-changes.json');
    this.loadState();
  }

  private loadState(): void {
    try {
      if (fs.existsSync(this.changesFile)) {
        const raw = fs.readFileSync(this.changesFile, 'utf8');
        const list: TechnologySourceChange[] = JSON.parse(raw);
        list.forEach((c) => this.changes.set(c.id, c));
      }
    } catch {
      this.changes.clear();
    }
  }

  private persistState(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      fs.writeFileSync(this.changesFile, JSON.stringify(Array.from(this.changes.values()), null, 2), 'utf8');
    } catch {
      // Safe no-op
    }
  }

  /**
   * Validates external incoming data payloads according to strict schema rules.
   */
  public validateSourcePayload(payload: unknown): { valid: boolean; error?: string; data?: ExternalSourcePayload } {
    if (!payload || typeof payload !== 'object') {
      return { valid: false, error: 'Payload must be a non-null object' };
    }

    const p = payload as Record<string, unknown>;
    if (!p.resourceId || typeof p.resourceId !== 'string') {
      return { valid: false, error: 'Missing or invalid resourceId' };
    }
    if (!p.resourceName || typeof p.resourceName !== 'string') {
      return { valid: false, error: 'Missing or invalid resourceName' };
    }
    if (!p.sourceUrl || typeof p.sourceUrl !== 'string' || !p.sourceUrl.startsWith('https://')) {
      return { valid: false, error: 'sourceUrl must be a valid https URL' };
    }

    const validTypes: TechnologyChangeType[] = [
      'new_release',
      'deprecation',
      'license_change',
      'free_tier_change',
      'pricing_change',
      'api_change',
      'project_archival',
      'documentation_update',
      'security_advisory',
    ];

    if (!p.changeType || !validTypes.includes(p.changeType as TechnologyChangeType)) {
      return { valid: false, error: `Invalid changeType: ${p.changeType}` };
    }

    if (!p.summary || typeof p.summary !== 'string') {
      return { valid: false, error: 'Missing summary' };
    }

    return {
      valid: true,
      data: {
        resourceId: p.resourceId,
        resourceName: p.resourceName,
        sourceUrl: p.sourceUrl,
        changeType: p.changeType as TechnologyChangeType,
        summary: p.summary,
        previousValue: typeof p.previousValue === 'string' ? p.previousValue : undefined,
        newValue: typeof p.newValue === 'string' ? p.newValue : undefined,
      },
    };
  }

  /**
   * Ingests a validated software change event and flags high-impact events for editorial review.
   */
  public ingestChange(rawPayload: unknown): TechnologySourceChange {
    const validation = this.validateSourcePayload(rawPayload);
    if (!validation.valid || !validation.data) {
      throw new Error(`Invalid technology change payload: ${validation.error}`);
    }

    const data = validation.data;
    // Critical types (license, free-tier, pricing, archival) always require human review
    const criticalTypes: TechnologyChangeType[] = [
      'license_change',
      'free_tier_change',
      'pricing_change',
      'project_archival',
      'security_advisory',
    ];
    const requiresReview = criticalTypes.includes(data.changeType);

    const id = `CHG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const changeRecord: TechnologySourceChange = {
      id,
      resourceId: data.resourceId,
      resourceName: data.resourceName,
      changeType: data.changeType,
      sourceUrl: data.sourceUrl,
      detectedAt: new Date().toISOString(),
      summary: data.summary,
      previousValue: data.previousValue,
      newValue: data.newValue,
      requiresReview,
      isResolved: false,
    };

    this.changes.set(id, changeRecord);
    this.persistState();
    return changeRecord;
  }

  /**
   * Approves or marks a technology change as addressed by an authorized reviewer.
   */
  public reviewChange(id: string, reviewerId: string, resolutionNotes?: string): boolean {
    const record = this.changes.get(id);
    if (!record) return false;

    record.isResolved = true;
    record.reviewedBy = reviewerId;
    record.reviewedAt = new Date().toISOString();
    if (resolutionNotes) {
      record.summary = `${record.summary} [Reviewed: ${resolutionNotes}]`;
    }
    this.persistState();
    return true;
  }

  public getPendingReviews(): TechnologySourceChange[] {
    return Array.from(this.changes.values()).filter((c) => c.requiresReview && !c.isResolved);
  }

  public getAllChanges(): TechnologySourceChange[] {
    return Array.from(this.changes.values()).sort(
      (a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
    );
  }
}

export const technologyIntelligenceMonitor = new TechnologyIntelligenceMonitor();
