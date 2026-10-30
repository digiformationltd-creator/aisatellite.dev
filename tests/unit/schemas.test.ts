import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const ToolSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(10),
  category: z.string(),
  tags: z.array(z.string()).min(1),
  officialUrl: z.string().url(),
  repositoryUrl: z.string().url().optional(),
  documentationUrl: z.string().url().optional(),
  license: z.string().optional(),
  pricingModel: z.enum(['open-source', 'free-forever', 'freemium', 'free-trial', 'paid']),
  selfHosted: z.boolean(),
  requiresCreditCard: z.boolean().default(false),
  freeTierLimitations: z.array(z.string()).default([]),
  alternativesTo: z.array(z.string()).default([]),
  githubStars: z.number().optional(),
  verificationStatus: z.enum(['verified', 'pending', 'outdated']),
  lastVerified: z.string(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  securityNotes: z.array(z.string()).default([]),
  installationInstructions: z.string().optional(),
});

const ArticleSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  category: z.string(),
  tags: z.array(z.string()),
  author: z.string(),
  publishedAt: z.string(),
  readingTime: z.string(),
  sources: z.array(
    z.object({
      title: z.string(),
      url: z.string().url(),
    })
  ),
  partnerContext: z.enum(['digiformation', 'digibizos', 'both', 'none']).default('none'),
  editoriallyReviewed: z.boolean().default(true),
  published: z.boolean().default(true),
});

describe('AI Satellite Content Integrity Gate', () => {
  it('validates a correct Tool schema record', () => {
    const validTool = {
      name: 'PostgreSQL',
      description: 'The world advanced open source database engine.',
      category: 'Databases',
      tags: ['database', 'sql'],
      officialUrl: 'https://www.postgresql.org/',
      license: 'PostgreSQL License',
      pricingModel: 'open-source',
      selfHosted: true,
      verificationStatus: 'verified',
      lastVerified: '2026-10-31',
    };

    const parsed = ToolSchema.safeParse(validTool);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.requiresCreditCard).toBe(false);
      expect(parsed.data.featured).toBe(false);
    }
  });

  it('rejects an invalid tool with a malformed URL', () => {
    const invalidTool = {
      name: 'BrokenDB',
      description: 'Short desc',
      category: 'Databases',
      tags: ['db'],
      officialUrl: 'not-a-valid-url',
      pricingModel: 'open-source',
      selfHosted: true,
      verificationStatus: 'verified',
      lastVerified: '2026-10-31',
    };

    const parsed = ToolSchema.safeParse(invalidTool);
    expect(parsed.success).toBe(false);
  });

  it('validates an Article schema with compliant partnerContext', () => {
    const validArticle = {
      title: 'UK LTD Formation Guide for Developers',
      description: 'Educational guide on Companies House statutory filings.',
      category: 'Founder Infrastructure',
      tags: ['uk-ltd', 'banking'],
      author: 'AI Satellite Lab',
      publishedAt: '2026-10-31',
      readingTime: '6 min read',
      sources: [
        {
          title: 'UK Companies House',
          url: 'https://www.gov.uk/limited-company-formation',
        },
      ],
      partnerContext: 'digiformation',
    };

    const parsed = ArticleSchema.safeParse(validArticle);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.partnerContext).toBe('digiformation');
      expect(parsed.data.editoriallyReviewed).toBe(true);
    }
  });

  it('rejects an article with unapproved partnerContext', () => {
    const invalidArticle = {
      title: 'Invalid Article',
      description: 'Description here...',
      category: 'Tech',
      tags: [],
      author: 'Tester',
      publishedAt: '2026-10-31',
      readingTime: '2 min',
      sources: [],
      partnerContext: 'unknown-vendor',
    };

    const parsed = ArticleSchema.safeParse(invalidArticle);
    expect(parsed.success).toBe(false);
  });
});
