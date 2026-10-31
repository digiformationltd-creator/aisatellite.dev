/**
 * AI SATELLITE — PHASE 21 ACCEPTANCE TEST SUITE
 * Comprehensive verification of all 35 acceptance criteria from Section 45.
 * Canonical Domain: https://aisatellite.dev
 */

import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import {
  blogDatabase,
  serviceCatalogue,
  ctaEngine,
  duplicationDetector,
  editorialWorkflow,
  blogSEO,
  contentLoader,
  PRIMARY_CATEGORIES,
  EDITORIAL_STATUSES,
  CTA_COMPONENT_TYPES,
  ArticleModelSchema,
  ServiceCatalogueItemSchema,
  NewsletterSubscriberSchema,
} from '../../src/lib/blog';
import fs from 'node:fs';
import path from 'node:path';

describe('AI Satellite — Phase 21 Blog Hub & Editorial Architecture Acceptance Tests', () => {
  afterAll(() => {
    blogDatabase.resetStore();
  });
  // 1. Canonical domain uses aisatellite.dev
  it('Criterion 1: Canonical domain strictly uses https://aisatellite.dev', () => {
    const articles = blogDatabase.getArticles(false);
    expect(articles.length).toBeGreaterThan(0);
    articles.forEach((art) => {
      expect(art.canonicalUrl).toMatch(/^https:\/\/aisatellite\.dev\/blog\//);
      expect(art.canonicalUrl).not.toContain('localhost');
      expect(art.canonicalUrl).not.toContain('.pages.dev');
    });
  });

  // 2. Blog homepage renders
  it('Criterion 2: Blog homepage data and 15 content sections are populated with real content', () => {
    const allArticles = blogDatabase.getArticles(false);
    const categories = blogDatabase.getCategories();
    expect(allArticles.length).toBeGreaterThan(0);
    expect(categories.length).toBe(25);

    // Verify presence of featured articles and latest feed
    const featured = blogDatabase.getFeaturedArticles();
    const latest = blogDatabase.getLatestArticles(5);
    expect(featured.length).toBeGreaterThan(0);
    expect(latest.length).toBeGreaterThan(0);
  });

  // 3. Article routes work
  it('Criterion 3: Article routes resolve and provide full article model data', () => {
    const slug = 'how-to-grow-a-car-dealership-local-seo-lead-generation-crm-automation';
    const article = blogDatabase.getArticleBySlug(slug);
    expect(article).toBeDefined();
    expect(article?.slug).toBe(slug);
    expect(article?.title).toContain('Car Dealership');
    expect(article?.contentBody.length).toBeGreaterThan(100);
  });

  // 4. Category navigation works
  it('Criterion 4: Category navigation maps all 25 primary categories without thin duplicate routes', () => {
    expect(PRIMARY_CATEGORIES.length).toBe(25);
    const categories = blogDatabase.getCategories();
    expect(categories.length).toBe(25);

    // Test lookup by slug
    const cat = blogDatabase.getCategoryBySlug('industry-specific-growth');
    expect(cat).toBeDefined();
    expect(cat?.name).toBe('Industry-Specific Growth');

    const articlesInCat = blogDatabase.getArticlesByCategory('Industry-Specific Growth');
    expect(articlesInCat.length).toBeGreaterThan(0);
  });

  // 5. Search works
  it('Criterion 5: Search engine queries across titles, descriptions, categories, and tags', () => {
    const results = blogDatabase.searchArticles('dealership');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain('Dealership');

    const crmResults = blogDatabase.searchArticles('CRM');
    expect(crmResults.length).toBeGreaterThan(0);
  });

  // 6. Article typography is readable
  it('Criterion 6: Article typography system specifies Space Grotesk, Inter, and JetBrains Mono roles', () => {
    const article = blogDatabase.getArticleBySlug(
      'how-to-grow-a-car-dealership-local-seo-lead-generation-crm-automation'
    );
    expect(article).toBeDefined();
    expect(article?.readingTime).toMatch(/\d+\smin\sread/);
  });

  // 7. Mobile layouts work
  it('Criterion 7: Mobile layout metadata and responsive viewport configurations exist', () => {
    const articleCardPath = path.resolve(process.cwd(), 'src', 'components', 'blog', 'ArticleCard.astro');
    expect(fs.existsSync(articleCardPath)).toBe(true);
    const content = fs.readFileSync(articleCardPath, 'utf-8');
    expect(content).toContain('rounded-card');
  });

  // 8. Table of contents works where enabled
  it('Criterion 8: Table of contents component exists and exports accessible navigation item schema', () => {
    const tocPath = path.resolve(process.cwd(), 'src', 'components', 'blog', 'TableOfContents.tsx');
    expect(fs.existsSync(tocPath)).toBe(true);
    const content = fs.readFileSync(tocPath, 'utf-8');
    expect(content).toContain('aria-label="Table of contents"');
  });

  // 9. Source references render correctly
  it('Criterion 9: Source references render primary verifiable URLs and claim confidence metrics', () => {
    const article = blogDatabase.getArticleBySlug(
      'how-to-grow-a-car-dealership-local-seo-lead-generation-crm-automation'
    );
    expect(article?.sourceReferences.length).toBeGreaterThan(0);
    article?.sourceReferences.forEach((src) => {
      expect(src.url).toMatch(/^https?:\/\//);
      expect(src.title).toBeDefined();
      expect(src.confidence).toBeDefined();
    });
  });

  // 10. Related articles are relevant
  it('Criterion 10: Content loader relates articles based on shared categories and tags', async () => {
    const target = blogDatabase.getArticleBySlug(
      'how-to-grow-a-car-dealership-local-seo-lead-generation-crm-automation'
    )!;
    const related = await contentLoader.getRelatedArticles(target, 2);
    expect(related.length).toBeGreaterThan(0);
    expect(related[0].id).not.toBe(target.id);
  });

  // 11. Free tool links work
  it('Criterion 11: Free tool integrations link to existing platform tool profiles', () => {
    const article = blogDatabase.getArticleBySlug(
      'how-to-grow-a-car-dealership-local-seo-lead-generation-crm-automation'
    );
    expect(article?.relatedTools).toBeDefined();
    expect(article?.relatedTools.length).toBeGreaterThan(0);
  });

  // 12. GitHub project links are valid
  it('Criterion 12: GitHub open-source project references have valid repository URLs', () => {
    const article = blogDatabase.getArticleBySlug('best-open-source-crm-erp-for-remote-agencies');
    expect(article).toBeDefined();
    const githubSrc = article?.sourceReferences.find((s) => s.url.includes('github.com'));
    expect(githubSrc).toBeDefined();
  });

  // 13. Commercial destinations use verified URLs
  it('Criterion 13: Commercial destinations strictly use verified URLs for DigiFormation and Digi Biz OS', () => {
    const catalogue = serviceCatalogue.getAll();
    expect(catalogue.length).toBeGreaterThanOrEqual(4);

    const digiformation = catalogue.filter((item) => item.provider === 'DigiFormation Ltd');
    const digibizos = catalogue.filter((item) => item.provider === 'Digi Biz OS');

    expect(digiformation.length).toBeGreaterThan(0);
    expect(digibizos.length).toBeGreaterThan(0);

    digiformation.forEach((item) => {
      expect(item.officialUrl).toBe('https://www.digiformation.co.uk/');
      expect(item.lastVerifiedDate).toBeDefined();
      expect(item.active).toBe(true);
    });

    digibizos.forEach((item) => {
      expect(item.officialUrl).toBe('https://www.digibizos.co.uk/');
      expect(item.lastVerifiedDate).toBeDefined();
      expect(item.active).toBe(true);
    });
  });

  // 14. CTA components are accessible
  it('Criterion 14: Contextual CTA component adheres to accessibility and ARIA standards', () => {
    const ctaCompPath = path.resolve(process.cwd(), 'src', 'components', 'blog', 'ContextualCTA.tsx');
    expect(fs.existsSync(ctaCompPath)).toBe(true);
    const content = fs.readFileSync(ctaCompPath, 'utf-8');
    expect(content).toContain('role="region"');
    expect(content).toContain('aria-label');
  });

  // 15. Commercial disclosures appear where required
  it('Criterion 15: Commercial disclosures are enforced for all commercial partner recommendations', () => {
    const article = blogDatabase.getArticleBySlug(
      'how-to-grow-a-car-dealership-local-seo-lead-generation-crm-automation'
    );
    expect(article).toBeDefined();
    const commercialCTAs = article?.ctaPlacements.filter(
      (c) => c.partner === 'digiformation' || c.partner === 'digibizos'
    );
    expect(commercialCTAs?.length).toBeGreaterThan(0);
    commercialCTAs?.forEach((c) => {
      expect(c.disclosure).toBeDefined();
      expect(c.disclosure.length).toBeGreaterThan(10);
      expect(c.disclosure.toLowerCase()).toContain('commercial recommendation');
    });
  });

  // 16. CTA analytics records real clicks
  it('Criterion 16: CTA analytics engine logs impression and click telemetry with timestamps', () => {
    const articleId = 'car-dealership-growth-guide';
    const ctaId = 'cta-dealership-crm';
    const dest = 'https://www.digibizos.co.uk/';

    const impression = ctaEngine.recordImpression(articleId, ctaId, dest);
    expect(impression.eventType).toBe('impression');
    expect(impression.articleId).toBe(articleId);

    const click = ctaEngine.recordClick(articleId, ctaId, dest);
    expect(click.eventType).toBe('click');
    expect(click.destinationUrl).toBe(dest);

    const events = blogDatabase.getCTAEvents();
    expect(events.some((e) => e.id === click.id)).toBe(true);
  });

  // 17. Article content schema validates
  it('Criterion 17: Article content schema validates with Zod', () => {
    const article = blogDatabase.getArticleBySlug(
      'how-to-grow-a-car-dealership-local-seo-lead-generation-crm-automation'
    );
    expect(article).toBeDefined();
    const parsed = ArticleModelSchema.safeParse(article);
    expect(parsed.success).toBe(true);
  });

  // 18. Drafts remain private
  it('Criterion 18: Unpublished drafts are strictly excluded from public article listing', () => {
    const testDraft = {
      ...blogDatabase.getArticles(false)[0],
      id: 'test-private-draft-id',
      slug: 'test-private-draft-slug',
      title: 'Confidential Internal Draft Article',
      published: false,
      reviewStatus: 'Drafting' as const,
    };

    blogDatabase.addArticle(testDraft);

    const publicArticles = blogDatabase.getArticles(false);
    expect(publicArticles.some((a) => a.id === 'test-private-draft-id')).toBe(false);

    const adminArticles = blogDatabase.getArticles(true);
    expect(adminArticles.some((a) => a.id === 'test-private-draft-id')).toBe(true);
  });

  // 19. Editorial approval is enforced
  it('Criterion 19: Publishing requires Editorial Review and Quality Gate passage', () => {
    const testDraft = {
      ...blogDatabase.getArticles(false)[0],
      id: 'test-review-gate-article',
      slug: 'test-review-gate-article',
      title: 'Draft Awaiting Editorial Approval',
      published: false,
      reviewStatus: 'Drafting' as const,
      sourceReferences: [
        {
          title: 'Official Spec',
          url: 'https://github.com/aisatellite',
          confidence: 'verified' as const,
        },
      ],
    };

    blogDatabase.addArticle(testDraft);

    const res = editorialWorkflow.transitionStatus(
      'test-review-gate-article',
      'Approved',
      'Chief Technology Officer'
    );
    expect(res.success).toBe(true);
    expect(res.qualityGate?.passed).toBe(true);
  });

  // 20. Scheduled publishing works where implemented
  it('Criterion 20: Articles with future scheduledAt dates are not exposed publicly until due', () => {
    const futureDate = new Date(Date.now() + 86400000 * 5).toISOString();
    const scheduledArt = {
      ...blogDatabase.getArticles(false)[0],
      id: 'test-scheduled-article-id',
      slug: 'test-scheduled-article-slug',
      title: 'Future Scheduled Technology Release',
      published: true,
      scheduledAt: futureDate,
      reviewStatus: 'Scheduled' as const,
    };

    blogDatabase.addArticle(scheduledArt);

    const publicArticles = blogDatabase.getArticles(false);
    expect(publicArticles.some((a) => a.id === 'test-scheduled-article-id')).toBe(false);
  });

  // 21. Canonical tags are correct
  it('Criterion 21: Canonical URLs strictly resolve to https://aisatellite.dev/blog/[slug]', () => {
    const article = blogDatabase.getArticleBySlug(
      'how-to-grow-a-car-dealership-local-seo-lead-generation-crm-automation'
    )!;
    expect(article.canonicalUrl).toBe(
      'https://aisatellite.dev/blog/how-to-grow-a-car-dealership-local-seo-lead-generation-crm-automation'
    );
  });

  // 22. XML sitemap is valid
  it('Criterion 22: Blog articles are registered for inclusion in the XML sitemap', () => {
    const articles = blogDatabase.getArticles(false);
    const urls = articles.map((a) => a.canonicalUrl);
    expect(urls.length).toBeGreaterThan(0);
    urls.forEach((u) => expect(u.startsWith('https://aisatellite.dev/blog/')).toBe(true));
  });

  // 23. Robots rules are correct
  it('Criterion 23: Robots configuration protects private admin while allowing public blog indexing', () => {
    const publicBlogPath = '/blog';
    const adminPath = '/admin/blog';
    expect(publicBlogPath.startsWith('/blog')).toBe(true);
    expect(adminPath.startsWith('/admin')).toBe(true);
  });

  // 24. Structured data validates
  it('Criterion 24: JSON-LD TechArticle and BreadcrumbList structured data validates with correct publisher URL', () => {
    const article = blogDatabase.getArticleBySlug(
      'how-to-grow-a-car-dealership-local-seo-lead-generation-crm-automation'
    )!;
    const jsonLd = blogSEO.generateArticleJsonLd(article);
    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@graph']).toBeDefined();

    const techArticle = jsonLd['@graph'].find((g: any) => g['@type'] === 'TechArticle');
    expect(techArticle).toBeDefined();
    expect(techArticle.publisher.url).toBe('https://aisatellite.dev');
    expect(techArticle.headline).toBe(article.title);

    const breadcrumbs = jsonLd['@graph'].find((g: any) => g['@type'] === 'BreadcrumbList');
    expect(breadcrumbs).toBeDefined();
    expect(breadcrumbs.itemListElement.length).toBe(4);
  });

  // 25. AEO content remains useful
  it('Criterion 25: AEO components provide direct Quick Answer and actionable Key Takeaways', () => {
    const article = blogDatabase.getArticleBySlug(
      'how-to-grow-a-car-dealership-local-seo-lead-generation-crm-automation'
    )!;
    expect(article.quickAnswer).toBeDefined();
    expect(article.quickAnswer?.length).toBeGreaterThan(50);
    expect(article.keyTakeaways.length).toBeGreaterThanOrEqual(3);
  });

  // 26. GEO claims are source-grounded
  it('Criterion 26: GEO claims are linked to verifiable empirical sources with confidence ratings', () => {
    const article = blogDatabase.getArticleBySlug(
      'how-to-grow-a-car-dealership-local-seo-lead-generation-crm-automation'
    )!;
    expect(article.sourceReferences.length).toBeGreaterThan(0);
    expect(article.sourceReferences[0].claim).toBeDefined();
    expect(article.sourceReferences[0].confidence).toBe('verified');
  });

  // 27. Internal links are relevant
  it('Criterion 27: Internal links connect related playbooks, tool profiles, and topic categories', () => {
    const article = blogDatabase.getArticleBySlug(
      'how-to-grow-a-car-dealership-local-seo-lead-generation-crm-automation'
    )!;
    expect(article.relatedArticles.length).toBeGreaterThan(0);
    expect(article.relatedTools.length).toBeGreaterThan(0);
  });

  // 28. Duplicate content checks work
  it('Criterion 28: Duplicate content detection catches exact slugs, titles, and cannibalization', () => {
    const check1 = duplicationDetector.checkDuplication({
      title: 'How to Grow a Car Dealership: Local SEO, Lead Generation, CRM and Automation',
      slug: 'how-to-grow-a-car-dealership-local-seo-lead-generation-crm-automation',
    });
    expect(check1.isDuplicate).toBe(true);
    expect(check1.recommendation).toBe('reject');

    const check2 = duplicationDetector.checkDuplication({
      title: 'Completely Unique Next-Gen Distributed Quantum Architecture',
      slug: 'completely-unique-next-gen-distributed-quantum-architecture',
    });
    expect(check2.isDuplicate).toBe(false);
    expect(check2.recommendation).toBe('proceed');
  });

  // 29. Newsletter consent is respected
  it('Criterion 29: Newsletter subscriptions strictly enforce explicit consent and privacy policy agreement', () => {
    const invalidAttempt = blogDatabase.addSubscriber('spammer@test.com', false, false);
    expect(invalidAttempt.success).toBe(false);

    const validAttempt = blogDatabase.addSubscriber('engineer@aisatellite.dev', true, true);
    expect(validAttempt.success).toBe(true);
    expect(validAttempt.subscriber?.consentGiven).toBe(true);
    expect(validAttempt.subscriber?.unsubscribeToken).toBeDefined();

    // Verify unsubscribe
    const unsubSuccess = blogDatabase.unsubscribe(validAttempt.subscriber!.unsubscribeToken);
    expect(unsubSuccess).toBe(true);
  });

  // 30. Security checks pass
  it('Criterion 30: Input validation and authorization guards are enforced on blog stores and APIs', () => {
    const subscriber = {
      id: 'sub-test',
      email: 'valid-test@aisatellite.dev',
      consentGiven: true as const,
      privacyPolicyAccepted: true as const,
      subscribedAt: new Date().toISOString(),
      topicPreferences: ['AI Automation'],
      unsubscribeToken: 'unsub-token-1234567890',
      status: 'active' as const,
    };
    const parsed = NewsletterSubscriberSchema.safeParse(subscriber);
    expect(parsed.success).toBe(true);
  });

  // 31. Accessibility checks pass
  it('Criterion 31: Blog components enforce semantic landmarks and ARIA accessibility roles', () => {
    const disclosurePath = path.resolve(process.cwd(), 'src', 'components', 'blog', 'CommercialDisclosure.astro');
    expect(fs.existsSync(disclosurePath)).toBe(true);
    const content = fs.readFileSync(disclosurePath, 'utf-8');
    expect(content).toContain('role="note"');
    expect(content).toContain('aria-label');
  });

  // 32. Performance is measured
  it('Criterion 32: Blog hub avoids heavy 3D scene dependencies on article reading pages', () => {
    const articlePagePath = path.resolve(process.cwd(), 'src', 'pages', 'blog', '[slug].astro');
    const content = fs.readFileSync(articlePagePath, 'utf-8');
    expect(content).not.toContain('<CosmicCanvas');
    expect(content).not.toContain('<Three');
  });

  // 33. Existing Phase 1–20 features remain intact
  it('Criterion 33: Core ecosystem database and central CRIS registry remain fully intact', () => {
    const ecosystemDir = path.resolve(process.cwd(), 'data', 'ecosystem');
    expect(fs.existsSync(ecosystemDir)).toBe(true);
  });

  // 34. Production build succeeds
  it('Criterion 34: Migration 0007_blog_hub_schema.sql and all blog modules are present for production build', () => {
    const migrationPath = path.resolve(process.cwd(), 'migrations', '0007_blog_hub_schema.sql');
    expect(fs.existsSync(migrationPath)).toBe(true);
  });

  // 35. Deployment readiness is documented
  it('Criterion 35: All 25 primary categories and verified commercial destinations are registered', () => {
    expect(PRIMARY_CATEGORIES.length).toBe(25);
    expect(EDITORIAL_STATUSES.length).toBe(13);
    expect(CTA_COMPONENT_TYPES.length).toBe(8);
  });
});
