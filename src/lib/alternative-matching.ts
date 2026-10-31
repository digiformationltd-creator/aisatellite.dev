import { SOFTWARE_TAXONOMY, type SoftwareTaxonomyItem } from '../data/software-taxonomy.js';

export type AlternativeFilterType =
  | 'all'
  | 'open_source'
  | 'free_forever'
  | 'freemium'
  | 'free_trial'
  | 'self_hosted'
  | 'free_hosted_tier'
  | 'paid_infrastructure_required';

export type AlternativeSortOption =
  | 'relevance'
  | 'open_source'
  | 'easiest_setup'
  | 'self_hosted'
  | 'recently_verified'
  | 'savings-desc'
  | 'popularity-desc'
  | 'name-asc';

export interface SearchableAlternative {
  id: string;
  slug?: string;
  title: string;
  category: string;
  categorySlug?: string;
  replaces: string[];
  classification: string[];
  summary: string;
  monthlySavings?: number;
  popularity?: number;
  selfHosted?: boolean;
  freeHostedTier?: boolean;
  paidInfrastructureRequired?: boolean;
  lastVerified?: string;
  deploymentOptions?: string[];
  proprietaryTool?: string;
  openSourceReplacements?: string[];
}

export type AlternativeItem = SearchableAlternative;

export interface AutocompleteSuggestion {
  label: string;
  type: 'paid-software' | 'alternative';
  category?: string;
  slug?: string;
}

export function searchAlternatives<T extends SearchableAlternative>(
  items: T[],
  query = '',
  filter: AlternativeFilterType = 'all',
  category = 'all',
  sort: AlternativeSortOption = 'relevance'
): T[] {
  const cleanQuery = query.trim().toLowerCase();

  // 1. Query filter
  let results = items.filter((item) => {
    if (!cleanQuery) return true;

    if (item.title.toLowerCase().includes(cleanQuery)) return true;
    if (item.summary.toLowerCase().includes(cleanQuery)) return true;
    if (item.category.toLowerCase().includes(cleanQuery)) return true;
    if (item.replaces.some((r) => r.toLowerCase().includes(cleanQuery))) return true;
    if (item.proprietaryTool && item.proprietaryTool.toLowerCase().includes(cleanQuery)) return true;
    if (item.openSourceReplacements && item.openSourceReplacements.some((r) => r.toLowerCase().includes(cleanQuery))) return true;

    // Taxonomy synonyms
    const taxMatch = SOFTWARE_TAXONOMY.find(
      (tax) =>
        tax.paidProduct.toLowerCase().includes(cleanQuery) ||
        tax.synonyms.some((s) => s.includes(cleanQuery))
    );
    if (taxMatch) {
      if (item.replaces.some((r) => r.toLowerCase().includes(taxMatch.paidProduct.toLowerCase()))) return true;
      if (item.title.toLowerCase().includes(taxMatch.paidProduct.toLowerCase())) return true;
    }

    return false;
  });

  // 2. Category filter
  if (category && category !== 'all') {
    const cleanCat = category.toLowerCase().replace(/-/g, ' ');
    results = results.filter((item) => {
      const itemCat = item.category.toLowerCase().replace(/-/g, ' ');
      const catSlug = (item.categorySlug || '').toLowerCase().replace(/-/g, ' ');
      return itemCat.includes(cleanCat) || cleanCat.includes(itemCat) || catSlug.includes(cleanCat);
    });
  }

  // 3. Classification filter
  results = filterAlternatives(results, { classification: filter });

  // 4. Sort
  return sortAlternatives(results, sort);
}

export function filterAlternatives<T extends SearchableAlternative>(
  items: T[],
  options: { classification?: AlternativeFilterType | string }
): T[] {
  const filter = options.classification || 'all';
  if (!filter || filter === 'all') return items;

  return items.filter((item) => {
    if (filter === 'open_source') {
      return item.classification.includes('open_source');
    }
    if (filter === 'self_hosted') {
      return item.selfHosted || item.classification.includes('self_hosted');
    }
    if (filter === 'free_forever') {
      return item.classification.includes('free_forever') || item.classification.includes('open_source');
    }
    if (filter === 'freemium') {
      return item.classification.includes('freemium');
    }
    if (filter === 'free_trial') {
      return item.classification.includes('free_trial');
    }
    if (filter === 'free_hosted_tier') {
      return item.freeHostedTier;
    }
    if (filter === 'paid_infrastructure_required') {
      return item.paidInfrastructureRequired;
    }
    return true;
  });
}

export function sortAlternatives<T extends SearchableAlternative>(
  items: T[],
  sort: AlternativeSortOption
): T[] {
  const sorted = [...items];
  sorted.sort((a, b) => {
    if (sort === 'savings-desc') {
      return (b.monthlySavings || 0) - (a.monthlySavings || 0);
    }
    if (sort === 'popularity-desc') {
      return (b.popularity || 0) - (a.popularity || 0);
    }
    if (sort === 'name-asc') {
      return a.title.localeCompare(b.title);
    }
    if (sort === 'open_source') {
      const aFoss = a.classification.includes('open_source') ? 1 : 0;
      const bFoss = b.classification.includes('open_source') ? 1 : 0;
      return bFoss - aFoss;
    }
    if (sort === 'self_hosted') {
      const aSelf = a.selfHosted ? 1 : 0;
      const bSelf = b.selfHosted ? 1 : 0;
      return bSelf - aSelf;
    }
    if (sort === 'recently_verified') {
      const aDate = a.lastVerified ? new Date(a.lastVerified).getTime() : 0;
      const bDate = b.lastVerified ? new Date(b.lastVerified).getTime() : 0;
      return bDate - aDate;
    }
    return 0;
  });
  return sorted;
}

export function getAutocompleteSuggestions<T extends SearchableAlternative>(
  items: T[],
  query: string
): AutocompleteSuggestion[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const suggestions: AutocompleteSuggestion[] = [];
  const seen = new Set<string>();

  // Add paid software matches from taxonomy
  SOFTWARE_TAXONOMY.forEach((tax) => {
    if (
      tax.paidProduct.toLowerCase().includes(clean) ||
      tax.synonyms.some((s) => s.toLowerCase().includes(clean))
    ) {
      if (!seen.has(tax.paidProduct.toLowerCase())) {
        seen.add(tax.paidProduct.toLowerCase());
        suggestions.push({
          label: `${tax.paidProduct} Alternatives`,
          type: 'paid-software',
          category: tax.category,
          slug: tax.slug,
        });
      }
    }
  });

  // Add alternative item matches
  items.forEach((item) => {
    if (item.title.toLowerCase().includes(clean)) {
      if (!seen.has(item.title.toLowerCase())) {
        seen.add(item.title.toLowerCase());
        suggestions.push({
          label: item.title,
          type: 'alternative',
          category: item.category,
          slug: item.slug || item.id,
        });
      }
    }
  });

  return suggestions.slice(0, 8);
}

export class AlternativeMatchingEngine {
  static search = searchAlternatives;
  static filter = filterAlternatives;
  static sort = sortAlternatives;
  static autocomplete = getAutocompleteSuggestions;
}
