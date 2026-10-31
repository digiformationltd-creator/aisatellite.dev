/**
 * AI Satellite — Autonomous Discovery Database Layer (Phase 14)
 * Relational storage engine for approved sources, discovery jobs,
 * GitHub intelligence, AI tools, free alternatives, changes, evidence ledger,
 * knowledge graph, and editorial proposals.
 * Backed by data/discovery/discovery-store.json.
 */

import fs from 'node:fs';
import path from 'node:path';
import type {
  TechnologySource,
  DiscoveryJob,
  GitHubIntelligenceRecord,
  AiToolProfile,
  FreeAlternativeFinding,
  TechnologyChangeEvent,
  ClaimEvidence,
  KnowledgeGraphNode,
  KnowledgeGraphEdge,
  EditorialProposal,
  RadarTelemetryEntry,
} from './types';

export interface DiscoveryStoreSchema {
  sources: TechnologySource[];
  jobs: DiscoveryJob[];
  githubRecords: GitHubIntelligenceRecord[];
  aiToolProfiles: AiToolProfile[];
  freeAlternativeFindings: FreeAlternativeFinding[];
  changeEvents: TechnologyChangeEvent[];
  evidenceRecords: ClaimEvidence[];
  knowledgeGraphNodes: KnowledgeGraphNode[];
  knowledgeGraphEdges: KnowledgeGraphEdge[];
  editorialProposals: EditorialProposal[];
  radarEntries: RadarTelemetryEntry[];
}

export class DiscoveryDatabase {
  private dataDir: string;
  private storeFile: string;
  private data: DiscoveryStoreSchema;

  constructor(customDataDir?: string) {
    this.dataDir = customDataDir || path.join(process.cwd(), 'data', 'discovery');
    this.storeFile = path.join(this.dataDir, 'discovery-store.json');
    this.data = this.loadState();
  }

  private loadState(): DiscoveryStoreSchema {
    const empty: DiscoveryStoreSchema = {
      sources: [],
      jobs: [],
      githubRecords: [],
      aiToolProfiles: [],
      freeAlternativeFindings: [],
      changeEvents: [],
      evidenceRecords: [],
      knowledgeGraphNodes: [],
      knowledgeGraphEdges: [],
      editorialProposals: [],
      radarEntries: [],
    };

    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }

      if (fs.existsSync(this.storeFile)) {
        const raw = fs.readFileSync(this.storeFile, 'utf8');
        return { ...empty, ...JSON.parse(raw) };
      }
    } catch {
      // Fallback in-memory
    }
    return empty;
  }

  private persistState(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      fs.writeFileSync(this.storeFile, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error('[DiscoveryDatabase] Error persisting discovery store:', e);
    }
  }

  // --- Sources ---
  public getSources(): TechnologySource[] {
    return [...this.data.sources];
  }

  public findSourceById(id: string): TechnologySource | undefined {
    return this.data.sources.find((s) => s.id === id);
  }

  public findSourceByUrl(url: string): TechnologySource | undefined {
    const normalized = url.trim().toLowerCase().replace(/\/+$/, '');
    return this.data.sources.find((s) => s.sourceUrl.trim().toLowerCase().replace(/\/+$/, '') === normalized);
  }

  public saveSource(source: TechnologySource): void {
    const idx = this.data.sources.findIndex((s) => s.id === source.id);
    if (idx >= 0) {
      this.data.sources[idx] = source;
    } else {
      this.data.sources.push(source);
    }
    this.persistState();
  }

  // --- Jobs ---
  public getJobs(): DiscoveryJob[] {
    return [...this.data.jobs];
  }

  public findJobById(id: string): DiscoveryJob | undefined {
    return this.data.jobs.find((j) => j.id === id);
  }

  public saveJob(job: DiscoveryJob): void {
    const idx = this.data.jobs.findIndex((j) => j.id === job.id);
    if (idx >= 0) {
      this.data.jobs[idx] = job;
    } else {
      this.data.jobs.push(job);
    }
    this.persistState();
  }

  // --- GitHub Intelligence ---
  public getGitHubRecords(): GitHubIntelligenceRecord[] {
    return [...this.data.githubRecords];
  }

  public findGitHubRecordByUrl(url: string): GitHubIntelligenceRecord | undefined {
    const normalized = url.trim().toLowerCase().replace(/\/+$/, '');
    return this.data.githubRecords.find((r) => r.repoUrl.trim().toLowerCase().replace(/\/+$/, '') === normalized);
  }

  public saveGitHubRecord(record: GitHubIntelligenceRecord): void {
    const idx = this.data.githubRecords.findIndex((r) => r.id === record.id);
    if (idx >= 0) {
      this.data.githubRecords[idx] = record;
    } else {
      this.data.githubRecords.push(record);
    }
    this.persistState();
  }

  // --- AI Tool Profiles ---
  public getAiToolProfiles(): AiToolProfile[] {
    return [...this.data.aiToolProfiles];
  }

  public findAiToolProfileBySlug(slug: string): AiToolProfile | undefined {
    return this.data.aiToolProfiles.find((p) => p.slug === slug);
  }

  public saveAiToolProfile(profile: AiToolProfile): void {
    const idx = this.data.aiToolProfiles.findIndex((p) => p.id === profile.id);
    if (idx >= 0) {
      this.data.aiToolProfiles[idx] = profile;
    } else {
      this.data.aiToolProfiles.push(profile);
    }
    this.persistState();
  }

  // --- Free Alternative Findings ---
  public getFreeAlternativeFindings(): FreeAlternativeFinding[] {
    return [...this.data.freeAlternativeFindings];
  }

  public saveFreeAlternativeFinding(finding: FreeAlternativeFinding): void {
    const idx = this.data.freeAlternativeFindings.findIndex((f) => f.id === finding.id);
    if (idx >= 0) {
      this.data.freeAlternativeFindings[idx] = finding;
    } else {
      this.data.freeAlternativeFindings.push(finding);
    }
    this.persistState();
  }

  // --- Technology Changes ---
  public getChangeEvents(): TechnologyChangeEvent[] {
    return [...this.data.changeEvents];
  }

  public recordChangeEvent(event: TechnologyChangeEvent): void {
    this.data.changeEvents.push(event);
    this.persistState();
  }

  // --- Evidence Ledger ---
  public getEvidenceRecords(claimId?: string): ClaimEvidence[] {
    if (claimId) {
      return this.data.evidenceRecords.filter((e) => e.claimId === claimId);
    }
    return [...this.data.evidenceRecords];
  }

  public recordEvidence(evidence: ClaimEvidence): void {
    const idx = this.data.evidenceRecords.findIndex((e) => e.id === evidence.id);
    if (idx >= 0) {
      this.data.evidenceRecords[idx] = evidence;
    } else {
      this.data.evidenceRecords.push(evidence);
    }
    this.persistState();
  }

  // --- Knowledge Graph ---
  public getGraphNodes(): KnowledgeGraphNode[] {
    return [...this.data.knowledgeGraphNodes];
  }

  public getGraphEdges(): KnowledgeGraphEdge[] {
    return [...this.data.knowledgeGraphEdges];
  }

  public saveGraphNode(node: KnowledgeGraphNode): void {
    const idx = this.data.knowledgeGraphNodes.findIndex((n) => n.id === node.id);
    if (idx >= 0) {
      this.data.knowledgeGraphNodes[idx] = node;
    } else {
      this.data.knowledgeGraphNodes.push(node);
    }
    this.persistState();
  }

  public saveGraphEdge(edge: KnowledgeGraphEdge): void {
    const idx = this.data.knowledgeGraphEdges.findIndex((e) => e.id === edge.id);
    if (idx >= 0) {
      this.data.knowledgeGraphEdges[idx] = edge;
    } else {
      this.data.knowledgeGraphEdges.push(edge);
    }
    this.persistState();
  }

  // --- Editorial Proposals ---
  public getEditorialProposals(): EditorialProposal[] {
    return [...this.data.editorialProposals];
  }

  public findProposalById(id: string): EditorialProposal | undefined {
    return this.data.editorialProposals.find((p) => p.id === id);
  }

  public saveEditorialProposal(proposal: EditorialProposal): void {
    const idx = this.data.editorialProposals.findIndex((p) => p.id === proposal.id);
    if (idx >= 0) {
      this.data.editorialProposals[idx] = proposal;
    } else {
      this.data.editorialProposals.push(proposal);
    }
    this.persistState();
  }

  // --- Radar Entries ---
  public getRadarEntries(): RadarTelemetryEntry[] {
    return [...this.data.radarEntries];
  }

  public saveRadarEntry(entry: RadarTelemetryEntry): void {
    const idx = this.data.radarEntries.findIndex((r) => r.id === entry.id);
    if (idx >= 0) {
      this.data.radarEntries[idx] = entry;
    } else {
      this.data.radarEntries.push(entry);
    }
    this.persistState();
  }

  // --- Reset/Clear for testing ---
  public resetDatabase(): void {
    this.data = {
      sources: [],
      jobs: [],
      githubRecords: [],
      aiToolProfiles: [],
      freeAlternativeFindings: [],
      changeEvents: [],
      evidenceRecords: [],
      knowledgeGraphNodes: [],
      knowledgeGraphEdges: [],
      editorialProposals: [],
      radarEntries: [],
    };
    this.persistState();
  }
}

export const discoveryDatabase = new DiscoveryDatabase();
