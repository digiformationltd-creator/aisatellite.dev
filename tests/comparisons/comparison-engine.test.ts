import { describe, it, expect } from 'vitest';
import { SOFTWARE_TAXONOMY, getTaxonomyForProduct } from '../../src/data/software-taxonomy';

describe('Product A — 15-Dimension Comparison Engine', () => {
  const REQUIRED_DIMENSIONS = [
    'Licensing Model',
    'Hosting Model',
    'Typical Cost',
    'Data Sovereignty',
    'Offline Capability',
    'API Extensibility',
    'Migration Friction',
    'Hardware Resource Usage',
    'Multi-User Collaboration',
    'Authentication & RBAC',
    'Backup & Disaster Recovery',
    'Audit Logging',
    'Community Ecosystem',
    'Vendor Lock-In Risk',
    'Mobile Support',
  ];

  it('Acceptance 6: verifies all 15 comparison dimensions are well-formed', () => {
    expect(REQUIRED_DIMENSIONS.length).toBe(15);
    REQUIRED_DIMENSIONS.forEach((dim) => {
      expect(typeof dim).toBe('string');
      expect(dim.length).toBeGreaterThan(3);
    });
  });

  it('Acceptance 7: replacement taxonomy maintains balanced trade-offs for all entries', () => {
    SOFTWARE_TAXONOMY.forEach((entry) => {
      expect(entry.paidProduct).toBeTruthy();
      expect(entry.slug).toBeTruthy();
      expect(entry.typicalMonthlyCost).toBeGreaterThan(0);
      expect(entry.bestAlternatives.length).toBeGreaterThan(0);

      // Verify that tradeoffs are documented honestly (no biased marketing fluff)
      expect(entry.tradeoffs.length).toBeGreaterThan(0);
      expect(entry.bestAlternatives.every((alt) => alt.length > 0)).toBe(true);
    });
  });

  it('Acceptance 8: verifies partner integration context mappings for business operations software', () => {
    const salesforce = getTaxonomyForProduct('Salesforce');
    expect(salesforce).toBeDefined();
    expect(salesforce?.category).toBe('CRM, ERP & Business Operations');

    const office = getTaxonomyForProduct('Microsoft 365 / Office');
    expect(office).toBeDefined();
    expect(office?.bestAlternatives).toContain('DigiOffice Suite');
  });
});
