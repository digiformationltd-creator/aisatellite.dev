/**
 * AI Satellite — Phase 14 Autonomous Global Technology Discovery & Intelligence Network
 * Specialized Bounded Research Agents
 * 
 * Five autonomous, specialized research agents operating with strict boundaries:
 * 1. Discovery Agent (approved sources scan, SSRF protected)
 * 2. Verification Agent (claim validation, excerpt bounded, authority hierarchy)
 * 3. Licensing Agent (OSI checks, SPDX identification, commercial rights)
 * 4. Alternatives Agent (capability matching, 6 classifications, infra cost)
 * 5. QA & Editorial Agent (evidence verification, objectivity enforcement, proposal generation)
 */

import { sourceRegistry } from './source-registry';
import { OSI_APPROVED_LICENSES } from './github-intelligence';
import { freeAlternativesEngine } from './free-alternatives-engine';
import { evidenceLedgerEngine } from './evidence-ledger';
import { editorialPipeline } from './editorial-pipeline';
import { costAndSecurityManager } from './cost-and-security';
import type {
  AlternativeClassification,
  ClaimEvidence,
  EditorialProposal,
  FreeAlternativeFinding,
  SourceType,
} from './types';

// --- 1. Discovery Agent ---
export class DiscoveryAgent {
  public scanApprovedSource(sourceUrl: string): {
    allowed: boolean;
    reason?: string;
    sourceDetails?: ReturnType<typeof sourceRegistry.getSourceByUrl>;
  } {
    const ssrf = costAndSecurityManager.validateUrlForSsrf(sourceUrl);
    if (!ssrf.allowed) {
      return { allowed: false, reason: ssrf.reason };
    }

    const source = sourceRegistry.getSourceByUrl(sourceUrl);
    if (!source) {
      return { allowed: false, reason: 'Source is not registered in Approved Source Registry' };
    }

    if (source.status !== 'active') {
      return { allowed: false, reason: `Source status is ${source.status}` };
    }

    const hasQuota = costAndSecurityManager.checkRateLimit(new URL(sourceUrl).hostname);
    if (!hasQuota) {
      return { allowed: false, reason: 'Per-domain rate limit exceeded' };
    }

    return { allowed: true, sourceDetails: source };
  }
}

// --- 2. Verification Agent ---
export class VerificationAgent {
  public verifyClaim(input: {
    claimId: string;
    sourceUrl: string;
    sourceTitle: string;
    sourceType: SourceType;
    claimSupported: string;
    rawExcerpt: string;
  }): ClaimEvidence {
    // Sanitize excerpt against prompt injections
    const sanitized = costAndSecurityManager.sanitizeResearchPromptInput(input.rawExcerpt);

    // Enforce excerpt bounds (<500 chars)
    const boundedExcerpt = sanitized.sanitized.slice(0, 480);

    return evidenceLedgerEngine.recordEvidence({
      claimId: input.claimId,
      sourceUrl: input.sourceUrl,
      sourceTitle: input.sourceTitle,
      sourceType: input.sourceType,
      claimSupported: input.claimSupported,
      relevantExcerpt: boundedExcerpt,
    });
  }
}

// --- 3. Licensing Agent ---
export class LicensingAgent {
  public analyzeLicense(spdxOrName: string): {
    licenseName: string;
    isOsiApproved: boolean;
    licenseType: 'permissive' | 'copyleft' | 'source_available' | 'proprietary' | 'unknown';
    commercialUseAllowed: boolean;
  } {
    const clean = spdxOrName.trim();
    const isOsi = OSI_APPROVED_LICENSES.has(clean);

    let licenseType: 'permissive' | 'copyleft' | 'source_available' | 'proprietary' | 'unknown' = 'unknown';
    let commercial = false;

    if (['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', 'Unlicense'].includes(clean)) {
      licenseType = 'permissive';
      commercial = true;
    } else if (['GPL-3.0', 'GPL-2.0', 'AGPL-3.0', 'LGPL-3.0', 'MPL-2.0'].includes(clean)) {
      licenseType = 'copyleft';
      commercial = true; // Allowed under copyleft terms
    } else if (clean.includes('BSL') || clean.includes('SSPL') || clean.includes('Sustainable') || clean.includes('Fair-Code')) {
      licenseType = 'source_available';
      commercial = false; // Restricted commercial rights
    } else if (clean.toLowerCase().includes('proprietary') || clean.toLowerCase().includes('commercial')) {
      licenseType = 'proprietary';
      commercial = false;
    }

    return {
      licenseName: clean,
      isOsiApproved: isOsi,
      licenseType,
      commercialUseAllowed: commercial,
    };
  }
}

// --- 4. Alternatives Agent ---
export class AlternativesAgent {
  public evaluateAlternative(input: {
    paidToolName: string;
    candidateName: string;
    candidateUrl: string;
    candidateLicense: string;
    paidCapabilities: string[];
    offeredCapabilities: string[];
    deploymentOptions: ('cloud' | 'docker' | 'bare_metal' | 'kubernetes')[];
    knownLimitations: string[];
    estimatedHostingCost: string;
    evidenceUrls: string[];
  }): FreeAlternativeFinding {
    // Determine classification
    const licenseCheck = new LicensingAgent().analyzeLicense(input.candidateLicense);
    let classification: AlternativeClassification = 'freemium';

    if (licenseCheck.isOsiApproved) {
      if (input.deploymentOptions.includes('docker') || input.deploymentOptions.includes('bare_metal')) {
        classification = 'free_and_open_source';
      }
    } else if (licenseCheck.licenseType === 'source_available') {
      classification = 'self_hosted_infra_cost';
    } else if (input.estimatedHostingCost === '$0' || input.estimatedHostingCost.toLowerCase().includes('free')) {
      classification = 'free_proprietary';
    }

    // Overlap capabilities
    const matched = input.paidCapabilities.filter((c) =>
      input.offeredCapabilities.map((x) => x.toLowerCase()).includes(c.toLowerCase())
    );

    return freeAlternativesEngine.registerAlternative({
      paidToolName: input.paidToolName,
      alternativeName: input.candidateName,
      alternativeUrl: input.candidateUrl,
      license: input.candidateLicense,
      classification,
      capabilityOverlap: matched.length > 0 ? matched : input.offeredCapabilities,
      deploymentOptions: input.deploymentOptions,
      limitations: input.knownLimitations,
      infrastructureCostEstimated: input.estimatedHostingCost,
      evidenceUrls: input.evidenceUrls,
    });
  }
}

// --- 5. QA & Editorial Agent ---
export class QaAndEditorialAgent {
  /**
   * Ensures proposals have verified evidence and strictly objective phrasing
   */
  public prepareEditorialProposal(input: {
    title: string;
    proposalType: 'tool_profile' | 'alternative_comparison' | 'project_review' | 'change_report' | 'tutorial_guide';
    researchEvidenceIds: string[];
    targetAudience: string;
    searchIntent: string;
    uniqueValue: string;
  }): EditorialProposal {
    // 1. Evidence check: must have at least 1 verified evidence ID
    if (!input.researchEvidenceIds || input.researchEvidenceIds.length === 0) {
      throw new Error('QA Rejection: Proposal must have at least one verified evidence record attached');
    }

    // Verify evidence exists in ledger
    for (const evId of input.researchEvidenceIds) {
      const found = evidenceLedgerEngine.getEvidenceById(evId);
      if (!found) {
        throw new Error(`QA Rejection: Referenced evidence record does not exist: ${evId}`);
      }
    }

    // 2. Objectivity check: filter sensationalist marketing hype words
    const hypeWords = ['revolutionary', 'game-changing', 'miracle', 'unbeatable', 'disrupts everything'];
    let sanitizedTitle = input.title;
    for (const hw of hypeWords) {
      const reg = new RegExp(`\\b${hw}\\b`, 'gi');
      if (reg.test(sanitizedTitle)) {
        sanitizedTitle = sanitizedTitle.replace(reg, 'High-Utility');
      }
    }

    return editorialPipeline.createProposal({
      title: sanitizedTitle,
      proposalType: input.proposalType,
      researchEvidenceIds: input.researchEvidenceIds,
      targetAudience: input.targetAudience,
      searchIntent: input.searchIntent,
      uniqueValue: input.uniqueValue,
      proposedByAgent: 'QA & Editorial Agent',
    });
  }
}

export const discoveryAgent = new DiscoveryAgent();
export const verificationAgent = new VerificationAgent();
export const licensingAgent = new LicensingAgent();
export const alternativesAgent = new AlternativesAgent();
export const qaAndEditorialAgent = new QaAndEditorialAgent();
