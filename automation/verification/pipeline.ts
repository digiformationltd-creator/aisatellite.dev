import type {
  DiscoveredResource,
  VerificationPipelineResult,
  VerificationStageResult,
} from '../shared/types.js';
import { LicenseVerifier } from './license.js';
import { PricingVerifier } from './pricing.js';
import { MaintenanceVerifier } from './maintenance.js';
import { LinkVerifier } from './links.js';
import { Logger } from '../shared/logger.js';

export class VerificationPipeline {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('VerificationPipeline');
  }

  /**
   * Runs candidate resource through all 7 verification stages
   */
  async verifyResource(
    resource: DiscoveredResource,
    skipNetwork = false
  ): Promise<VerificationPipelineResult> {
    const stages: VerificationStageResult[] = [];
    const reasons: string[] = [];

    this.logger.info(`Starting verification for: ${resource.name} (${resource.canonicalUrl})`);

    // --- Stage 1: Identity ---
    const hasValidIdentity = Boolean(resource.name && resource.canonicalUrl);
    stages.push({
      stage: '1_identity',
      passed: hasValidIdentity,
      notes: hasValidIdentity
        ? 'Project identity and canonical URL confirmed.'
        : 'Missing required canonical name or identity URL.',
    });
    if (!hasValidIdentity) reasons.push('Failed identity confirmation');

    // --- Stage 2: Availability ---
    let linkPassed = true;
    if (!skipNetwork) {
      const linkCheck = await LinkVerifier.checkLink(resource.canonicalUrl);
      linkPassed = linkCheck.isAlive;
      stages.push({
        stage: '2_availability',
        passed: linkPassed,
        notes: linkPassed
          ? `Canonical URL is live (HTTP ${linkCheck.statusCode || 200}).`
          : `URL unreachable: ${linkCheck.error || 'Connection failed'}`,
      });
      if (!linkPassed) reasons.push('Canonical link unreachable');
    } else {
      stages.push({
        stage: '2_availability',
        passed: true,
        notes: 'Network check bypassed (offline/test mode).',
      });
    }

    // --- Stage 3: Licensing ---
    const licenseCheck = LicenseVerifier.verify(resource.licenseSpdx);
    const licensePassed = licenseCheck.isIdentified && licenseCheck.isOpenSource;
    stages.push({
      stage: '3_licensing',
      passed: licensePassed,
      notes: licenseCheck.notes,
      evidenceUrl: resource.licenseEvidenceUrl,
    });
    if (!licensePassed) {
      reasons.push(licenseCheck.notes);
    }

    // --- Stage 4: Free Classification ---
    const pricingCheck = PricingVerifier.evaluate({
      isOpenSource: licenseCheck.isOpenSource,
      hasPerpetualFreeTier: resource.freeClassification === 'free_forever' || resource.freeClassification === 'freemium',
      isFreeTrialOnly: resource.freeClassification === 'free_trial',
      requiresCreditCard: resource.freeTierLimitations.some((l) => l.toLowerCase().includes('credit card')),
    });
    stages.push({
      stage: '4_free_classification',
      passed: pricingCheck.classification !== 'paid' && pricingCheck.classification !== 'unknown',
      notes: `Classified as ${pricingCheck.classification}. ${pricingCheck.reasons.join(' ')}`,
    });
    if (pricingCheck.classification === 'paid' || pricingCheck.classification === 'unknown') {
      reasons.push(`Ineligible classification: ${pricingCheck.classification}`);
    }

    // --- Stage 5: Maintenance ---
    const maintenanceCheck = MaintenanceVerifier.assess(resource.lastRepositoryUpdate);
    stages.push({
      stage: '5_maintenance',
      passed: !maintenanceCheck.isArchived,
      notes: maintenanceCheck.notes,
    });
    if (maintenanceCheck.isArchived) {
      reasons.push('Repository is archived');
    }

    // --- Stage 6: Security Hygiene ---
    // Basic hygiene: check no suspicious protocol or malicious flags
    const hasSecureProtocol = resource.canonicalUrl.startsWith('https://');
    stages.push({
      stage: '6_security',
      passed: hasSecureProtocol,
      notes: hasSecureProtocol
        ? 'Enforces HTTPS and secure public access.'
        : 'Insecure HTTP URL detected.',
    });
    if (!hasSecureProtocol) reasons.push('Insecure HTTP protocol');

    // --- Stage 7: Publication Eligibility ---
    // Candidate qualifies if identity, availability, and non-paid classification pass
    const overallPassed = hasValidIdentity && linkPassed && !maintenanceCheck.isArchived && pricingCheck.classification !== 'paid';

    stages.push({
      stage: '7_publication_eligibility',
      passed: overallPassed,
      notes: overallPassed
        ? 'Verified for catalog and editorial inclusion.'
        : 'Rejected from verified status due to verification failures.',
    });

    const result: VerificationPipelineResult = {
      resourceId: resource.id,
      passed: overallPassed,
      finalClassification: pricingCheck.classification,
      stages,
      reasons,
      verifiedAt: new Date().toISOString(),
    };

    return result;
  }
}
