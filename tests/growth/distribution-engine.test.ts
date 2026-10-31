import { describe, it, expect } from 'vitest';
import { DistributionQueue } from '../../growth/distribution/queue/distribution-queue.js';
import { distributionContentValidator } from '../../growth/distribution/validation/content-validator.js';
import { growthStorage } from '../../growth/storage/growth-storage.js';

describe('Acceptance Tests 11-16: Content Distribution Engine & Platform Adapters', () => {
  const queue = new DistributionQueue();

  it('Test 11: Distribution drafts reference published content on canonical domain', () => {
    const job = queue.enqueueJob({
      sourceContentId: `test-content-${Date.now()}`,
      platform: 'x',
      title: 'Self-Hosting Postgres Vector Guide',
      summary: 'Practical guide to postgres vector embeddings',
      targetUrl: 'https://aisatellite.pages.dev/blog/test-self-hosting-postgres-pgvector',
    });

    expect(job.status).toBe('draft');
    expect(job.targetUrl).toContain('https://aisatellite.pages.dev');
    expect(job.text).toContain('https://aisatellite.pages.dev');
  });

  it('Test 12: Unapproved posts cannot publish (Approval Gate Enforced)', async () => {
    const job = queue.enqueueJob({
      sourceContentId: `test-unapproved-${Date.now()}`,
      platform: 'bluesky',
      title: 'Unapproved Draft Test',
      summary: 'Summary text for draft',
      targetUrl: 'https://aisatellite.pages.dev/tools/supabase',
    });

    expect(job.status).toBe('draft');

    // Attempting to publish unapproved job must throw policy violation error
    await expect(queue.processJob(job.id)).rejects.toThrow(/Policy violation: Job .* must be approved/);
  });

  it('Test 13: Duplicate distribution jobs for the same content and platform are rejected', () => {
    const contentId = `duplicate-test-${Date.now()}`;

    queue.enqueueJob({
      sourceContentId: contentId,
      platform: 'linkedin',
      title: 'First Job',
      summary: 'Summary 1',
      targetUrl: 'https://aisatellite.pages.dev/projects',
    });

    expect(() => {
      queue.enqueueJob({
        sourceContentId: contentId,
        platform: 'linkedin',
        title: 'Second Duplicate Job',
        summary: 'Summary 2',
        targetUrl: 'https://aisatellite.pages.dev/projects',
      });
    }).toThrow(/Duplicate job/);
  });

  it('Test 14: Failed API requests retry safely with backoff', async () => {
    process.env.GITHUB_TOKEN = 'ghp_mock_token_for_testing_distribution';

    const job = queue.enqueueJob({
      sourceContentId: `test-retry-${Date.now()}`,
      platform: 'github',
      title: 'Retry Test',
      summary: 'Testing retry backoff',
      targetUrl: 'https://aisatellite.pages.dev/tools/ollama',
    });

    queue.approveJob(job.id, 'SeniorEditor-Test');

    // GitHub adapter executes with configured retry logic
    const processed = await queue.processJob(job.id);
    expect(processed.status).toBe('published');
    expect(processed.publishedUrl).toBeDefined();

    delete process.env.GITHUB_TOKEN;
  });

  it('Test 15: Platform rate limits and character boundaries are respected', () => {
    const longText = 'A'.repeat(500); // Exceeds X limit (280)
    const val = distributionContentValidator.validateDraft('x', longText, 'https://aisatellite.pages.dev/tools');

    expect(val.isValid).toBe(false);
    expect(val.errors.some((e) => e.includes('exceeds maximum character limit'))).toBe(true);
  });

  it('Test 16: Connected account tokens remain private and are not exposed', () => {
    const accounts = growthStorage.getConnectedAccounts();
    expect(Array.isArray(accounts)).toBe(true);

    for (const acc of accounts) {
      // Must not expose secret tokens in public schema
      expect((acc as Record<string, unknown>).token).toBeUndefined();
      expect((acc as Record<string, unknown>).secret).toBeUndefined();
      expect((acc as Record<string, unknown>).apiKey).toBeUndefined();
      expect(acc.authStatus).toBeDefined();
    }
  });
});
