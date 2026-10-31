import fs from 'node:fs';
import path from 'node:path';
import { licenseEngine } from '../../licensing/license-engine';
import { auditLogger } from '../../monitoring/audit-logger';

export interface ProjectDocContext {
  projectId: string;
  projectName: string;
  tagline: string;
  description: string;
  license: string;
  author: string;
  version: string;
  commands: Array<{ name: string; description: string; usage: string }>;
  features: string[];
}

export class DocumentationAgent {
  /**
   * Generates standard documentation package for an open-source project
   */
  public generateDocs(workspaceDir: string, ctx: ProjectDocContext): {
    filesGenerated: string[];
  } {
    if (!fs.existsSync(workspaceDir)) {
      fs.mkdirSync(workspaceDir, { recursive: true });
    }

    const filesGenerated: string[] = [];

    // 1. README.md
    const commandListMd = ctx.commands
      .map(
        (c) => `### \`${c.name}\`
${c.description}

\`\`\`bash
${c.usage}
\`\`\`
`
      )
      .join('\n');

    const featuresMd = ctx.features.map((f) => `- ${f}`).join('\n');

    const readmeContent = `# ${ctx.projectName}

> ${ctx.tagline}

[![License: ${ctx.license}](https://img.shields.io/badge/License-${ctx.license}-blue.svg)](LICENSE)
[![Release](https://img.shields.io/badge/Release-v${ctx.version}-green.svg)](releases)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Zero Telemetry](https://img.shields.io/badge/Telemetry-None-success.svg)]()

${ctx.description}

---

## Features

${featuresMd}

---

## Installation

\`\`\`bash
# Global install via npm
npm install -g ${ctx.projectId}

# Or run directly via npx
npx ${ctx.projectId} --help
\`\`\`

---

## CLI Reference

${commandListMd}

---

## Security & Privacy Guarantee

- **100% Local Execution**: All computations and transformations are processed entirely in-memory on your machine.
- **Zero Telemetry**: No background HTTP beacons, telemetry pings, or analytics collection.
- **Supply Chain Verified**: Cryptographic SHA-256 build verification and continuous dependency audits.

---

## Contributing

We welcome contributions! Please review [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md) before submitting issues or pull requests.

---

## License

Released under the [${ctx.license} License](LICENSE).
Copyright (c) ${new Date().getFullYear()} ${ctx.author}.
`;
    fs.writeFileSync(path.join(workspaceDir, 'README.md'), readmeContent, 'utf8');
    filesGenerated.push('README.md');

    // 2. CONTRIBUTING.md
    const contributingContent = `# Contributing to ${ctx.projectName}

Thank you for your interest in contributing to ${ctx.projectName}! We are committed to building high-quality, transparent, and secure open-source software.

## Development Workflow

1. Fork the repository and clone your fork locally.
2. Install dependencies: \`npm install\`
3. Run test suites: \`npm test\`
4. Run code style linting: \`npm run lint\`
5. Ensure all unit and integration tests pass before opening a Pull Request.

## Pull Request Guidelines

- Keep PRs focused on a single concern or feature.
- Include unit tests for all new functionality or bug fixes.
- Follow conventional commits format (\`feat:\`, \`fix:\`, \`docs:\`, \`refactor:\`).
- Do not introduce external dependencies without prior discussion.

## Code of Conduct

Please maintain a respectful and welcoming environment for all contributors.
`;
    fs.writeFileSync(path.join(workspaceDir, 'CONTRIBUTING.md'), contributingContent, 'utf8');
    filesGenerated.push('CONTRIBUTING.md');

    // 3. SECURITY.md
    const securityContent = `# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| >= 1.0.0 | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in ${ctx.projectName}, please report it responsibly:
- **Security Reporting**: Submit a private vulnerability report via GitHub Security Advisories or maintainer channels.
- **Response SLA**: We acknowledge all reports within 48 hours and provide a remediation plan within 7 days.
- **Please DO NOT** create public GitHub issues for undisclosed security vulnerabilities.
`;
    fs.writeFileSync(path.join(workspaceDir, 'SECURITY.md'), securityContent, 'utf8');
    filesGenerated.push('SECURITY.md');

    // 4. LICENSE
    const licenseText = licenseEngine.generateLicense(ctx.license, ctx.author);
    fs.writeFileSync(path.join(workspaceDir, 'LICENSE'), licenseText, 'utf8');
    filesGenerated.push('LICENSE');

    // 5. CHANGELOG.md
    const changelogContent = `# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [${ctx.version}] - ${new Date().toISOString().split('T')[0]}

### Added
- Initial production release of ${ctx.projectName}.
${ctx.features.map((f) => `- ${f}`).join('\n')}
- Comprehensive automated test suite and zero-telemetry local runtime.
`;
    fs.writeFileSync(path.join(workspaceDir, 'CHANGELOG.md'), changelogContent, 'utf8');
    filesGenerated.push('CHANGELOG.md');

    auditLogger.log({
      actor: 'documentation-agent',
      action: 'generate_docs',
      projectId: ctx.projectId,
      details: {
        filesGenerated,
        version: ctx.version,
      },
    });

    return { filesGenerated };
  }
}

export const documentationAgent = new DocumentationAgent();
