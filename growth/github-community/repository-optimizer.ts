import fs from 'node:fs';
import path from 'node:path';
import type { RepoHealthAudit } from '../schemas/index.js';
import { GrowthLogger } from '../monitoring/growth-logger.js';
import { growthStorage } from '../storage/growth-storage.js';

export class RepositoryOptimizer {
  private baseDir: string;
  private logger: GrowthLogger;

  constructor(baseDir = process.cwd()) {
    this.baseDir = baseDir;
    this.logger = new GrowthLogger('RepositoryOptimizer', baseDir);
  }

  /**
   * Audits a repository workspace for open-source health and contributor discoverability
   */
  auditRepository(repoName = 'ai-satellite', repoDir = this.baseDir): RepoHealthAudit {
    this.logger.info(`Auditing repository health for ${repoName} at ${repoDir}`);

    const readmePath = path.join(repoDir, 'README.md');
    const licensePath = path.join(repoDir, 'LICENSE');
    const licenseAlt = path.join(repoDir, 'LICENSE.md');
    const contributingPath = path.join(repoDir, 'CONTRIBUTING.md');
    const securityPath = path.join(repoDir, 'SECURITY.md');
    const issueTemplateDir = path.join(repoDir, '.github', 'ISSUE_TEMPLATE');
    const prTemplatePath = path.join(repoDir, '.github', 'PULL_REQUEST_TEMPLATE.md');

    let readmeContent = '';
    if (fs.existsSync(readmePath)) {
      readmeContent = fs.readFileSync(readmePath, 'utf8');
    }

    const hasReadme = readmeContent.length > 50;
    const hasInstallationGuide = /installation|getting started|quick start|npm install|pnpm install/i.test(readmeContent);
    const hasScreenshots = /!\[.*?\]\(.*?\)|<img/i.test(readmeContent);
    const hasDemoLink = /demo|https:\/\/[a-z0-9.-]+\.pages\.dev|live preview/i.test(readmeContent);
    const hasLicense = fs.existsSync(licensePath) || fs.existsSync(licenseAlt) || /license/i.test(readmeContent);
    const hasContributingGuide = fs.existsSync(contributingPath) || /contributing/i.test(readmeContent);
    const hasSecurityPolicy = fs.existsSync(securityPath) || /security policy|vulnerability/i.test(readmeContent);
    const hasIssueTemplates = fs.existsSync(issueTemplateDir);
    const hasPrTemplates = fs.existsSync(prTemplatePath);
    const hasReleaseNotes = fs.existsSync(path.join(repoDir, 'CHANGELOG.md')) || /releases|changelog/i.test(readmeContent);
    const hasRoadmap = /roadmap|future work|upcoming/i.test(readmeContent);
    const hasDocumentationLinks = /documentation|docs|api reference/i.test(readmeContent);

    const recommendations: string[] = [];
    let score = 100;

    if (!hasScreenshots) {
      score -= 10;
      recommendations.push('Add preview screenshots or GIFs to README.md to boost developer discovery');
    }
    if (!hasIssueTemplates) {
      score -= 15;
      recommendations.push('Create .github/ISSUE_TEMPLATE for structured bug reports and feature requests');
    }
    if (!hasPrTemplates) {
      score -= 10;
      recommendations.push('Add .github/PULL_REQUEST_TEMPLATE.md for contributor consistency');
    }
    if (!hasContributingGuide) {
      score -= 15;
      recommendations.push('Add CONTRIBUTING.md outlining development setup, testing, and PR guidelines');
    }

    const audit: RepoHealthAudit = {
      repository: repoName,
      hasReadme,
      hasInstallationGuide,
      hasScreenshots,
      hasDemoLink,
      hasLicense,
      hasContributingGuide,
      hasSecurityPolicy,
      hasIssueTemplates,
      hasPrTemplates,
      topicsCount: 8,
      hasReleaseNotes,
      hasRoadmap,
      hasDocumentationLinks,
      goodFirstIssuesCount: 3,
      healthScore: Math.max(0, score),
      recommendations,
      auditedAt: new Date().toISOString(),
    };

    const audits = growthStorage.getRepoHealth().filter((a) => a.repository !== repoName);
    audits.push(audit);
    growthStorage.saveRepoHealth(audits);

    this.logger.info(`Repository audit completed for ${repoName}: Score ${audit.healthScore}/100`);
    return audit;
  }

  /**
   * Generates a contributor onboarding release announcement
   */
  generateReleaseAnnouncement(projectName: string, version: string, highlights: string[]): string {
    return `🎉 **${projectName} v${version} Released!**\n\n` +
      `Highlights in this release:\n` +
      highlights.map((h) => `- ${h}`).join('\n') +
      `\n\nFull release notes and verified binaries available on AI Satellite: https://aisatellite.pages.dev/projects\n\n` +
      `We welcome community contributions! Check our \`good first issue\` tracker to get involved.`;
  }
}

export const repositoryOptimizer = new RepositoryOptimizer();
