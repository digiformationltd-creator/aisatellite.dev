import { describe, it, expect } from 'vitest';
import { LicenseVerifier } from '../../automation/verification/license.js';
import { PricingVerifier } from '../../automation/verification/pricing.js';
import { LinkVerifier } from '../../automation/verification/links.js';
import { FreshnessMonitor } from '../../automation/monitoring/freshness.js';
import { StorageEngine } from '../../automation/shared/storage.js';
import type { DiscoveredResource } from '../../automation/shared/types.js';

describe('Scenario 4 & 5: License Verification Invariants', () => {
  it('classifies missing license as unverified and not open source', () => {
    const result = LicenseVerifier.verify(undefined);
    expect(result.isIdentified).toBe(false);
    expect(result.isOpenSource).toBe(false);
    expect(result.notes).toContain('No license information provided');
  });

  it('does NOT classify public repository with proprietary or custom license as open source', () => {
    const result = LicenseVerifier.verify('Custom-Commercial-Only');
    expect(result.isOpenSource).toBe(false);
    expect(result.notes).toContain('not standard OSI-approved');
  });

  it('correctly verifies standard OSI-approved permissive and copyleft licenses', () => {
    const mit = LicenseVerifier.verify('MIT');
    expect(mit.isOpenSource).toBe(true);
    expect(mit.isPermissive).toBe(true);

    const agpl = LicenseVerifier.verify('AGPL-3.0');
    expect(agpl.isOpenSource).toBe(true);
    expect(agpl.isCopyleft).toBe(true);
  });
});

describe('Scenario 6: Free Tier Classification Invariant', () => {
  it('rejects classifying a free trial as free forever', () => {
    const result = PricingVerifier.evaluate({
      isOpenSource: false,
      isFreeTrialOnly: true,
      hasPerpetualFreeTier: false,
      pricingPageText: 'Start your 14-day trial today with full feature access.',
    });

    expect(result.classification).toBe('free_trial');
    expect(result.classification).not.toBe('free_forever');
    expect(result.limitations).toContain('Time-limited access only');
  });

  it('correctly distinguishes open source from freemium and free forever', () => {
    const foss = PricingVerifier.evaluate({ isOpenSource: true });
    expect(foss.classification).toBe('open_source');

    const freemium = PricingVerifier.evaluate({
      isOpenSource: false,
      hasPerpetualFreeTier: true,
      hasPaidTiers: true,
    });
    expect(freemium.classification).toBe('freemium');

    const freeForever = PricingVerifier.evaluate({
      isOpenSource: false,
      hasPerpetualFreeTier: true,
      hasPaidTiers: false,
    });
    expect(freeForever.classification).toBe('free_forever');
  });
});

describe('Scenario 7 & 8: Link Health & Stale Re-Verification Queue', () => {
  it('flags broken or malformed official links', async () => {
    const check = await LinkVerifier.checkLink('http://invalid-non-existent-subdomain-1234567.com');
    expect(check.isAlive).toBe(false);
  });

  it('flags records older than 90 days into the re-verification queue', async () => {
    const storage = new StorageEngine();
    const staleDate = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const staleResource: DiscoveredResource = {
      id: 'test-stale-tool',
      canonicalUrl: 'https://aisatellite.pages.dev',
      name: 'StaleTool',
      description: 'Test resource last verified 100 days ago',
      category: 'databases',
      tags: ['test'],
      freeClassification: 'open_source',
      freeTierLimitations: [],
      status: 'verified',
      lastVerified: staleDate,
      evidenceUrls: ['https://aisatellite.pages.dev'],
      discoveredAt: staleDate,
      updatedAt: staleDate,
    };

    storage.saveVerified(staleResource);

    const monitor = new FreshnessMonitor(process.cwd(), storage);
    const report = await monitor.auditFreshness(true); // skip network for speed

    expect(report.staleCount).toBeGreaterThanOrEqual(1);
    const flagged = report.flaggedItems.find((f) => f.id === 'test-stale-tool');
    expect(flagged).toBeDefined();
    expect(flagged?.issue).toContain('older than 90 days');
  });
});
