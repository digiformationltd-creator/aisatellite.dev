/**
 * AI Satellite — Phase 21 Unified Content Loader
 * Bridges Markdown/MDX collections with the typed BlogStore architecture.
 * Ensures consistent metadata, canonical URLs, and schema compliance.
 * Canonical Domain: https://aisatellite.dev
 */

import { blogDatabase } from './database';
import type { ArticleModel } from './types';

export class ContentLoader {
  private static instance: ContentLoader;

  public static getInstance(): ContentLoader {
    if (!ContentLoader.instance) {
      ContentLoader.instance = new ContentLoader();
    }
    return ContentLoader.instance;
  }

  /**
   * Retrieves all published articles, sorted by publication date descending.
   */
  public async getAllPublishedArticles(): Promise<ArticleModel[]> {
    const storeArticles = blogDatabase.getArticles(false);
    return [...storeArticles].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  /**
   * Retrieves an article by its slug.
   */
  public async getArticleBySlug(slug: string, includeDrafts = false): Promise<ArticleModel | undefined> {
    return blogDatabase.getArticleBySlug(slug, includeDrafts);
  }

  /**
   * Retrieves articles by category.
   */
  public async getArticlesByCategory(category: string): Promise<ArticleModel[]> {
    return blogDatabase.getArticlesByCategory(category);
  }

  /**
   * Retrieves articles by tag.
   */
  public async getArticlesByTag(tag: string): Promise<ArticleModel[]> {
    return blogDatabase.getArticlesByTag(tag);
  }

  /**
   * Retrieves articles by author.
   */
  public async getArticlesByAuthor(authorId: string): Promise<ArticleModel[]> {
    return blogDatabase.getArticlesByAuthor(authorId);
  }

  /**
   * Retrieves featured articles for the blog homepage.
   */
  public async getFeaturedArticles(): Promise<ArticleModel[]> {
    return blogDatabase.getFeaturedArticles();
  }

  /**
   * Finds related articles based on explicit links, category, secondary categories, or shared tags.
   */
  public async getRelatedArticles(article: ArticleModel, limit = 3): Promise<ArticleModel[]> {
    const all = await this.getAllPublishedArticles();
    const otherArticles = all.filter((a) => a.id !== article.id && a.slug !== article.slug);

    const scored = otherArticles.map((a) => {
      let score = 0;

      // 1. Explicitly listed in relatedArticles
      if (article.relatedArticles && (article.relatedArticles.includes(a.id) || article.relatedArticles.includes(a.slug))) {
        score += 10;
      }

      // 2. Shared primary category
      if (a.primaryCategory === article.primaryCategory) {
        score += 5;
      }

      // 3. Shared secondary categories
      const sharedSecondary = (a.secondaryCategories || []).filter((sc) =>
        (article.secondaryCategories || []).includes(sc)
      );
      score += sharedSecondary.length * 3;

      // 4. Shared tags
      const sharedTags = a.tags.filter((t) => article.tags.includes(t));
      score += sharedTags.length * 2;

      return { article: a, score };
    });

    const relevant = scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.article);

    if (relevant.length > 0) {
      return relevant;
    }

    // Fallback: return most recent articles
    return otherArticles.slice(0, limit);
  }
}

export const contentLoader = ContentLoader.getInstance();
