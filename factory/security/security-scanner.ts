import fs from 'node:fs';
import path from 'node:path';
import {
  type SecurityReport,
  type SecurityFinding,
  type DependencyFinding,
  SecurityReportSchema,
} from '../schemas/index.js';
import { auditLogger } from '../monitoring/audit-logger.js';

export class SecurityScanner {
  private secretPatterns: Array<{ rule: string; regex: RegExp; severity: 'high' | 'critical' }> = [
    { rule: 'OpenAI API Key', regex: /sk-[a-zA-Z0-9_\-]{20,}/g, severity: 'critical' },
    { rule: 'GitHub Personal Access Token', regex: /gh[pousr]_[a-zA-Z0-9]{36,}/g, severity: 'critical' },
    { rule: 'AWS Access Key ID', regex: /AKIA[0-9A-Z]{16}/g, severity: 'high' },
    { rule: 'Private Key', regex: /-----BEGIN ((RSA|EC|DSA|OPENSSH) )?PRIVATE KEY-----/g, severity: 'critical' },
    { rule: 'Slack / Discord Webhook URL', regex: /https:\/\/(hooks\.slack\.com|discord\.com\/api\/webhooks)\/[^\s"']+/g, severity: 'high' },
    { rule: 'Hardcoded Bearer Token', regex: /Bearer\s+[a-zA-Z0-9_.\-]{30,}/g, severity: 'high' },
  ];

  /**
   * Scans a target directory for hardcoded secrets and credentials
   */
  scanSecrets(dirPath: string): SecurityFinding[] {
    const findings: SecurityFinding[] = [];
    if (!fs.existsSync(dirPath)) return findings;

    const walk = (currentDir: string) => {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          if (!['node_modules', '.git', 'dist', 'build', '.astro'].includes(entry.name)) {
            walk(fullPath);
          }
        } else if (entry.isFile()) {
          // Scan only code / text files
          const ext = path.extname(entry.name).toLowerCase();
          if (['.ts', '.tsx', '.js', '.jsx', '.json', '.env', '.yaml', '.yml', '.py', '.md'].includes(ext)) {
            try {
              const content = fs.readFileSync(fullPath, 'utf-8');
              const lines = content.split('\n');

              for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
                const line = lines[lineIdx];
                for (const pattern of this.secretPatterns) {
                  pattern.regex.lastIndex = 0; // reset
                  if (pattern.regex.test(line)) {
                    findings.push({
                      file: path.relative(dirPath, fullPath).replace(/\\/g, '/'),
                      line: lineIdx + 1,
                      rule: pattern.rule,
                      snippet: line.trim().substring(0, 80),
                      severity: pattern.severity,
                    });
                  }
                }
              }
            } catch {
              // Ignore unreadable binary files
            }
          }
        }
      }
    };

    walk(dirPath);
    return findings;
  }

  /**
   * Scans a single file string for secret patterns
   */
  scanFileContent(filename: string, content: string): SecurityFinding[] {
    const findings: SecurityFinding[] = [];
    const lines = content.split(/\r?\n/);

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      for (const pattern of this.secretPatterns) {
        const regex = new RegExp(pattern.regex.source, 'i');
        if (regex.test(line)) {
          findings.push({
            file: filename,
            line: lineIdx + 1,
            rule: pattern.rule,
            snippet: line.trim().substring(0, 80),
            severity: pattern.severity,
          });
        }
      }
    }

    return findings;
  }

  /**
   * Audits dependencies in package.json for known dangerous packages or suspicious lifecycle scripts
   */
  scanDependencies(packageJsonInput: string | Record<string, unknown>): DependencyFinding[] {
    const findings: DependencyFinding[] = [];
    let content: Record<string, any> = {};

    if (typeof packageJsonInput === 'object' && packageJsonInput !== null) {
      content = packageJsonInput;
    } else if (typeof packageJsonInput === 'string') {
      if (!fs.existsSync(packageJsonInput)) return findings;
      try {
        content = JSON.parse(fs.readFileSync(packageJsonInput, 'utf-8'));
      } catch {
        return findings;
      }
    } else {
      return findings;
    }

    try {
      // Check for arbitrary execution scripts
      const scripts = content.scripts || {};
      for (const [scriptName, cmd] of Object.entries(scripts)) {
        if (['preinstall', 'postinstall'].includes(scriptName)) {
          if (typeof cmd === 'string' && (cmd.includes('curl') || cmd.includes('wget') || cmd.includes('bash') || cmd.includes('sh'))) {
            findings.push({
              package: 'lifecycle-script:' + scriptName,
              version: 'manifest',
              severity: 'critical',
              title: `Suspicious remote execution in ${scriptName}: "${cmd}"`,
            });
          }
        }
      }

      // Check known vulnerable / malicious placeholder packages
      const allDeps = {
        ...(content.dependencies || {}),
        ...(content.devDependencies || {}),
      };

      const KNOWN_RISKY = [
        'event-stream@3.3.6',
        'flatmap-stream',
        'colors@1.4.1',
        'faker@6.6.6',
      ];

      for (const [pkg, ver] of Object.entries(allDeps)) {
        const fullSpec = `${pkg}@${ver}`;
        if (KNOWN_RISKY.includes(fullSpec) || KNOWN_RISKY.includes(pkg)) {
          findings.push({
            package: pkg,
            version: String(ver),
            severity: 'critical',
            title: `Known compromised dependency: ${pkg}`,
            advisoryUrl: 'https://osv.dev',
          });
        }
      }
    } catch {
      // Manifest parse failure
    }

    return findings;
  }

  /**
   * Runs an end-to-end security audit on a project workspace
   */
  runAudit(projectId: string, workspaceDir: string, projectLicense = 'MIT'): SecurityReport {
    const secretFindings = this.scanSecrets(workspaceDir);
    const packageJsonPath = path.join(workspaceDir, 'package.json');
    const cveFindings = this.scanDependencies(packageJsonPath);

    // Compute Risk Score
    let riskScore = 0;
    for (const f of secretFindings) {
      if (f.severity === 'critical') riskScore += 40;
      else if (f.severity === 'high') riskScore += 20;
    }
    for (const d of cveFindings) {
      if (d.severity === 'critical') riskScore += 50;
      else if (d.severity === 'high') riskScore += 25;
    }

    const normalizedRiskScore = Math.min(100, riskScore);
    const hasCritical = secretFindings.some((s) => s.severity === 'critical') || cveFindings.some((c) => c.severity === 'critical');
    const isBlocked = hasCritical || normalizedRiskScore >= 50;

    const report: SecurityReport = SecurityReportSchema.parse({
      reportId: `sec-${Date.now()}-${projectId}`,
      projectId,
      cveFindings,
      secretFindings,
      licenseCheck: {
        valid: Boolean(projectLicense),
        license: projectLicense || 'UNKNOWN',
        compatible: true,
        issues: projectLicense ? [] : ['Missing license declaration'],
      },
      overallRiskScore: normalizedRiskScore,
      isBlocked,
      notes: [
        `Audit completed. Discovered ${secretFindings.length} secret anomalies and ${cveFindings.length} dependency advisories.`,
        isBlocked ? 'RELEASE GATE: BLOCKED by security policy.' : 'RELEASE GATE: PASSED. No blocking security defects.',
      ],
      createdAt: new Date().toISOString(),
    });

    auditLogger.log(
      'SecurityScanner',
      'SECURITY_SCAN_COMPLETED',
      {
        projectId,
        riskScore: normalizedRiskScore,
        isBlocked,
        secretsCount: secretFindings.length,
        cveCount: cveFindings.length,
      },
      projectId
    );

    return report;
  }
}

export const securityScanner = new SecurityScanner();
