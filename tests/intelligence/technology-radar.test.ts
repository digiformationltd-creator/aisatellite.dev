import { describe, it, expect } from 'vitest';
import { radarStore } from '../../src/lib/radar/radar-store';
import { evidenceVerifier } from '../../src/lib/radar/evidence-verifier';
import { discoveryAdapterPipeline } from '../../src/lib/radar/discovery-adapters';
import { recommendationEngine } from '../../src/lib/recommendations/recommendation-engine';

describe('Phase 6 — Technology Radar & Evidentiary Verification', () => {
  it('Acceptance Test 19 & 33: Radar categories display real indexed resources with zero fabricated statistics', () => {
    const categories = radarStore.getAllCategories();
    expect(categories.length).toBe(20);

    const allResources = radarStore.getAllResources();
    expect(allResources.length).toBeGreaterThan(0);

    // Verify calculated counts strictly match actual indexed resources
    for (const cat of categories) {
      const actualCount = allResources.filter((r) => r.categories.includes(cat.slug)).length;
      expect(cat.resourceCount).toBe(actualCount);
    }
  });

  it('Acceptance Test 4: Alternative matching returns verified relevant resources', () => {
    const zapierAlternatives = radarStore.findAlternativesFor('Zapier');
    expect(zapierAlternatives.length).toBeGreaterThan(0);
    expect(zapierAlternatives.some((a) => a.slug === 'n8n')).toBe(true);

    const photoshopAlternatives = radarStore.findAlternativesFor('Photoshop');
    expect(photoshopAlternatives.some((a) => a.slug === 'gimp')).toBe(true);
  });

  it('Acceptance Test 5 & 6: Free classifications remain accurate and unverified claims are labeled correctly', () => {
    const n8n = radarStore.getResourceBySlug('n8n')!;
    expect(n8n).toBeDefined();
    expect(n8n.selfHosted).toBe(true);
    // Self-hosted must disclose infrastructure requirement transparency
    expect(n8n.paidInfrastructureRequired).toBe(true);

    // Unverified candidate
    const rawCandidate = {
      name: 'Unverified Experimental Tool',
      sourceType: 'submission' as const,
      url: 'https://example.com/unverified',
      description: 'Pending review tool',
      evidenceUrls: ['https://example.com/docs'],
    };
    const normalized = discoveryAdapterPipeline.normalizeResource(rawCandidate, 'developer-tools');
    expect(normalized.verificationStatus).toBe('pending');
    expect(normalized.pricingClassification).toContain('verification_pending');
  });

  it('Acceptance Test 7: Source references resolve to real evidence URLs with valid domains', () => {
    const all = radarStore.getAllResources();
    for (const res of all) {
      expect(res.evidenceUrls.length).toBeGreaterThan(0);
      for (const evUrl of res.evidenceUrls) {
        expect(() => new URL(evUrl)).not.toThrow();
        const parsed = new URL(evUrl);
        expect(['http:', 'https:']).toContain(parsed.protocol);
        expect(parsed.hostname).toContain('.');
      }
    }
  });

  it('Acceptance Test 27: Invalid external data is strictly rejected by schema validation', () => {
    const invalidResource = {
      id: 'invalid-tool',
      // missing slug and title
      categories: [],
      evidenceUrls: ['not-a-valid-url'],
    };

    const audit = evidenceVerifier.verifyResource(invalidResource as any);
    expect(audit.valid).toBe(false);
    expect(audit.errors.length).toBeGreaterThan(0);
    expect(audit.status).toBe('pending');
  });

  it('Acceptance Test 18: Recommendations use valid taxonomy relationships', () => {
    const recs = recommendationEngine.getRecommendations({
      currentCategory: 'databases',
      currentSlug: 'postgresql',
    });

    expect(recs.similarTools.length).toBeGreaterThan(0);
    // Similar tools should not recommend the current item itself
    expect(recs.similarTools.every((t) => t.slug !== 'postgresql')).toBe(true);
    expect(recs.relatedPrompts.length).toBeGreaterThan(0);
  });
});
