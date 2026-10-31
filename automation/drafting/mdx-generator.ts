import type { ArticleDraft } from '../shared/types.js';

export class MdxGenerator {
  /**
   * Generates production-ready MDX content with Astro Content Collections frontmatter
   */
  static formatMdx(draft: ArticleDraft): string {
    const sourcesYaml = draft.evidenceLedger
      .map(
        (e) => `  - title: "${e.claim.replace(/"/g, '\\"')}"\n    url: "${e.sourceUrl}"`
      )
      .join('\n');

    const tagsYaml = draft.tags.map((t) => `  - "${t}"`).join('\n');

    const frontmatter = `---
title: "${draft.title.replace(/"/g, '\\"')}"
description: "${draft.description.replace(/"/g, '\\"')}"
category: "${draft.category}"
tags:
${tagsYaml}
author: "${draft.author}"
publishedAt: "${draft.createdAt.split('T')[0]}"
readingTime: "${draft.readingTime}"
sources:
${sourcesYaml || '  - title: "Official Documentation"\n    url: "https://aisatellite.pages.dev"'}
partnerContext: "${draft.partnerContext}"
editoriallyReviewed: ${draft.status === 'approved'}
published: ${draft.status === 'published'}
---

${draft.mdxContent.trim()}
`;

    return frontmatter;
  }
}
