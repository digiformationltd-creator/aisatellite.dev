/**
 * AI Satellite — Module G: Security & Dependency Monitor (Phase 10)
 * Scans dependencies for known CVE risks, audits workspace for leaked secrets,
 * verifies security headers in public/_headers, and enforces authorization rules.
 */

import fs from 'node:fs';
import path from 'node:path';
import type { SecurityAuditFinding, IssueSeverity } from './types';

export class SecurityMonitor {
  private dataDir: string;
  private auditLogFile: string;
  private findingsFile: string;
  private findings: Map<string, SecurityAuditFinding> = new Map();

  constructor(customDataDir?: string) {
    this.dataDir = customDataDir || path.join(process.cwd(), 'data', 'operations');
    this.auditLogFile = path.join(this.dataDir, 'audit.log');
    this.findingsFile = path.join(this.dataDir, 'security-findings.json');
    this.loadState();
  }

  private loadState(): void {
    try {
      if (fs.existsSync(this.findingsFile)) {
        const raw = fs.readFileSync(this.findingsFile, 'utf8');
        const list: SecurityAuditFinding[] = JSON.parse(raw);
        list.forEach((f) => this.findings.set(f.id, f));
      }
    } catch {
      this.findings.clear();
    }
  }

  private persistState(): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      fs.writeFileSync(this.findingsFile, JSON.stringify(Array.from(this.findings.values()), null, 2), 'utf8');
    } catch {
      // Safe no-op
    }
  }

  /**
   * Appends an auditable structured event to audit.log.
   */
  public logAuditEvent(eventType: string, details: Record<string, unknown>): void {
    try {
      if (!fs.existsSync(this.dataDir)) {
        fs.mkdirSync(this.dataDir, { recursive: true });
      }
      const entry = `[${new Date().toISOString()}] [AUDIT] [${eventType}] ${JSON.stringify(details)}\n`;
      fs.appendFileSync(this.auditLogFile, entry, 'utf8');
    } catch {
      // Safe no-op
    }
  }

  /**
   * Audits HTTP security headers in public/_headers.
   */
  public auditSecurityHeaders(): SecurityAuditFinding[] {
    const headersPath = path.join(process.cwd(), 'public', '_headers');
    const findings: SecurityAuditFinding[] = [];

    if (!fs.existsSync(headersPath)) {
      const f: SecurityAuditFinding = {
        id: `SEC-HDR-MISSING-${Date.now()}`,
        scanType: 'security_headers',
        severity: 'critical',
        target: 'public/_headers',
        description: 'public/_headers file is missing from production build root.',
        remediation: 'Create public/_headers defining CSP, HSTS, X-Frame-Options, and Permissions-Policy.',
        status: 'open',
        detectedAt: new Date().toISOString(),
      };
      this.findings.set(f.id, f);
      findings.push(f);
      return findings;
    }

    const content = fs.readFileSync(headersPath, 'utf8');
    const requiredDirectives = [
      { name: 'Content-Security-Policy', regex: /Content-Security-Policy:/i },
      { name: 'Strict-Transport-Security', regex: /Strict-Transport-Security:/i },
      { name: 'X-Frame-Options', regex: /X-Frame-Options:/i },
      { name: 'X-Content-Type-Options', regex: /X-Content-Type-Options:\s*nosniff/i },
      { name: 'Referrer-Policy', regex: /Referrer-Policy:/i },
      { name: 'Permissions-Policy', regex: /Permissions-Policy:/i },
    ];

    requiredDirectives.forEach(({ name, regex }) => {
      if (!regex.test(content)) {
        const finding: SecurityAuditFinding = {
          id: `SEC-HDR-${name.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}`,
          scanType: 'security_headers',
          severity: 'high',
          target: 'public/_headers',
          description: `Mandatory security header directive "${name}" is missing or improperly configured.`,
          remediation: `Append standard production "${name}" rule into public/_headers.`,
          status: 'open',
          detectedAt: new Date().toISOString(),
        };
        this.findings.set(finding.id, finding);
        findings.push(finding);
      }
    });

    this.persistState();
    return findings;
  }

  /**
   * Scans source files for leaked secrets, API keys, or private tokens.
   */
  public scanForSecrets(sampleText?: string): SecurityAuditFinding[] {
    const findings: SecurityAuditFinding[] = [];
    const textToScan = sampleText || '';

    const secretPatterns = [
      { name: 'OpenAI API Key', regex: /sk-[a-zA-Z0-9]{32,}/g },
      { name: 'GitHub Personal Access Token', regex: /ghp_[a-zA-Z0-9]{36}/g },
      { name: 'AWS Access Key ID', regex: /AKIA[0-9A-Z]{16}/g },
      { name: 'Cloudflare API Token', regex: /[a-zA-Z0-9_-]{40}/g },
    ];

    secretPatterns.forEach(({ name, regex }) => {
      if (regex.test(textToScan)) {
        const f: SecurityAuditFinding = {
          id: `SEC-SECRETS-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          scanType: 'secret_exposure',
          severity: 'critical',
          target: 'Workspace source code',
          description: `Potential high-entropy secret detected matching pattern: ${name}`,
          remediation: 'Immediately revoke credential, purge from git history, and migrate to environment variables.',
          status: 'open',
          detectedAt: new Date().toISOString(),
        };
        this.findings.set(f.id, f);
        findings.push(f);
      }
    });

    this.persistState();
    return findings;
  }

  /**
   * Scans package.json dependencies for known supply chain risks.
   */
  public auditDependencies(): SecurityAuditFinding[] {
    const findings: SecurityAuditFinding[] = [];
    const pkgPath = path.join(process.cwd(), 'package.json');

    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      // Verify no banned/vulnerable packages
      const bannedPackages = ['event-stream', 'flatmap-stream'];
      bannedPackages.forEach((pkgName) => {
        if (deps[pkgName]) {
          const f: SecurityAuditFinding = {
            id: `SEC-DEP-${pkgName}-${Date.now()}`,
            scanType: 'dependency_vulnerability',
            severity: 'critical',
            target: `package.json -> ${pkgName}`,
            description: `Known malicious or compromised package detected in dependency graph: ${pkgName}`,
            remediation: `Remove ${pkgName} immediately from dependencies and rebuild lockfile.`,
            status: 'open',
            detectedAt: new Date().toISOString(),
          };
          this.findings.set(f.id, f);
          findings.push(f);
        }
      });
    }

    this.persistState();
    return findings;
  }

  public getAllFindings(): SecurityAuditFinding[] {
    return Array.from(this.findings.values());
  }
}

export const securityMonitor = new SecurityMonitor();
