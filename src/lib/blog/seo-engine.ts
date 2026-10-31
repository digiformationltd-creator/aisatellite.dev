/**
 * AI Satellite — Phase 21 Technical SEO, AEO & GEO Engine
 * Generates Schema.org JSON-LD structured data, canonical tags, Open Graph meta,
 * and Answer Engine Optimization (AEO) entity graphs.
 * Canonical Domain: https://aisatellite.dev
 */

import type { ArticleModel } from './types';

export class BlogSEOEngine {
  private static instance: BlogSEOEngine;

  public static getInstance(): BlogSEOEngine {
    if (!BlogSEOEngine.instance) {
      BlogSEOEngine.instance = new BlogSEOEngine();
    }
    return BlogSEOEngine.instance;
  }

  /**
   * Generates Schema.org JSON-LD structured data for a blog article.
   */
  public generateArticleJsonLd(article: ArticleModel): Record<string, any> {
    const authorName =
      typeof article.author === 'string' ? article.author : article.author.name;
    const authorRole =
      typeof article.author === 'string'
        ? 'Technology & Business Researcher'
        : article.author.role;
    const authorBio =
      typeof article.author === 'string'
        ? 'AI Satellite Verified Contributor'
        : article.author.bio;

    const canonicalUrl = `https://aisatellite.dev/blog/${article.slug}`;

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'TechArticle',
          '@id': `${canonicalUrl}#article`,
          isPartOf: {
            '@type': 'WebSite',
            '@id': 'https://aisatellite.dev/#website',
            name: 'AI Satellite',
            url: 'https://aisatellite.dev',
          },
          headline: article.title,
          description: article.description,
          inLanguage: 'en-US',
          mainEntityOfPage: canonicalUrl,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt || article.publishedAt,
          author: {
            '@type': 'Person',
            name: authorName,
            jobTitle: authorRole,
            description: authorBio,
            url: 'https://aisatellite.dev/blog',
          },
          publisher: {
            '@type': 'Organization',
            '@id': 'https://aisatellite.dev/#organization',
            name: 'AI Satellite',
            url: 'https://aisatellite.dev',
            logo: {
              '@type': 'ImageObject',
              url: 'https://aisatellite.dev/logo.png',
            },
          },
          articleSection: article.primaryCategory,
          keywords: article.tags.join(', '),
          about: [
            {
              '@type': 'Thing',
              name: article.primaryCategory,
            },
            ...article.tags.map((t) => ({
              '@type': 'Thing',
              name: t,
            })),
          ],
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonicalUrl}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://aisatellite.dev',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Blog & Knowledge Hub',
              item: 'https://aisatellite.dev/blog',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: article.primaryCategory,
              item: `https://aisatellite.dev/blog/category/${article.primaryCategory
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')}`,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: article.title,
              item: canonicalUrl,
            },
          ],
        },
      ],
    };
  }

  /**
   * Generates BreadcrumbList JSON-LD for category and tax pages.
   */
  public generateCategoryJsonLd(categoryName: string, categorySlug: string): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://aisatellite.dev',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://aisatellite.dev/blog',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: categoryName,
          item: `https://aisatellite.dev/blog/category/${categorySlug}`,
        },
      ],
    };
  }
}

export const blogSEO = BlogSEOEngine.getInstance();
