/**
 * AI Satellite — Phase 14 Autonomous Global Technology Discovery & Intelligence Network
 * Engine G: Evidence & Multi-Source Verification Ledger
 * 
 * Manages claim-level evidence records with strict excerpt length bounds,
 * source authority hierarchy evaluation, and multi-source cross-verification.
 */

import { uuidv4 } from './id-generator';
import type { ClaimEvidence, ConfidenceLevel, SourceType } from './types';
import { CreateEvidenceSchema } from './types';
import { discoveryDatabase, DiscoveryDatabase } from './database';

export class EvidenceLedgerEngine {
  private db: DiscoveryDatabase;

  constructor(db?: DiscoveryDatabase) {
    this.db = db || discoveryDatabase;
    this.seedDefaultEvidence();
  }

  /**
   * Evaluates authority hierarchy based on claim context and source type
   */
  public isSourceAuthoritativeForClaim(sourceType: SourceType, claimSupported: string): boolean {
    const claimLower = claimSupported.toLowerCase();

    if (sourceType === 'license_file') {
      return true;
    }

    if (claimLower.includes('pricing') || claimLower.includes('cost') || claimLower.includes('free tier')) {
      return sourceType === 'official_website' || sourceType === 'official_docs';
    }

    if (
      claimLower.includes('license') ||
      claimLower.includes('osi') ||
      claimLower.includes('spdx') ||
      claimLower.includes('open source')
    ) {
      return sourceType === 'github_repo';
    }

    if (claimLower.includes('vulnerability') || claimLower.includes('security') || claimLower.includes('cve')) {
      return sourceType === 'security_advisory';
    }

    if (claimLower.includes('release') || claimLower.includes('version') || claimLower.includes('tag')) {
      return sourceType === 'github_releases' || sourceType === 'changelog';
    }

    return sourceType === 'official_website' || sourceType === 'official_docs' || sourceType === 'github_repo';
  }

  public recordEvidence(input: {
    claimId: string;
    sourceUrl: string;
    sourceTitle: string;
    sourceType: SourceType;
    claimSupported: string;
    relevantExcerpt: string;
    confidence?: ConfidenceLevel;
    isAuthoritative?: boolean;
  }): ClaimEvidence {
    // Bounded excerpt <= 500 chars (prevent copyright reproduction) BEFORE schema parse
    const boundedExcerpt = (input.relevantExcerpt || '').slice(0, 500);

    const validated = CreateEvidenceSchema.parse({
      ...input,
      relevantExcerpt: boundedExcerpt,
    });

    const now = new Date().toISOString();
    const isAuth = this.isSourceAuthoritativeForClaim(validated.sourceType, validated.claimSupported);

    const evidence: ClaimEvidence = {
      id: `ev-${uuidv4().slice(0, 8)}`,
      claimId: validated.claimId,
      sourceUrl: validated.sourceUrl,
      sourceTitle: validated.sourceTitle,
      sourceType: validated.sourceType,
      retrievalTimestamp: now,
      verificationTimestamp: now,
      claimSupported: validated.claimSupported,
      relevantExcerpt: boundedExcerpt,
      confidence: isAuth ? 'high' : validated.confidence || 'medium',
      isAuthoritative: isAuth,
      reviewStatus: 'approved',
    };

    this.db.recordEvidence(evidence);
    return evidence;
  }

  public getEvidenceByClaim(claimId: string): ClaimEvidence[] {
    return this.db.getEvidenceRecords(claimId);
  }

  public getEvidenceById(id: string): ClaimEvidence | undefined {
    return this.db.getEvidenceRecords().find((e) => e.id === id);
  }

  public getAllEvidence(): ClaimEvidence[] {
    return this.db.getEvidenceRecords();
  }

  /**
   * Evaluates overall confidence for a claim across all attached evidence
   */
  public evaluateClaimConfidence(claimId: string): {
    overallConfidence: ConfidenceLevel;
    evidenceCount: number;
    authoritativeSourcesCount: number;
    sources: string[];
  } {
    const records = this.db.getEvidenceRecords(claimId);
    if (records.length === 0) {
      return {
        overallConfidence: 'unverified',
        evidenceCount: 0,
        authoritativeSourcesCount: 0,
        sources: [],
      };
    }

    const authCount = records.filter((r) => r.isAuthoritative).length;
    const sources = Array.from(new Set(records.map((r) => r.sourceUrl)));

    let overall: ConfidenceLevel = 'low';
    if (authCount >= 1 && records.length >= 2) {
      overall = 'high'; // Cross-verified by at least 1 authoritative and 2 total sources
    } else if (authCount >= 1) {
      overall = 'high';
    } else if (records.length >= 2) {
      overall = 'medium';
    }

    return {
      overallConfidence: overall,
      evidenceCount: records.length,
      authoritativeSourcesCount: authCount,
      sources,
    };
  }

  public seedDefaultEvidence(): void {
    const existing = this.db.getEvidenceRecords();
    if (existing.length > 0) return;

    const defaults: Array<{
      claimId: string;
      sourceUrl: string;
      sourceTitle: string;
      sourceType: SourceType;
      claimSupported: string;
      relevantExcerpt: string;
    }> = [
      {
        claimId: 'claim-ollama-mit',
        sourceUrl: 'https://github.com/ollama/ollama/blob/main/LICENSE',
        sourceTitle: 'Ollama MIT License File',
        sourceType: 'license_file',
        claimSupported: 'Ollama is licensed under the MIT License',
        relevantExcerpt: 'MIT License. Permission is hereby granted, free of charge, to any person obtaining a copy...',
      },
      {
        claimId: 'claim-supabase-apache',
        sourceUrl: 'https://github.com/supabase/supabase/blob/master/LICENSE',
        sourceTitle: 'Supabase Apache 2.0 License File',
        sourceType: 'license_file',
        claimSupported: 'Supabase open source core is licensed under Apache 2.0',
        relevantExcerpt: 'Apache License Version 2.0, January 2004. Licensed under the Apache License, Version 2.0...',
      },
      {
        claimId: 'claim-baserow-pricing',
        sourceUrl: 'https://baserow.io/pricing',
        sourceTitle: 'Baserow Official Pricing Page',
        sourceType: 'official_website',
        claimSupported: 'Baserow provides a free community tier with self-hosting support',
        relevantExcerpt: 'Community Edition: 100% Free self-hosted under MIT License with unlimited rows per database.',
      },
    ];

    for (const d of defaults) {
      this.recordEvidence(d);
    }
  }
}

export const evidenceLedgerEngine = new EvidenceLedgerEngine();
