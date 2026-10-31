import { describe, it, expect } from 'vitest';
import { evidenceLedgerManager } from '../../src/lib/research/evidence-ledger';
import { EditorialArticleSchema } from '../../src/lib/research/schemas';

describe('Phase 7 — Editorial Quality, Approval Gates & Content Freshness', () => {
  it('Acceptance Test 13: Technical articles in editorial pipeline have valid schema metadata', () => {
    const articles = evidenceLedgerManager.getAllArticles();
    expect(articles.length).toBeGreaterThan(0);

    for (const article of articles) {
      const parsed = EditorialArticleSchema.safeParse(article);
      expect(parsed.success).toBe(true);
      expect(article.searchIntent.length).toBeGreaterThan(0);
      expect(article.primaryTopic.length).toBeGreaterThan(0);
    }
  });

  it('Acceptance Test 20 & 21: Content approval is enforced and unauthorized publication strictly fails', () => {
    // 1. Without authorized human editor signature, publication must fail
    const unauthAttempt = evidenceLedgerManager.attemptPublishArticle(
      'art-zapier-alternatives',
      'AIModel-AgenticReviewer' // Unauthorized AI agent
    );
    expect(unauthAttempt.success).toBe(false);
    expect(unauthAttempt.error).toContain('LeadTechnicalEditor authorization signature');

    // 2. With authorized human signature, approved articles publish cleanly
    const authAttempt = evidenceLedgerManager.attemptPublishArticle(
      'art-zapier-alternatives',
      'LeadTechnicalEditor-Aisha'
    );
    expect(authAttempt.success).toBe(true);
    expect(authAttempt.article?.status).toBe('published');
    expect(authAttempt.article?.approvedBy).toBe('LeadTechnicalEditor-Aisha');
  });

  it('Acceptance Test 22: Content freshness flags identify claims requiring re-verification based on volatility', () => {
    const audit = evidenceLedgerManager.auditFreshness();
    expect(audit.freshClaims).toBeDefined();
    expect(audit.outdatedClaims).toBeDefined();
    // Freshness audit is idempotent
    const repeatAudit = evidenceLedgerManager.auditFreshness();
    expect(repeatAudit.flaggedCount).toBe(audit.flaggedCount);
  });
});
