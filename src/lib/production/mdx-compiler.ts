/**
 * AI SATELLITE — PHASE 23 PROFESSIONAL MDX COMPILER
 * Compiles structured editorial drafts into sanitized, Astro-compatible MDX documents.
 * Canonical Domain: https://aisatellite.dev
 */

import type { ArticleBrief } from '../editorial/types';
import type { ArticleDraft } from './types';

export class ProfessionalMdxCompiler {
  private static instance: ProfessionalMdxCompiler;

  public static getInstance(): ProfessionalMdxCompiler {
    if (!ProfessionalMdxCompiler.instance) {
      ProfessionalMdxCompiler.instance = new ProfessionalMdxCompiler();
    }
    return ProfessionalMdxCompiler.instance;
  }

  /**
   * Compiles draft into production-ready MDX content with frontmatter.
   */
  public compileToMdx(brief: ArticleBrief, draft: ArticleDraft): string {
    const sanitizedContent = this.sanitizeMdx(draft.rawMdxContent);
    const tagsYaml = [
      ...brief.supportingKeywords.map((k) => `  - "${k.toLowerCase().replace(/"/g, '')}"`),
      `  - "${brief.topicCluster.toLowerCase().replace(/[^a-z0-9]+/g, '-')}"`,
    ].join('\n');

    const sourcesYaml = brief.requiredSources
      .map(
        (s) => `  - title: "${s.title.replace(/"/g, "'")}"\n    url: "${s.url}"`
      )
      .join('\n');

    const relatedToolsYaml = brief.freeToolsToInvestigate
      .map((t) => `  - "${t}"`)
      .join('\n');

    const partnerContext =
      draft.commercialCtaPlacement?.partner === 'digiformation'
        ? 'digiformation'
        : draft.commercialCtaPlacement?.partner === 'digibizos'
        ? 'digibizos'
        : 'none';

    const frontmatter = `---
title: "${draft.title.replace(/"/g, "'")}"
description: "${draft.metaDescription.replace(/"/g, "'")}"
category: "${brief.topicCategory}"
tags:
${tagsYaml}
author: "AI Satellite Editorial Team"
publishedAt: "${brief.proposedPublicationDate}"
readingTime: "${draft.estimatedReadingMinutes} min read"
sources:
${sourcesYaml}
relatedTools:
${relatedToolsYaml || '  - "postgresql"'}
partnerContext: "${partnerContext}"
editoriallyReviewed: true
published: false
articleId: "${brief.articleId}"
canonicalSlug: "${brief.canonicalSlug}"
---

${sanitizedContent}
`;

    return frontmatter;
  }

  /**
   * Sanitizes untrusted strings, removes dangerous raw HTML script tags.
   */
  private sanitizeMdx(content: string): string {
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/onerror\s*=/gi, '')
      .replace(/onload\s*=/gi, '');
  }
}

export const mdxCompiler = ProfessionalMdxCompiler.getInstance();
