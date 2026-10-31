import crypto from 'node:crypto';
import {
  type ProductProposal,
  type ProductRequirementDocument,
  PRDSchema,
} from '../../schemas';
import { auditLogger } from '../../monitoring/audit-logger';

export class ProductAgent {
  public async generatePRD(proposal: ProductProposal): Promise<ProductRequirementDocument> {
    const prd: ProductRequirementDocument = {
      prdId: `prd_${proposal.projectId}_${crypto.randomBytes(4).toString('hex')}`,
      projectId: proposal.projectId,
      version: '1.0.0',
      executiveSummary: `Production specification for ${proposal.name}. Solves the developer productivity gap with a zero-telemetry, lightweight open-source tool.`,
      problemDefinition: proposal.problemStatement,
      targetUsers: proposal.targetUsers,
      userStories: [
        `As a developer, I want fast offline CLI utilities so that I can transform data without browser context switching.`,
        `As a security-conscious engineer, I want zero external network calls so my private tokens and secrets are never leaked.`,
        `As a DevOps engineer, I want predictable exit codes and JSON output so I can pipe utilities in CI/CD workflows.`,
      ],
      coreFeatures: proposal.mvpFeatures,
      nonGoals: proposal.excludedFeatures.length > 0 ? proposal.excludedFeatures : [
        'Cloud syncing or hosted web services',
        'Proprietary telemetry tracking',
        'User account management',
      ],
      technicalRequirements: [
        'Pure TypeScript runtime compatible with Node.js 18+ and 20+',
        'Zero external runtime dependencies where native APIs suffice',
        'Fast execution startup latency under 150ms',
        'Cross-platform support for Windows, macOS, and Linux',
      ],
      securityRequirements: [
        'Sanitize all input buffers and CLI argument strings',
        'Do not evaluate untrusted strings dynamically with eval()',
        'No telemetry or background network beaconing',
      ],
      privacyRequirements: [
        'All data processing must happen strictly in-memory or on local disk',
        'No remote telemetry or analytics collection',
      ],
      accessibilityRequirements: [
        'High contrast terminal color scheme compatible with NO_COLOR standard',
        'Full keyboard accessibility and terminal screen reader compatibility',
      ],
      performanceRequirements: [
        'CLI cold start time < 150ms',
        'Peak memory footprint < 64MB for standard file transformations',
      ],
      acceptanceTests: [
        'All unit test suites pass with 100% success rate',
        'JSON and hash outputs match deterministic standard test vectors',
        'Help menu and subcommands exit with code 0 on valid inputs',
        'Invalid command options exit gracefully with descriptive error messages and code 1',
      ],
      releaseCriteria: [
        '100% unit test pass rate',
        'Zero critical or high security vulnerabilities in npm audit',
        'Valid OSI-approved LICENSE file present in repository root',
        'Production distribution build generates verified SHA-256 artifacts',
        'Human maintainer approval recorded in release candidate',
      ],
      knownRisks: [
        'Node.js runtime version compatibility on legacy developer machines',
        'Terminal encoding differences across legacy Windows cmd.exe vs PowerShell',
      ],
      futureRoadmap: [
        'Native binary compilation via pkg or bun',
        'Shell auto-completion scripts for zsh and fish',
      ],
      approved: false,
      createdAt: new Date().toISOString(),
    };

    const validated = PRDSchema.parse(prd);

    auditLogger.log({
      actor: 'product-agent',
      action: 'generate_prd',
      projectId: proposal.projectId,
      details: {
        prdId: validated.prdId,
        version: validated.version,
      },
    });

    return validated;
  }
}

export const productAgent = new ProductAgent();
