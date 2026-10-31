/**
 * AI Satellite — Phase 14 Autonomous Global Technology Discovery & Intelligence Network
 * Engine I: Relevance Scoring & Editorial Intelligence Pipeline (Part 1: Scoring)
 * 
 * Provides an explainable, multi-signal scoring algorithm for discovered software tools.
 * Excludes vanity metrics (stars/clout) in favor of verified maintenance, license openness,
 * documentation quality, and multi-source evidence confidence.
 */

export interface RelevanceScoreResult {
  totalScore: number; // 0 to 100
  breakdown: {
    recencyScore: number; // 0 - 25
    licenseScore: number; // 0 - 25
    documentationScore: number; // 0 - 20
    verificationScore: number; // 0 - 20
    utilityScore: number; // 0 - 10
  };
  explanation: string;
}

export class RelevanceScoringEngine {
  /**
   * Computes an explainable score for a software tool
   */
  public calculateScore(input: {
    latestReleaseDate?: string;
    isArchived?: boolean;
    isOsiLicense?: boolean;
    hasDocumentation?: boolean;
    hasInstallInstructions?: boolean;
    isAuthoritativeVerified?: boolean;
    evidenceCount?: number;
    capabilityCount?: number;
  }): RelevanceScoreResult {
    // 1. Recency & Maintenance (25 pts max)
    let recencyScore = 10;
    if (input.isArchived) {
      recencyScore = 0; // Archived tools severely penalized
    } else if (input.latestReleaseDate) {
      const releaseTime = new Date(input.latestReleaseDate).getTime();
      const ageDays = (Date.now() - releaseTime) / (1000 * 60 * 60 * 24);
      if (ageDays <= 30) {
        recencyScore = 25; // Active release in last month
      } else if (ageDays <= 90) {
        recencyScore = 20;
      } else if (ageDays <= 180) {
        recencyScore = 15;
      } else {
        recencyScore = 8;
      }
    }

    // 2. License Openness & Freedom (25 pts max)
    let licenseScore = 10;
    if (input.isOsiLicense) {
      licenseScore = 25; // OSI approved free software
    } else {
      licenseScore = 12; // Source-available or proprietary
    }

    // 3. Documentation & Developer Experience (20 pts max)
    let docScore = 0;
    if (input.hasDocumentation) docScore += 12;
    if (input.hasInstallInstructions) docScore += 8;

    // 4. Verification & Evidence Rigor (20 pts max)
    let verifScore = 5;
    if (input.isAuthoritativeVerified) verifScore += 10;
    const evCount = input.evidenceCount || 0;
    if (evCount >= 2) verifScore += 5;
    verifScore = Math.min(20, verifScore);

    // 5. Capability Utility (10 pts max)
    const capCount = input.capabilityCount || 1;
    const utilityScore = Math.min(10, capCount * 3);

    const total = Math.min(100, recencyScore + licenseScore + docScore + verifScore + utilityScore);

    const explanations: string[] = [];
    if (input.isArchived) {
      explanations.push('Archived repository (-25)');
    } else if (recencyScore >= 20) {
      explanations.push('Actively maintained with recent releases (+25)');
    }

    if (input.isOsiLicense) {
      explanations.push('OSI-compliant open source license (+25)');
    }

    if (docScore >= 18) {
      explanations.push('Comprehensive documentation and verified install commands (+20)');
    }

    if (verifScore >= 15) {
      explanations.push('Authoritative multi-source evidence verification (+20)');
    }

    return {
      totalScore: total,
      breakdown: {
        recencyScore,
        licenseScore,
        documentationScore: docScore,
        verificationScore: verifScore,
        utilityScore,
      },
      explanation: explanations.join('; ') || 'Standard baseline evaluation',
    };
  }
}

export const relevanceScoringEngine = new RelevanceScoringEngine();
