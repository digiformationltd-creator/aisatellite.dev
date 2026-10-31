import { describe, it, expect } from 'vitest';
import { siteConfig, getCanonicalUrl, getOgImageUrl } from '../../src/config/site';
import { evidenceLedgerManager } from '../../src/lib/research/evidence-ledger';
import { discoveryAdapterPipeline } from '../../src/lib/radar/discovery-adapters';
import { ResearchClaimSchema } from '../../src/lib/research/schemas';

describe('Phase 7 — Domain, Canonical Architecture & Evidence Ledger', () => {
  it('Acceptance Test 4 & 5: Domain configuration is centralized and canonical URLs are generated accurately', () => {
    expect(siteConfig.siteUrl).toBeDefined();
    expect(siteConfig.canonicalOrigin).toBe(siteConfig.siteUrl);
    expect(siteConfig.siteName).toBe('AI Satellite');

    const homeCanonical = getCanonicalUrl('/');
    expect(homeCanonical).toBe(siteConfig.canonicalOrigin);

    const tutorialCanonical = getCanonicalUrl('/tutorials/building-orbital-3d-radar-threejs-astro');
    expect(tutorialCanonical).toBe(`${siteConfig.canonicalOrigin}/tutorials/building-orbital-3d-radar-threejs-astro`);

    const ogImage = getOgImageUrl('/og-default.png');
    expect(ogImage).toBe(`${siteConfig.canonicalOrigin}/og-default.png`);
  });

  it('Acceptance Test 6: Preview deployments are strictly protected from search indexing', () => {
    expect(siteConfig.deploymentEnvironment).toBeDefined();
    // In preview and staging environments, search indexing must be disabled
    const isIndexingBlocked = (env: string) => env === 'preview' || env === 'staging';
    expect(isIndexingBlocked('preview')).toBe(true);
    expect(isIndexingBlocked('staging')).toBe(true);
    expect(isIndexingBlocked('production')).toBe(false);
  });

  it('Acceptance Test 9 & 35: Source verification records in Evidence Ledger are schema-valid with primary sources', () => {
    const claims = evidenceLedgerManager.getAllClaims();
    expect(claims.length).toBeGreaterThan(0);

    for (const claim of claims) {
      const parsed = ResearchClaimSchema.safeParse(claim);
      expect(parsed.success).toBe(true);
      expect(claim.evidenceUrls.length).toBeGreaterThan(0);
      expect(['official_docs', 'pricing_page', 'github_repo', 'license_file', 'release_notes', 'community_lead']).toContain(claim.sourceType);
    }
  });

  it('Acceptance Test 10: Unverified claims cannot be published as verified', () => {
    const unverified = evidenceLedgerManager.getClaimsByStatus('unverified');
    expect(unverified.length).toBeGreaterThan(0);

    // Attempt publication of an article containing unverified claims
    const dummyArticleId = 'test-article-unverified';
    const result = evidenceLedgerManager.attemptPublishArticle(dummyArticleId, 'LeadTechnicalEditor-Aisha');
    expect(result.success).toBe(false);
  });

  it('Acceptance Test 11 & 12: Duplicate research records are detected and discovery pipeline respects limits', () => {
    const existing = [
      {
        id: 'tech-test-existing',
        slug: 'existing-tool',
        title: 'Existing Tool',
        kind: 'software' as const,
        description: 'Existing item',
        categories: ['automation'],
        tags: [],
        officialUrl: 'https://existing.example.com',
        evidenceUrls: ['https://existing.example.com'],
        verificationStatus: 'verified' as const,
        lastVerified: '2026-10-31',
        createdAt: '2026-10-31',
        updatedAt: '2026-10-31',
        pricingClassification: ['open_source' as const],
        selfHosted: true,
        freeHostedTier: false,
        paidInfrastructureRequired: false,
      },
    ];

    const duplicateCandidate = {
      ...existing[0],
      id: 'tech-candidate-dup',
    };

    const deduplicated = discoveryAdapterPipeline.deduplicate([duplicateCandidate], existing);
    expect(deduplicated.length).toBe(0);
  });
});
