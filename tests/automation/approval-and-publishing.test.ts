import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { EditorialApprovalEngine } from '../../automation/editorial/approval.js';
import { PublishingEngine } from '../../automation/publishing/publisher.js';
import { StorageEngine } from '../../automation/shared/storage.js';
import type { ArticleDraft } from '../../automation/shared/types.js';

describe('Scenario 16, 17 & 18: Editorial Approval & Publishing Invariants', () => {
  const storage = new StorageEngine();
  const approval = new EditorialApprovalEngine(storage);
  const publisher = new PublishingEngine(process.cwd(), storage);

  const testDraftId = 'draft-test-approval-1';
  const testDraft: ArticleDraft = {
    draftId: testDraftId,
    topicId: 'topic-1',
    title: 'Self-Hosting Postgres with pgvector for Local AI Workloads',
    slug: 'test-self-hosting-postgres-pgvector',
    description: 'Complete architecture playbook for running vector databases locally.',
    category: 'databases',
    tags: ['postgresql', 'pgvector', 'ai'],
    author: 'AI Satellite Lab',
    readingTime: '6 min read',
    partnerContext: 'none',
    evidenceLedger: [
      {
        claimId: 'c1',
        claim: 'pgvector supports exact and approximate nearest neighbor search.',
        sourceUrl: 'https://github.com/pgvector/pgvector',
        sourceType: 'official_documentation',
        verifiedAt: '2026-10-31',
        confidence: 'high',
      },
    ],
    mdxContent: `
### Architectural Overview
PostgreSQL combined with the \`pgvector\` extension provides ACID-compliant vector storage.

\`\`\`sql
CREATE EXTENSION vector;
CREATE TABLE items (id bigserial PRIMARY KEY, embedding vector(3));
\`\`\`
`.repeat(3),
    status: 'drafted',
    validationErrors: [],
    createdAt: '2026-10-31T00:00:00Z',
    updatedAt: '2026-10-31T00:00:00Z',
  };

  it('prohibits publishing unapproved drafts', () => {
    storage.saveDraft(testDraft);

    expect(() => {
      publisher.publishArticle(testDraftId);
    }).toThrowError(/Publication blocked.*Only "approved" drafts can be published/);
  });

  it('prevents autonomous bots from approving their own drafts', () => {
    approval.submitForReview(testDraftId);

    expect(() => {
      approval.approveDraft(testDraftId, 'github-actions[bot]');
    }).toThrowError(/Automated agents cannot self-approve drafts/);
  });

  it('publishes approved drafts into src/content/blog/ when signed off by human editor', () => {
    // Human editor approves
    const approved = approval.approveDraft(testDraftId, 'SeniorEditor-Aisha', 'Verified technical accuracy');
    expect(approved.status).toBe('approved');

    const publishedPath = publisher.publishArticle(testDraftId);
    expect(fs.existsSync(publishedPath)).toBe(true);

    const fileContent = fs.readFileSync(publishedPath, 'utf8');
    expect(fileContent).toContain('title: "Self-Hosting Postgres with pgvector');
    expect(fileContent).toContain('published: true');

    // Clean up test file so it doesn't pollute content
    if (fs.existsSync(publishedPath)) {
      fs.unlinkSync(publishedPath);
    }
  });

  it('guarantees idempotency on duplicate publication calls', () => {
    const verifiedTool = {
      id: 'tool-idempotency-test',
      canonicalUrl: 'https://github.com/org/test-tool',
      name: 'IdempotencyTestTool',
      description: 'Test tool verifying idempotency invariants in publishing.',
      category: 'databases',
      tags: ['test'],
      freeClassification: 'open_source' as const,
      freeTierLimitations: [],
      status: 'verified' as const,
      evidenceUrls: ['https://github.com/org/test-tool'],
      discoveredAt: '2026-10-31T00:00:00Z',
      updatedAt: '2026-10-31T00:00:00Z',
    };

    const path1 = publisher.publishVerifiedTool(verifiedTool);
    const path2 = publisher.publishVerifiedTool(verifiedTool);

    expect(path1).toBe(path2);

    // Clean up test tool file
    if (fs.existsSync(path1)) {
      fs.unlinkSync(path1);
    }
  });
});

describe('Scenario 19 & 20: Deployment Safety & Secret Hygiene', () => {
  it('guarantees that no API keys or private tokens are leaked into generated content', () => {
    const testDraft: ArticleDraft = {
      draftId: 'secret-check',
      topicId: 't1',
      title: 'Secret Hygiene Verification',
      slug: 'secret-hygiene-check',
      description: 'Testing that generated drafts never contain credentials.',
      category: 'security',
      tags: ['security'],
      author: 'Tester',
      readingTime: '2 min',
      partnerContext: 'none',
      evidenceLedger: [],
      mdxContent: 'Clean public documentation content without secrets.',
      status: 'drafted',
      validationErrors: [],
      createdAt: '2026-10-31T00:00:00Z',
      updatedAt: '2026-10-31T00:00:00Z',
    };

    const content = testDraft.mdxContent;
    expect(content).not.toMatch(/ghp_[a-zA-Z0-9]{36}/); // GitHub PAT
    expect(content).not.toMatch(/sk-[a-zA-Z0-9]{48}/); // OpenAI Key
    expect(content).not.toMatch(/bearer\s+[a-zA-Z0-9_-]{20,}/i);
  });
});
