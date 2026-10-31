import { type TechnologyResource, type VerificationStatus, TechnologyResourceSchema } from './schemas';

export interface VerificationAuditResult {
  valid: boolean;
  status: VerificationStatus;
  errors: string[];
  warnings: string[];
  auditedAt: string;
}

export class EvidenceVerifier {
  private allowedUrlProtocols = ['http:', 'https:'];

  /**
   * Verifies a technology resource against strict evidentiary standards.
   */
  public verifyResource(resource: TechnologyResource): VerificationAuditResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Schema Validation
    const parseResult = TechnologyResourceSchema.safeParse(resource);
    if (!parseResult.success) {
      parseResult.error.errors.forEach((err) => {
        errors.push(`Schema Error [${err.path.join('.')}]: ${err.message}`);
      });
    }

    // 2. Evidence URL Integrity Checks
    if (!resource.evidenceUrls || resource.evidenceUrls.length === 0) {
      errors.push('Mandatory evidence URLs missing. Unverified claims cannot be published.');
    } else {
      for (const url of resource.evidenceUrls) {
        try {
          const parsed = new URL(url);
          if (!this.allowedUrlProtocols.includes(parsed.protocol)) {
            errors.push(`Invalid protocol for evidence URL: ${url}`);
          }
          if (!parsed.hostname.includes('.')) {
            errors.push(`Malformed domain in evidence URL: ${url}`);
          }
        } catch {
          errors.push(`Invalid evidence URL string: ${url}`);
        }
      }
    }

    // 3. Open Source & License Verification
    if (resource.pricingClassification?.includes('open_source')) {
      if (!resource.license || resource.license.toLowerCase() === 'unknown') {
        warnings.push('Open source resource lacks explicit SPDX or declared license name.');
      }
      if (!resource.repositoryUrl) {
        warnings.push('Open source claimed but public repository URL is omitted.');
      }
    }

    // 4. Hosting & Cost Transparency Rule
    // "A self-hosted application must not automatically be labeled zero-cost."
    if (resource.selfHosted && !resource.paidInfrastructureRequired && !resource.pricingClassification?.includes('free_forever')) {
      warnings.push('Self-hosted software should disclose infrastructure/hardware cost prerequisites.');
    }

    // 5. Freshness Audit (Older than 90 days = outdated)
    let status: VerificationStatus = resource.verificationStatus;
    if (resource.lastVerified) {
      const verifiedDate = new Date(resource.lastVerified);
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      if (verifiedDate < ninetyDaysAgo) {
        status = 'outdated';
        warnings.push(`Verification is older than 90 days (${resource.lastVerified}). Marked as outdated.`);
      }
    }

    if (errors.length > 0) {
      status = 'pending';
    }

    return {
      valid: errors.length === 0,
      status,
      errors,
      warnings,
      auditedAt: new Date().toISOString(),
    };
  }

  /**
   * Sanitizes any untrusted description or evidence summary to prevent instruction override or injection.
   */
  public sanitizeUntrustedContent(input: string): string {
    if (!input) return '';
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/system\s+prompt|ignore\s+previous\s+instructions/gi, '[filtered-directive]')
      .trim();
  }
}

export const evidenceVerifier = new EvidenceVerifier();
