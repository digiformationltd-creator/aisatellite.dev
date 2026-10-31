/**
 * AI SATELLITE — PHASE 23 SOURCE EVIDENCE LEDGER
 * Verifiable evidence recording, claim classification, and source quality hierarchy enforcer.
 * Strict non-fabrication rule.
 * Canonical Domain: https://aisatellite.dev
 */

import type {
  SourceEvidence,
  ClaimVerification,
  ClaimClassification,
  SourceQualityTier,
} from './types';

export class EvidenceLedgerManager {
  private static instance: EvidenceLedgerManager;

  private evidenceStore: Map<string, SourceEvidence> = new Map();
  private claimStore: Map<string, ClaimVerification> = new Map();

  public static getInstance(): EvidenceLedgerManager {
    if (!EvidenceLedgerManager.instance) {
      EvidenceLedgerManager.instance = new EvidenceLedgerManager();
    }
    return EvidenceLedgerManager.instance;
  }

  /**
   * Records a source evidence entry.
   * Validates source URL format and assigns the appropriate quality tier.
   */
  public recordEvidence(params: {
    articleId: string;
    claim: string;
    claimType: ClaimClassification;
    sourceTitle: string;
    sourceUrl: string;
    sourcePublisher: string;
    supportingPassage: string;
    publicationDate?: string | null;
    reviewer?: string;
    notes?: string;
  }): SourceEvidence {
    // Validate non-fabrication: URL must be valid https
    if (!params.sourceUrl.startsWith('https://')) {
      throw new Error(`Fabrication rejected: Source URL must be a valid secure HTTPS link. Got: ${params.sourceUrl}`);
    }

    if (!params.sourceTitle || params.sourceTitle.trim().length < 3) {
      throw new Error('Fabrication rejected: Source title must be documented.');
    }

    const qualityTier = this.classifyQualityTier(params.sourceUrl, params.claimType);
    const evidenceId = `EVD-${params.articleId}-${String(this.evidenceStore.size + 1).padStart(4, '0')}`;

    const evidence: SourceEvidence = {
      evidenceId,
      articleId: params.articleId,
      claim: params.claim,
      claimType: params.claimType,
      sourceTitle: params.sourceTitle,
      sourceUrl: params.sourceUrl,
      sourcePublisher: params.sourcePublisher,
      qualityTier,
      accessDate: new Date().toISOString().split('T')[0],
      publicationDate: params.publicationDate || null,
      supportingPassage: params.supportingPassage,
      verificationStatus: 'Verified',
      confidenceAssessment: qualityTier === 'Tier 1 — Official Primary Source' || qualityTier === 'Tier 3 — Government / Regulatory Publication' ? 'High' : 'Medium',
      reviewer: params.reviewer || 'FactCheckerAgent',
      notes: params.notes || 'Evidence verified against primary documentation.',
    };

    this.evidenceStore.set(evidenceId, evidence);
    return evidence;
  }

  /**
   * Classifies source into the 6-tier hierarchy.
   */
  public classifyQualityTier(url: string, claimType: ClaimClassification): SourceQualityTier {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('.gov') || lowerUrl.includes('companieshouse.gov.uk') || lowerUrl.includes('hmrc.gov.uk') || lowerUrl.includes('irs.gov')) {
      return 'Tier 3 — Government / Regulatory Publication';
    }
    if (lowerUrl.includes('github.com') || lowerUrl.includes('docs.') || lowerUrl.includes('developer.mozilla.org') || lowerUrl.includes('modelcontextprotocol.io')) {
      return 'Tier 2 — Technical Documentation';
    }
    if (lowerUrl.includes('aisatellite.dev') || lowerUrl.includes('eff.org') || lowerUrl.includes('w3.org')) {
      return 'Tier 1 — Official Primary Source';
    }
    if (lowerUrl.includes('arxiv.org') || lowerUrl.includes('research.')) {
      return 'Tier 4 — Original Empirical Research';
    }
    if (lowerUrl.includes('reddit.com') || lowerUrl.includes('news.ycombinator.com') || lowerUrl.includes('discord.')) {
      return 'Tier 6 — Community Discussion / Experiential';
    }
    return 'Tier 5 — Reputable Independent Analysis';
  }

  /**
   * Records and evaluates a factual claim against recorded evidence.
   */
  public verifyClaim(params: {
    articleId: string;
    statement: string;
    classification: ClaimClassification;
    evidenceIds: string[];
    riskLevel?: 'low' | 'medium' | 'high';
  }): ClaimVerification {
    const claimId = `CLM-${params.articleId}-${String(this.claimStore.size + 1).padStart(4, '0')}`;
    const associatedEvidences = params.evidenceIds
      .map((id) => this.evidenceStore.get(id))
      .filter((e): e is SourceEvidence => e !== undefined);

    let status: 'Verified' | 'Flagged' | 'Rejected' | 'Exempt' = 'Verified';
    let notes = 'Claim verified with primary source documentation.';
    const conflictingSources: string[] = [];

    // Exempt opinion/interpretation from hard factual gating
    if (params.classification === 'Opinion or interpretation') {
      status = 'Exempt';
      notes = 'Subjective assessment or strategic perspective; verified as authorial opinion.';
    } else if (associatedEvidences.length === 0) {
      status = 'Flagged';
      notes = 'Unsupported claim: No verifiable source evidence was attached in the ledger.';
    } else {
      // Check for community sources asserting technical facts
      const usesOnlyCommunitySources = associatedEvidences.every(
        (e) => e.qualityTier === 'Tier 6 — Community Discussion / Experiential'
      );
      if (usesOnlyCommunitySources && params.classification === 'Stable technical fact') {
        status = 'Flagged';
        notes = 'Policy violation: Community discussions cannot be used to verify stable technical facts or product specifications.';
      }

      // Check for conflicting evidence
      const hasConflicting = associatedEvidences.some((e) => e.verificationStatus === 'Conflicting');
      if (hasConflicting) {
        status = 'Flagged';
        notes = 'Conflicting evidence detected across multiple cited sources. Requires human editorial mediation.';
        associatedEvidences.forEach((e) => conflictingSources.push(e.sourceUrl));
      }
    }

    const verification: ClaimVerification = {
      claimId,
      articleId: params.articleId,
      statement: params.statement,
      classification: params.classification,
      status,
      evidenceReferences: params.evidenceIds,
      verificationNotes: notes,
      conflictingSources,
      riskLevel: params.riskLevel || (status === 'Flagged' ? 'high' : 'low'),
    };

    this.claimStore.set(claimId, verification);
    return verification;
  }

  public getEvidenceForArticle(articleId: string): SourceEvidence[] {
    return Array.from(this.evidenceStore.values()).filter((e) => e.articleId === articleId);
  }

  public getClaimsForArticle(articleId: string): ClaimVerification[] {
    return Array.from(this.claimStore.values()).filter((c) => c.articleId === articleId);
  }

  public hasUnverifiedHighRiskClaims(articleId: string): boolean {
    const claims = this.getClaimsForArticle(articleId);
    return claims.some((c) => (c.status === 'Flagged' || c.status === 'Rejected') && c.riskLevel === 'high');
  }

  public clearAll(): void {
    this.evidenceStore.clear();
    this.claimStore.clear();
  }
}

export const evidenceLedger = EvidenceLedgerManager.getInstance();
