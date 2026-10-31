import {
  type ReleaseCandidate,
  type TestReport,
  type SecurityReport,
} from '../../schemas';
import { releaseManager, type PrepareReleaseOptions } from '../../releases/release-manager';
import { auditLogger } from '../../monitoring/audit-logger';

export interface PrepareReleaseCandidateArgs {
  projectId: string;
  projectName: string;
  version: string;
  distDir: string;
  filesToPackage: string[];
  changelogNotes: string[];
  testReport: TestReport;
  securityReport: SecurityReport;
  repoUrl?: string;
}

export class ReleaseAgent {
  /**
   * Prepares release candidate ensuring all quality & security gates are satisfied
   */
  public async prepareRelease(args: PrepareReleaseCandidateArgs): Promise<ReleaseCandidate> {
    // Gate 1: Test Report must be passed with 0 failures
    if (args.testReport.status !== 'passed' || args.testReport.failed > 0) {
      throw new Error(
        `Release gate failed: Automated tests failed (${args.testReport.failed} failing tests). Cannot create release candidate.`
      );
    }

    // Gate 2: Security Report must not be blocked
    if (args.securityReport.isBlocked) {
      throw new Error(
        `Release gate failed: Security review blocked. Issues: ${args.securityReport.licenseCheck.issues.join(', ')}`
      );
    }

    // Gate 3: License check must be valid
    if (!args.securityReport.licenseCheck.valid) {
      throw new Error(
        `Release gate failed: Invalid or incompatible project license.`
      );
    }

    const releaseOpts: PrepareReleaseOptions = {
      projectId: args.projectId,
      projectName: args.projectName,
      version: args.version,
      distDir: args.distDir,
      filesToPackage: args.filesToPackage,
      changelogNotes: args.changelogNotes,
      repoUrl: args.repoUrl,
    };

    const candidate = releaseManager.prepareReleaseCandidate(releaseOpts);

    auditLogger.log({
      actor: 'release-agent',
      action: 'stage_release_candidate',
      projectId: args.projectId,
      details: {
        releaseId: candidate.releaseId,
        version: candidate.version,
        artifactsCount: candidate.artifacts.length,
      },
    });

    return candidate;
  }
}

export const releaseAgent = new ReleaseAgent();
