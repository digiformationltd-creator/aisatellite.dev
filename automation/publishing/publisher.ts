import fs from 'node:fs';
import path from 'node:path';
import type { ArticleDraft, DiscoveredResource } from '../shared/types.js';
import { StorageEngine } from '../shared/storage.js';
import { MdxGenerator } from '../drafting/mdx-generator.js';
import { Logger } from '../shared/logger.js';

export class PublishingEngine {
  private baseDir: string;
  private storage: StorageEngine;
  private logger: Logger;

  constructor(baseDir = process.cwd(), storage = new StorageEngine(baseDir)) {
    this.baseDir = baseDir;
    this.storage = storage;
    this.logger = new Logger('PublishingEngine', baseDir);
  }

  /**
   * Publishes an approved article draft to Astro Content Collections (src/content/blog/)
   */
  publishArticle(draftId: string): string {
    const draft = this.storage.getDraft(draftId);
    if (!draft) {
      throw new Error(`Draft not found: ${draftId}`);
    }

    if (draft.status !== 'approved') {
      throw new Error(
        `Publication blocked: Draft "${draft.title}" has status "${draft.status}". Only "approved" drafts can be published.`
      );
    }

    const blogDir = path.join(this.baseDir, 'src', 'content', 'blog');
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    const targetFile = path.join(blogDir, `${draft.slug}.md`);

    // Format MDX
    const mdxContent = MdxGenerator.formatMdx({
      ...draft,
      status: 'published',
    });

    // Write file
    fs.writeFileSync(targetFile, mdxContent, 'utf8');

    // Update draft status
    draft.status = 'published';
    draft.updatedAt = new Date().toISOString();
    this.storage.saveDraft(draft);

    this.logger.info(`Successfully published article to: ${targetFile}`);
    return targetFile;
  }

  /**
   * Promotes a verified tool to Astro Content Collections (src/content/tools/)
   */
  publishVerifiedTool(resource: DiscoveredResource): string {
    if (resource.status !== 'verified' && resource.status !== 'published') {
      throw new Error(`Tool promotion blocked: Resource "${resource.name}" is not verified.`);
    }

    const toolsDir = path.join(this.baseDir, 'src', 'content', 'tools');
    if (!fs.existsSync(toolsDir)) {
      fs.mkdirSync(toolsDir, { recursive: true });
    }

    const slug = resource.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const targetFile = path.join(toolsDir, `${slug}.md`);

    // Check if file already exists to preserve idempotency
    if (fs.existsSync(targetFile)) {
      this.logger.info(`Tool "${slug}" already exists in content collection. Skipping duplicate overwrite.`);
      return targetFile;
    }

    const tagsYaml = (resource.tags.length > 0 ? resource.tags : ['developer-tool'])
      .map((t) => `  - "${t}"`)
      .join('\n');

    const limitationsYaml = resource.freeTierLimitations
      .map((l) => `  - "${l}"`)
      .join('\n');

    const content = `---
name: "${resource.name}"
description: "${resource.description.replace(/"/g, '\\"')}"
category: "${resource.category}"
tags:
${tagsYaml}
officialUrl: "${resource.officialUrl || resource.canonicalUrl}"
repositoryUrl: "${resource.repositoryUrl || resource.canonicalUrl}"
license: "${resource.licenseSpdx || 'Open Source'}"
pricingModel: "${resource.freeClassification === 'open_source' ? 'open-source' : 'free-forever'}"
selfHosted: ${resource.freeClassification === 'open_source'}
requiresCreditCard: ${resource.freeTierLimitations.some((l) => l.toLowerCase().includes('credit card'))}
freeTierLimitations:
${limitationsYaml || '  - "Community support and documentation"'}
verificationStatus: "verified"
lastVerified: "${new Date().toISOString().split('T')[0]}"
featured: false
published: true
---

### Overview
${resource.description}

### Verified Open-Source Licensing
- **SPDX Identifier:** \`${resource.licenseSpdx || 'Open Source'}\`
- **Canonical Repository:** [${resource.repositoryUrl || resource.canonicalUrl}](${resource.repositoryUrl || resource.canonicalUrl})
`;

    fs.writeFileSync(targetFile, content, 'utf8');

    // Update resource status in storage
    resource.status = 'published';
    resource.updatedAt = new Date().toISOString();
    this.storage.saveVerified(resource);

    this.logger.info(`Promoted verified tool to: ${targetFile}`);
    return targetFile;
  }
}
