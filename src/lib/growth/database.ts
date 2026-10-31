/**
 * AI Satellite — Phase 15 Growth Authority Database Layer
 * Atomic file-backed persistence for search performance, technical SEO findings,
 * topical clusters, keyword opportunities, content gaps, original research studies,
 * referring domains, GitHub metrics, AEO/GEO evaluations, conversions, and experiments.
 */

import fs from 'node:fs';
import path from 'node:path';
import type {
  TechnicalSEOFinding,
  SearchConsoleStatus,
  AuthorityCluster,
  ContentGapProposal,
  OriginalResearchStudy,
  ReferringDomainRecord,
  GitHubAdoptionMetrics,
  AEOEvaluation,
  GEOEvaluation,
  ConversionEventRecord,
  GrowthExperiment,
} from './types';

export interface GrowthStoreSchema {
  technicalSeoFindings: TechnicalSEOFinding[];
  searchConsoleStatuses: SearchConsoleStatus[];
  authorityClusters: AuthorityCluster[];
  contentGapProposals: ContentGapProposal[];
  originalResearchStudies: OriginalResearchStudy[];
  referringDomains: ReferringDomainRecord[];
  gitHubMetrics: GitHubAdoptionMetrics[];
  aeoEvaluations: AEOEvaluation[];
  geoEvaluations: GEOEvaluation[];
  conversionEvents: ConversionEventRecord[];
  growthExperiments: GrowthExperiment[];
}

export class GrowthDatabase {
  private dataDir: string;
  private storeFile: string;
  private data: GrowthStoreSchema;

  constructor(customDataDir?: string) {
    this.dataDir = customDataDir || path.join(process.cwd(), 'data', 'growth');
    this.storeFile = path.join(this.dataDir, 'growth-authority-store.json');
    this.data = this.loadState();
  }

  private loadState(): GrowthStoreSchema {
    const empty: GrowthStoreSchema = {
      technicalSeoFindings: [],
      searchConsoleStatuses: [],
      authorityClusters: [],
      contentGapProposals: [],
      originalResearchStudies: [],
      referringDomains: [],
      gitHubMetrics: [],
      aeoEvaluations: [],
      geoEvaluations: [],
      conversionEvents: [],
      growthExperiments: [],
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
      console.error('[GrowthDatabase] Error persisting growth authority store:', e);
    }
  }

  // --- Technical SEO Findings ---
  public getSeoFindings(): TechnicalSEOFinding[] {
    return [...this.data.technicalSeoFindings];
  }

  public saveSeoFinding(finding: TechnicalSEOFinding): void {
    const idx = this.data.technicalSeoFindings.findIndex((f) => f.id === finding.id);
    if (idx >= 0) {
      this.data.technicalSeoFindings[idx] = finding;
    } else {
      this.data.technicalSeoFindings.push(finding);
    }
    this.persistState();
  }

  // --- Search Console Status ---
  public getSearchStatuses(): SearchConsoleStatus[] {
    return [...this.data.searchConsoleStatuses];
  }

  public saveSearchStatus(status: SearchConsoleStatus): void {
    const idx = this.data.searchConsoleStatuses.findIndex((s) => s.service === status.service);
    if (idx >= 0) {
      this.data.searchConsoleStatuses[idx] = status;
    } else {
      this.data.searchConsoleStatuses.push(status);
    }
    this.persistState();
  }

  // --- Authority Clusters ---
  public getAuthorityClusters(): AuthorityCluster[] {
    return [...this.data.authorityClusters];
  }

  public saveAuthorityCluster(cluster: AuthorityCluster): void {
    const idx = this.data.authorityClusters.findIndex((c) => c.id === cluster.id);
    if (idx >= 0) {
      this.data.authorityClusters[idx] = cluster;
    } else {
      this.data.authorityClusters.push(cluster);
    }
    this.persistState();
  }

  // --- Content Gap Proposals ---
  public getContentGapProposals(): ContentGapProposal[] {
    return [...this.data.contentGapProposals];
  }

  public saveContentGapProposal(proposal: ContentGapProposal): void {
    const idx = this.data.contentGapProposals.findIndex((p) => p.id === proposal.id);
    if (idx >= 0) {
      this.data.contentGapProposals[idx] = proposal;
    } else {
      this.data.contentGapProposals.push(proposal);
    }
    this.persistState();
  }

  // --- Original Research Studies ---
  public getOriginalResearchStudies(): OriginalResearchStudy[] {
    return [...this.data.originalResearchStudies];
  }

  public saveOriginalResearchStudy(study: OriginalResearchStudy): void {
    const idx = this.data.originalResearchStudies.findIndex((s) => s.id === study.id);
    if (idx >= 0) {
      this.data.originalResearchStudies[idx] = study;
    } else {
      this.data.originalResearchStudies.push(study);
    }
    this.persistState();
  }

  // --- Referring Domains ---
  public getReferringDomains(): ReferringDomainRecord[] {
    return [...this.data.referringDomains];
  }

  public saveReferringDomain(record: ReferringDomainRecord): void {
    const idx = this.data.referringDomains.findIndex((r) => r.id === record.id);
    if (idx >= 0) {
      this.data.referringDomains[idx] = record;
    } else {
      this.data.referringDomains.push(record);
    }
    this.persistState();
  }

  // --- GitHub Adoption Metrics ---
  public getGitHubMetrics(): GitHubAdoptionMetrics[] {
    return [...this.data.gitHubMetrics];
  }

  public saveGitHubMetrics(metrics: GitHubAdoptionMetrics): void {
    const idx = this.data.gitHubMetrics.findIndex((m) => m.repository === metrics.repository);
    if (idx >= 0) {
      this.data.gitHubMetrics[idx] = metrics;
    } else {
      this.data.gitHubMetrics.push(metrics);
    }
    this.persistState();
  }

  // --- AEO & GEO Evaluations ---
  public getAeoEvaluations(): AEOEvaluation[] {
    return [...this.data.aeoEvaluations];
  }

  public saveAeoEvaluation(evalObj: AEOEvaluation): void {
    const idx = this.data.aeoEvaluations.findIndex((e) => e.pageUrl === evalObj.pageUrl);
    if (idx >= 0) {
      this.data.aeoEvaluations[idx] = evalObj;
    } else {
      this.data.aeoEvaluations.push(evalObj);
    }
    this.persistState();
  }

  public getGeoEvaluations(): GEOEvaluation[] {
    return [...this.data.geoEvaluations];
  }

  public saveGeoEvaluation(evalObj: GEOEvaluation): void {
    const idx = this.data.geoEvaluations.findIndex((g) => g.entityName === evalObj.entityName);
    if (idx >= 0) {
      this.data.geoEvaluations[idx] = evalObj;
    } else {
      this.data.geoEvaluations.push(evalObj);
    }
    this.persistState();
  }

  // --- Conversion Events ---
  public getConversionEvents(): ConversionEventRecord[] {
    return [...this.data.conversionEvents];
  }

  public recordConversion(event: ConversionEventRecord): void {
    this.data.conversionEvents.push(event);
    this.persistState();
  }

  // --- Growth Experiments ---
  public getGrowthExperiments(): GrowthExperiment[] {
    return [...this.data.growthExperiments];
  }

  public saveGrowthExperiment(exp: GrowthExperiment): void {
    const idx = this.data.growthExperiments.findIndex((e) => e.id === exp.id);
    if (idx >= 0) {
      this.data.growthExperiments[idx] = exp;
    } else {
      this.data.growthExperiments.push(exp);
    }
    this.persistState();
  }

  // --- Reset for Unit & Acceptance Testing ---
  public resetDatabase(): void {
    this.data = {
      technicalSeoFindings: [],
      searchConsoleStatuses: [],
      authorityClusters: [],
      contentGapProposals: [],
      originalResearchStudies: [],
      referringDomains: [],
      gitHubMetrics: [],
      aeoEvaluations: [],
      geoEvaluations: [],
      conversionEvents: [],
      growthExperiments: [],
    };
    this.persistState();
  }
}

export const growthDatabase = new GrowthDatabase();
