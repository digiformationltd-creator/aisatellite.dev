import { describe, it, expect } from 'vitest';
import { EvidenceLedgerManager } from '../../automation/research/evidence-ledger.js';
import { ArticleDraftingEngine } from '../../automation/drafting/article-generator.js';
import { ContentValidator } from '../../automation/validation/content-validator.js';
import { ArticleDraftSchema } from '../../automation/shared/types.js';
import type { TopicProposal, ArticleDraft } from '../../automation/shared/types.js';

describe('Scenario 11 & 12: Evidence Ledger Integrity', () => {
  it('records valid claims with official documentation URLs', () => {
    const ledger = new EvidenceLedgerManager();
    const claim = ledger.addClaim(
      'PostgreSQL supports ACID transactions and WAL replication.',
      'https://www.postgresql.org/docs/current/wal.html',
      'official_documentation',
      'high'
    );

    expect(claim.claimId).toBeDefined();
    expect(claim.sourceUrl).toBe('https://www.postgresql.org/docs/current/wal.html');
    expect(claim.confidence).toBe('high');

    const validation = ledger.validateLedger(1);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('flags unsupported claims or malformed URLs', () => {
    const ledger = new EvidenceLedgerManager();
    expect(() => {
      ledger.addClaim('Unverified claim with broken URL', 'not-a-valid-url', 'official_documentation');
    }).toThrowError(/Invalid source URL/);
  });
});

describe('Scenario 13, 14 & 15: Draft Generation & Compliance Gate', () => {
  const sampleTopic: TopicProposal = {
    topicId: 'test-topic-1',
    title: 'Self-Hosting Modern Nextcloud for Engineering Teams',
    slug: 'self-hosting-modern-nextcloud',
    category: 'open-source-office',
    searchIntent: 'Guide to deploying Nextcloud on private Linux servers.',
    targetKeywords: ['nextcloud', 'self-hosted', 'collaboration'],
    evidenceReferences: ['https://nextcloud.com/docs'],
    priorityScore: 85,
    contentGapRationale: 'Strong demand for private cloud collaboration.',
    recommendedPartner: 'digibizos',
    approvedForDrafting: true,
    proposedAt: '2026-10-31T00:00:00Z',
  };

  it('produces schema-valid article drafts with anchored evidence', async () => {
    const engine = new ArticleDraftingEngine();
    const ledger = new EvidenceLedgerManager();
    ledger.addClaim(
      'Nextcloud is distributed under the GNU AGPLv3 license.',
      'https://github.com/nextcloud/server/blob/master/COPYING',
      'license_file',
      'high'
    );

    const draft = await engine.generateDraft(sampleTopic, ledger.getClaims());

    const parseResult = ArticleDraftSchema.safeParse(draft);
    expect(parseResult.success).toBe(true);
    expect(draft.partnerContext).toBe('digibizos');
    expect(draft.evidenceLedger).toHaveLength(1);
  });

  it('rejects invalid MDX with unbalanced code fences', () => {
    const validator = new ContentValidator();
    const invalidDraft: ArticleDraft = {
      draftId: 'bad-draft',
      topicId: 'test-topic-1',
      title: 'Bad Draft Title',
      slug: 'bad-draft',
      description: 'Short test description',
      category: 'Tech',
      tags: ['test'],
      author: 'Tester',
      readingTime: '5 min',
      partnerContext: 'none',
      evidenceLedger: [
        {
          claimId: 'c1',
          claim: 'Valid claim text',
          sourceUrl: 'https://example.com',
          sourceType: 'official_documentation',
          verifiedAt: '2026-10-31',
          confidence: 'high',
        },
      ],
      mdxContent: 'Here is some content with an open code block:\n```bash\nnpm install\nUnclosed code block!',
      status: 'drafted',
      validationErrors: [],
      createdAt: '2026-10-31T00:00:00Z',
      updatedAt: '2026-10-31T00:00:00Z',
    };

    const report = validator.validateDraft(invalidDraft);
    expect(report.isValid).toBe(false);
    expect(report.errors.some((e) => e.includes('Unbalanced code fences'))).toBe(true);
  });

  it('blocks drafts with missing mandatory commercial disclosures for affiliated partners', () => {
    const validator = new ContentValidator();
    const missingDisclosureDraft: ArticleDraft = {
      draftId: 'partner-no-disclosure',
      topicId: 'test-topic-1',
      title: 'UK LTD Formation for Developers',
      slug: 'uk-ltd-formation-developers',
      description: 'Corporate registration guide for UK limited entities.',
      category: 'founder-infrastructure',
      tags: ['uk-ltd'],
      author: 'Tester',
      readingTime: '5 min',
      partnerContext: 'digiformation', // partnerContext set, but body lacks disclosure!
      evidenceLedger: [
        {
          claimId: 'c1',
          claim: 'Companies House registration fee is statutory.',
          sourceUrl: 'https://gov.uk',
          sourceType: 'statutory_government_source',
          verifiedAt: '2026-10-31',
          confidence: 'high',
        },
      ],
      mdxContent: 'Article content without any commercial disclosure or partner mention at all. '.repeat(10),
      status: 'drafted',
      validationErrors: [],
      createdAt: '2026-10-31T00:00:00Z',
      updatedAt: '2026-10-31T00:00:00Z',
    };

    const report = validator.validateDraft(missingDisclosureDraft);
    expect(report.isValid).toBe(false);
    expect(report.errors.some((e) => e.includes('Missing mandatory commercial disclosure'))).toBe(true);
  });
});
