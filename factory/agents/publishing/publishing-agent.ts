import fs from 'node:fs';
import path from 'node:path';
import {
  type ReleaseCandidate,
  type FactoryProject,
} from '../../schemas';
import { auditLogger } from '../../monitoring/audit-logger';

export interface PublishProjectArgs {
  project: FactoryProject;
  releaseCandidate: ReleaseCandidate;
  tagline: string;
  family?: string;
  techStack: string[];
  features: string[];
  installationSteps?: string[];
  projectsContentDir?: string;
}

export class PublishingAgent {
  /**
   * Publishes an approved release candidate to the public Astro website
   */
  public async publishToAstro(args: PublishProjectArgs): Promise<{
    publishedFilePath: string;
    publishedSlug: string;
  }> {
    // Stage Gate: Release Candidate must be explicitly approved by human
    if (args.releaseCandidate.status !== 'approved' || !args.releaseCandidate.approvalRecord) {
      throw new Error(
        `Human approval gate violation: Release candidate ${args.releaseCandidate.releaseId} has not been approved by a human maintainer.`
      );
    }

    const contentDir =
      args.projectsContentDir ||
      path.resolve(process.cwd(), 'src/content/projects');

    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }

    const slug = args.project.slug;
    const filePath = path.join(contentDir, `${slug}.md`);

    const downloadsYaml = args.releaseCandidate.artifacts
      .map(
        (art) => `  - platform: "${art.platform}"
    version: "${args.releaseCandidate.version}"
    filename: "${art.filename}"
    url: "${art.url}"
    size: "${(art.sizeBytes / 1024).toFixed(1)} KB"
    sha256: "${art.sha256}"`
      )
      .join('\n');

    const featuresYaml = args.features.map((f) => `  - "${f}"`).join('\n');
    const techStackYaml = args.techStack.map((t) => `  - "${t}"`).join('\n');
    const installStepsYaml = (
      args.installationSteps || [
        `npm install -g ${args.project.slug}`,
        `${args.project.slug} --help`,
      ]
    )
      .map((s) => `  - "${s}"`)
      .join('\n');

    const changelogLines = args.releaseCandidate.changelog
      .split('\n')
      .filter((l) => l.trim().startsWith('-'))
      .map((l) => `      - "${l.replace(/^-\s*/, '').replace(/"/g, '\\"')}"`)
      .join('\n');

    const frontmatter = `---
title: "${args.project.name}"
tagline: "${args.tagline}"
family: "${args.family || 'Developer Utilities'}"
description: "${args.project.description.replace(/"/g, '\\"')}"
techStack:
${techStackYaml}
openSourceLicense: "${args.project.license}"
repositoryUrl: "${args.project.repositoryUrl || `https://github.com/aisatellite-org/${slug}`}"
documentationUrl: "https://aisatellite.pages.dev/projects/${slug}"
verificationStatus: "verified"
features:
${featuresYaml}
version: "${args.releaseCandidate.version}"
releaseDate: "${new Date().toISOString().split('T')[0]}"
githubRepo: "aisatellite-org/${slug}"
downloads:
${downloadsYaml}
docsOverview: "Autonomous open-source software release from the AI Satellite Software Factory. Verified with cryptographic SHA-256 integrity checksums."
changelogItems:
  - version: "${args.releaseCandidate.version}"
    date: "${new Date().toISOString().split('T')[0]}"
    changes:
${changelogLines || '      - "Initial production-grade open-source release."'}
installationSteps:
${installStepsYaml}
published: true
---

# ${args.project.name}

> ${args.tagline}

Autonomous open-source software built and verified by the **AI Satellite Software Factory**.

## Overview

${args.project.description}

### Verified Integrity Hashes

Every production binary and archive is built in an isolated sandbox, evaluated against strict license and security scanning, and signed with SHA-256 checksums:

| File | Platform | SHA-256 Checksum |
| ---- | -------- | ---------------- |
${args.releaseCandidate.artifacts.map((a) => `| \`${a.filename}\` | \`${a.platform}\` | \`${a.sha256}\` |`).join('\n')}

---

## Zero Telemetry & Local Execution

This software runs entirely client-side on your workstation with **zero telemetry**, **zero background beacons**, and **complete local autonomy**.
`;

    fs.writeFileSync(filePath, frontmatter, 'utf8');

    auditLogger.log({
      actor: 'publishing-agent',
      action: 'publish_to_astro',
      projectId: args.project.id,
      details: {
        slug,
        filePath,
        version: args.releaseCandidate.version,
        approvedBy: args.releaseCandidate.approvalRecord.approvedBy,
      },
    });

    return {
      publishedFilePath: filePath,
      publishedSlug: slug,
    };
  }
}

export const publishingAgent = new PublishingAgent();
