import { describe, it, expect } from 'vitest';
import {
  SOFTWARE_TAXONOMY,
  getTaxonomyForProduct,
  calculateAnnualSavings,
} from '../../src/data/software-taxonomy';
import {
  ALTERNATIVE_CATEGORIES,
  getCategoryBySlug,
} from '../../src/data/alternative-categories';
import {
  searchAlternatives,
  getAutocompleteSuggestions,
  filterAlternatives,
  sortAlternatives,
  type SearchableAlternative,
} from '../../src/lib/alternative-matching';

describe('Product A — Alternatives Search & Matching Engine', () => {
  const sampleItems: SearchableAlternative[] = [
    {
      id: 'aws-s3-alternatives',
      title: 'Free & Open-Source AWS S3 Alternatives',
      category: 'Cloud Infrastructure & Object Storage',
      categorySlug: 'cloud-infrastructure',
      replaces: ['AWS S3', 'Amazon Simple Storage Service'],
      classification: ['open_source', 'self_hosted'],
      summary: 'Replace AWS S3 with MinIO, Garage, and SeaweedFS.',
      monthlySavings: 150,
      popularity: 95,
      selfHosted: true,
      freeHostedTier: false,
      paidInfrastructureRequired: true,
    },
    {
      id: 'cursor-alternatives',
      title: 'Free & Open-Source Cursor AI Alternatives',
      category: 'AI & Developer Tooling',
      categorySlug: 'ai-coding',
      replaces: ['Cursor', 'Cursor IDE'],
      classification: ['open_source', 'free_forever'],
      summary: 'Replace Cursor with VS Code + Continue.dev and Cline.',
      monthlySavings: 20,
      popularity: 98,
      selfHosted: true,
      freeHostedTier: true,
      paidInfrastructureRequired: false,
    },
    {
      id: 'notion-alternatives',
      title: 'Free & Open-Source Notion Alternatives',
      category: 'Productivity & Knowledge Bases',
      categorySlug: 'productivity',
      replaces: ['Notion', 'Notion AI'],
      classification: ['open_source', 'free_forever', 'self_hosted'],
      summary: 'Replace Notion with AppFlowy, Obsidian, and Logseq.',
      monthlySavings: 10,
      popularity: 92,
      selfHosted: true,
      freeHostedTier: true,
      paidInfrastructureRequired: false,
    },
    {
      id: 'salesforce-alternatives',
      title: 'Free & Open-Source Salesforce Alternatives',
      category: 'CRM, ERP & Business Operations',
      categorySlug: 'crm-erp',
      replaces: ['Salesforce', 'Salesforce CRM'],
      classification: ['open_source', 'self_hosted'],
      summary: 'Replace Salesforce with Twenty, ERPNext, and Digi Biz OS.',
      monthlySavings: 300,
      popularity: 88,
      selfHosted: true,
      freeHostedTier: false,
      paidInfrastructureRequired: true,
    },
  ];

  it('Acceptance 1: accurately matches search queries across titles, replaced products, and categories', () => {
    const s3Results = searchAlternatives(sampleItems, 's3');
    expect(s3Results.length).toBeGreaterThan(0);
    expect(s3Results[0].id).toBe('aws-s3-alternatives');

    const cursorResults = searchAlternatives(sampleItems, 'Cursor');
    expect(cursorResults.length).toBeGreaterThan(0);
    expect(cursorResults[0].id).toBe('cursor-alternatives');

    const categoryResults = searchAlternatives(sampleItems, 'CRM');
    expect(categoryResults.length).toBeGreaterThan(0);
    expect(categoryResults[0].id).toBe('salesforce-alternatives');
  });

  it('Acceptance 2: generates instant autocomplete suggestions for both paid software and FOSS alternatives', () => {
    const suggestions = getAutocompleteSuggestions(sampleItems, 'Not');
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.some((s) => s.label.toLowerCase().includes('notion'))).toBe(true);

    const emptyQuerySuggestions = getAutocompleteSuggestions(sampleItems, '');
    expect(emptyQuerySuggestions.length).toBe(0);
  });

  it('Acceptance 3: filters correctly by classification criteria', () => {
    const freeHosted = filterAlternatives(sampleItems, { classification: 'free_hosted_tier' });
    expect(freeHosted.length).toBe(2);
    expect(freeHosted.map((f) => f.id)).toContain('cursor-alternatives');
    expect(freeHosted.map((f) => f.id)).toContain('notion-alternatives');

    const selfHostedOnly = filterAlternatives(sampleItems, { classification: 'self_hosted' });
    expect(selfHostedOnly.length).toBe(4);
  });

  it('Acceptance 4: accurately sorts alternatives by calculated annual savings and popularity', () => {
    const sortedBySavings = sortAlternatives(sampleItems, 'savings-desc');
    expect(sortedBySavings[0].id).toBe('salesforce-alternatives'); // $300/mo
    expect(sortedBySavings[1].id).toBe('aws-s3-alternatives'); // $150/mo
    expect(sortedBySavings[sortedBySavings.length - 1].id).toBe('notion-alternatives'); // $10/mo

    const sortedByPopularity = sortAlternatives(sampleItems, 'popularity-desc');
    expect(sortedByPopularity[0].id).toBe('cursor-alternatives'); // 98
  });

  it('Acceptance 5: validates software taxonomy integrity and annual savings computation', () => {
    expect(SOFTWARE_TAXONOMY.length).toBeGreaterThanOrEqual(13);

    const s3Taxonomy = getTaxonomyForProduct('AWS S3');
    expect(s3Taxonomy).toBeDefined();
    expect(s3Taxonomy?.typicalMonthlyCost).toBeGreaterThan(0);

    const cat = getCategoryBySlug('ai-coding');
    expect(cat).toBeDefined();
    expect(cat?.name).toBe('AI & Coding');

    const annual = calculateAnnualSavings('AWS S3');
    expect(annual).toBe((s3Taxonomy?.typicalMonthlyCost || 0) * 12);

    ALTERNATIVE_CATEGORIES.forEach((cat) => {
      expect(cat.name).toBeTruthy();
      expect(cat.slug).toBeTruthy();
      expect(cat.count).toBeGreaterThan(0);
    });
  });
});
