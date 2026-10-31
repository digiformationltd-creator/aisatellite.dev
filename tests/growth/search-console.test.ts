import { describe, it, expect } from 'vitest';
import { SearchConsoleClient } from '../../growth/search-console/search-console-client.js';

describe('Acceptance Tests 8, 9, 35: Search Console Integration & Opportunity Gating', () => {
  const client = new SearchConsoleClient();

  it('Test 8: Search Console integration handles missing credentials gracefully', () => {
    // With missing or unconfigured credentials, getConnectionStatus returns false without throwing
    const status = client.getConnectionStatus();
    expect(status).toBeDefined();
    expect(status.siteUrl).toBe('sc-domain:aisatellite.pages.dev');
    if (!status.isConnected) {
      expect(status.authMethod).toBe('unconfigured');
    }
  });

  it('Test 9: Search performance reports use real API data schema without crashes', async () => {
    const records = await client.fetchSearchPerformance();
    expect(Array.isArray(records)).toBe(true);
    expect(records.length).toBeGreaterThan(0);

    for (const rec of records) {
      expect(rec.page).toMatch(/^https:\/\/aisatellite\.pages\.dev/);
      expect(typeof rec.impressions).toBe('number');
      expect(typeof rec.clicks).toBe('number');
      expect(typeof rec.ctr).toBe('number');
      expect(typeof rec.averagePosition).toBe('number');
      expect(typeof rec.isMeasured).toBe('boolean');
    }
  });

  it('Test 35: Growth reports distinguish measured data from estimates', async () => {
    const records = await client.fetchSearchPerformance();
    const hasMeasuredFlag = records.every((r) => typeof r.isMeasured === 'boolean');
    expect(hasMeasuredFlag).toBe(true);

    const opportunities = client.detectOpportunities(records);
    expect(Array.isArray(opportunities)).toBe(true);
    expect(opportunities.length).toBeGreaterThan(0);
    expect(opportunities[0].score).toBeGreaterThan(0);
  });
});
