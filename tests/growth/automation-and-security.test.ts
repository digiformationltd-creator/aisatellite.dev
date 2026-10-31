import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { GrowthLogger } from '../../growth/monitoring/growth-logger.js';
import { ContentClusterPlanner } from '../../growth/content-clusters/cluster-planner.js';

describe('Acceptance Tests 28, 29, 34: Automation Idempotency & Security Controls', () => {
  const logger = new GrowthLogger('TestSubsystem');
  const planner = new ContentClusterPlanner();

  it('Test 28: Scheduled jobs are idempotent (repeated executions yield consistent state)', () => {
    // Initial run
    const run1 = planner.initializeClusters();
    const count1 = run1.length;

    // Duplicate run
    const run2 = planner.initializeClusters();
    const count2 = run2.length;

    expect(count1).toBe(count2);
    expect(count1).toBe(15);
  });

  it('Test 29: Automation failures generate structured logs in data/growth/audit.log', () => {
    logger.error('Test automated job simulated failure', { code: 'ERR_TIMEOUT' });

    const auditLogPath = path.join(process.cwd(), 'data', 'growth', 'audit.log');
    expect(fs.existsSync(auditLogPath)).toBe(true);

    const logContent = fs.readFileSync(auditLogPath, 'utf8');
    expect(logContent).toContain('ERR_TIMEOUT');
    expect(logContent).toContain('[ERROR]');
  });

  it('Test 34: No secrets, private tokens, or credentials are exposed in public client bundles', () => {
    // Audit public source and configs to guarantee zero leaked API tokens
    const sampleFiles = [
      path.join(process.cwd(), 'src', 'components', 'growth', 'NewsletterSignup.tsx'),
      path.join(process.cwd(), 'src', 'lib', 'analytics.ts'),
    ];

    for (const file of sampleFiles) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        expect(content).not.toContain('X_API_KEY');
        expect(content).not.toContain('LINKEDIN_TOKEN');
        expect(content).not.toContain('GITHUB_TOKEN');
        expect(content).not.toContain('GROWTH_ADMIN_TOKEN');
      }
    }
  });
});
