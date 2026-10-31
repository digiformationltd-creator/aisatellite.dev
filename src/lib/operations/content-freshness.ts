/**
 * AI Satellite — Module D: Content Freshness Intelligence Engine (Phase 10)
 * Evaluates staleness across the 11 managed technical content types, generates evidence-backed
 * update proposals, and enforces editorial approval before publication.
 */

import fs from 'node:fs';
import path from 'node:path';
import type { ContentFreshnessRecord, ManagedContentType } from './types';

export class ContentFreshnessEngine {
  private dataDir: string;
  private freshnessFile: string;
  private records: Map<string, ContentFreshnessRecord> = new Map();

  constructor(customDataDir?: string) {
    this.dataDir = customDataDir || path.join(process.cwd(), 'data', 'operations');
    this.freshnessFile = path.join(this.dataDir, 'content-freshness.json');
    this.loadState();
  }

  private loadState(): void {
    try {
      if (fs.existsSync(this.freshnessFile)) {
        const raw = fs.readFileSync(this.freshnessFile, 'utf8');
        const list: ContentFreshnessRecord[] = JSON.parse(raw);
        list.forEach((r) => this.records.set(r.id, r));
      } else {
        this.seedInitialContent();
      }
    } catch {
      this.seedInitialContent();
    }
  }

  private seedInitialContent(): void {
    const initial: ContentFreshnessRecord[] = [
      {
        id: 'cnt-zapier-alternatives',
        contentSlug: 'zapier-alternatives',
        contentType: 'free_alternative',
        title: 'Best Free and Open-Source Alternatives to Zapier',
        lastAuditedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
        daysStale: 45,
        isOutdated: true,
        evidenceUrls: ['https://n8n.io/pricing', 'https://github.com/activepieces/activepieces'],
        proposedChanges: ['Verify Activepieces v0.30 release features', 'Update n8n community edition limitations'],
        changeHistory: [
          {
            timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            editor: 'LeadTechnicalEditor-Sarah',
            summary: 'Initial comprehensive comparison matrix verified with primary sources.',
          },
        ],
        status: 'review_required',
      },
      {
        id: 'cnt-threejs-radar-tutorial',
        contentSlug: 'building-orbital-3d-radar-threejs-astro',
        contentType: 'coding_tutorial',
        title: 'Building an Orbital 3D Technology Radar with Three.js and Astro',
        lastAuditedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        daysStale: 10,
        isOutdated: false,
        evidenceUrls: ['https://threejs.org/docs/'],
        proposedChanges: [],
        changeHistory: [
          {
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            editor: 'LeadTechnicalEditor-Marcus',
            summary: 'Verified Three.js r174 WebGL context restoration tests.',
          },
        ],
        status: 'current',
      },
      {
        id: 'cnt-local-rag-solution',
        contentSlug: 'local-rag-ai-search-ollama-chroma',
        contentType: 'automation_workflow',
        title: 'Completely Offline Local RAG AI Search Architecture',
        lastAuditedAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
        daysStale: 65,
        isOutdated: true,
        evidenceUrls: ['https://ollama.com/library', 'https://docs.trychroma.com/'],
        proposedChanges: ['Verify Ollama 0.5 context window parameters', 'Add Python 3.12 compatibility notes'],
        changeHistory: [],
        status: 'proposal_pending',
      },
    ];

    initial.forEach((i) => this.records.set(i.id, i));
    this.persistState();
  }

  private persistState(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      fs.writeFileSync(this.freshnessFile, JSON.stringify(Array.from(this.records.values()), null, 2), 'utf8');
    } catch {
      // Safe no-op
    }
  }

  /**
   * Scans content to calculate staleness according to volatility and threshold.
   */
  public auditFreshness(thresholdDays: number = 30): ContentFreshnessRecord[] {
    const now = Date.now();
    const staleItems: ContentFreshnessRecord[] = [];

    this.records.forEach((record) => {
      const auditedTime = new Date(record.lastAuditedAt).getTime();
      const diffDays = Math.floor((now - auditedTime) / (1000 * 60 * 60 * 24));
      record.daysStale = diffDays;
      record.isOutdated = diffDays >= thresholdDays;

      if (record.isOutdated && record.status === 'current') {
        record.status = 'review_required';
      }

      if (record.isOutdated) {
        staleItems.push(record);
      }
    });

    this.persistState();
    return staleItems;
  }

  /**
   * Proposes an update to an outdated technical content item.
   */
  public proposeContentUpdate(id: string, proposedChanges: string[], evidenceUrls: string[]): ContentFreshnessRecord {
    const record = this.records.get(id);
    if (!record) {
      throw new Error(`Content item ${id} not found`);
    }

    record.proposedChanges = proposedChanges;
    record.evidenceUrls = Array.from(new Set([...record.evidenceUrls, ...evidenceUrls]));
    record.status = 'proposal_pending';
    this.persistState();
    return record;
  }

  /**
   * Applies approved update with human editor signature and records historical edit log.
   */
  public applyApprovedUpdate(id: string, editorSignature: string, changeSummary: string): boolean {
    if (!editorSignature.startsWith('LeadTechnicalEditor-')) {
      throw new Error('Content updates require human LeadTechnicalEditor authorization signature');
    }

    const record = this.records.get(id);
    if (!record) return false;

    record.lastAuditedAt = new Date().toISOString();
    record.daysStale = 0;
    record.isOutdated = false;
    record.status = 'current';
    record.proposedChanges = [];

    record.changeHistory.unshift({
      timestamp: new Date().toISOString(),
      editor: editorSignature,
      summary: changeSummary,
    });

    this.persistState();
    return true;
  }

  public getAllRecords(): ContentFreshnessRecord[] {
    return Array.from(this.records.values()).sort((a, b) => b.daysStale - a.daysStale);
  }
}

export const contentFreshnessEngine = new ContentFreshnessEngine();
