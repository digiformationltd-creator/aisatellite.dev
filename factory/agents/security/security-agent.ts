import {
  type SecurityReport,
  SecurityReportSchema,
} from '../../schemas';
import { securityScanner } from '../../security/security-scanner';
import { licenseEngine } from '../../licensing/license-engine';
import { auditLogger } from '../../monitoring/audit-logger';

export class SecurityAgent {
  public async performAudit(
    projectId: string,
    workspaceDir: string,
    projectLicense = 'MIT'
  ): Promise<SecurityReport> {
    // 1. Run secret & dependency scans
    const baseReport = await securityScanner.runAudit(projectId, workspaceDir, projectLicense);

    // 2. Perform license validation and compatibility check
    const licVerification = licenseEngine.verifyWorkspaceLicense(workspaceDir, projectLicense);
    const issues = [...baseReport.licenseCheck.issues];

    if (!licVerification.valid && licVerification.error) {
      issues.push(licVerification.error);
    }

    const isLicValid = licVerification.valid && issues.length === 0;

    // Overall blocking evaluation:
    // Blocked if any critical or high secrets/CVEs exist, or if license check fails
    const hasCriticalFindings =
      baseReport.secretFindings.some((s) => s.severity === 'critical' || s.severity === 'high') ||
      baseReport.cveFindings.some((c) => c.severity === 'critical' || c.severity === 'high');

    const isBlocked = hasCriticalFindings || !isLicValid;

    const finalReport: SecurityReport = {
      ...baseReport,
      licenseCheck: {
        valid: isLicValid,
        license: projectLicense,
        compatible: isLicValid,
        issues,
      },
      isBlocked,
      notes: [
        `Static secret analysis completed across workspace files.`,
        `Dependency supply chain verified.`,
        isBlocked
          ? `SECURITY GATE BLOCKED: Issues detected that require human remediation.`
          : `SECURITY GATE PASSED: Zero blocking vulnerabilities or license conflicts.`,
      ],
    };

    const validated = SecurityReportSchema.parse(finalReport);

    auditLogger.log({
      actor: 'security-agent',
      action: 'complete_security_audit',
      projectId,
      details: {
        reportId: validated.reportId,
        isBlocked: validated.isBlocked,
        riskScore: validated.overallRiskScore,
        secretFindingsCount: validated.secretFindings.length,
        cveFindingsCount: validated.cveFindings.length,
      },
    });

    return validated;
  }
}

export const securityAgent = new SecurityAgent();
