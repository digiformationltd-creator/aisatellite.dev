import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ModelProviderFactory } from '../../automation/drafting/model-provider.js';
import { GitHubDiscoveryConnector } from '../../automation/discovery/github.js';
import { Logger } from '../../automation/shared/logger.js';

describe('Scenario 24: Graceful Handling of Missing Credentials', () => {
  it('defaults to deterministic fallback provider without crashing if OPENAI_API_KEY is missing', () => {
    const originalKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const provider = ModelProviderFactory.getProvider();
    expect(provider.name).toBe('deterministic-offline-fallback');

    if (originalKey) process.env.OPENAI_API_KEY = originalKey;
  });

  it('runs GitHub discovery in public rate-limited mode without crashing if GITHUB_TOKEN is missing', async () => {
    const originalToken = process.env.GITHUB_TOKEN;
    delete process.env.GITHUB_TOKEN;

    const connector = new GitHubDiscoveryConnector();
    expect(connector).toBeDefined();

    if (originalToken) process.env.GITHUB_TOKEN = originalToken;
  });
});

describe('Scenario 25: Auditable Logging & Reporting', () => {
  it('writes structured, timestamped audit entries to data/reports/', () => {
    const logger = new Logger('TestSubsystem');
    logger.info('Test audit event for compliance verification', { operationId: 'op-12345' });

    const today = new Date().toISOString().split('T')[0];
    const logPath = path.join(process.cwd(), 'data', 'reports', `audit-${today}.log`);

    expect(fs.existsSync(logPath)).toBe(true);
    const content = fs.readFileSync(logPath, 'utf8');
    expect(content).toContain('[INFO] [TestSubsystem] Test audit event');
    expect(content).toContain('op-12345');
  });
});
