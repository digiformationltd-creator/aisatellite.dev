import { DeduplicationEngine } from '../normalization/deduplication.js';
import type { DiscoveredResource } from '../shared/types.js';
import { Logger } from '../shared/logger.js';

export interface CuratedItem {
  name: string;
  url: string;
  description: string;
  category: string;
  sourceListId: string;
}

export class CuratedListDiscoveryConnector {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('CuratedListsDiscovery');
  }

  /**
   * Parses Markdown bullet list format:
   * - [Name](https://url) - Description text...
   */
  parseMarkdownList(markdown: string, category: string, sourceListId: string): CuratedItem[] {
    const items: CuratedItem[] = [];
    const lines = markdown.split('\n');
    const regex = /^\s*[-*]\s*\[([^\]]+)\]\((https?:\/\/[^\)]+)\)\s*(?:[-–—:]\s*(.+))?$/;

    for (const line of lines) {
      const match = line.match(regex);
      if (match) {
        const name = match[1].trim();
        const url = match[2].trim();
        const description = match[3] ? match[3].trim() : `${name} developer resource`;
        items.push({
          name,
          url,
          description,
          category,
          sourceListId,
        });
      }
    }

    return items;
  }

  /**
   * Parses Markdown table format (often used in MCP server registries):
   * | Name | Description | Link |
   */
  parseMarkdownTable(markdown: string, category: string, sourceListId: string): CuratedItem[] {
    const items: CuratedItem[] = [];
    const lines = markdown.split('\n');
    let insideTable = false;

    for (const line of lines) {
      if (line.includes('|') && line.includes('---')) {
        insideTable = true;
        continue;
      }
      if (insideTable && line.includes('|')) {
        const cells = line
          .split('|')
          .map((c) => c.trim())
          .filter(Boolean);

        if (cells.length >= 2) {
          const nameCell = cells[0];
          const descCell = cells[1];
          const linkCell = cells[2] || '';

          // Extract markdown link from any cell
          const linkMatch = (linkCell || nameCell).match(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/);
          if (linkMatch) {
            items.push({
              name: linkMatch[1].trim(),
              url: linkMatch[2].trim(),
              description: descCell.replace(/\[.*?\]\(.*?\)/g, '').trim(),
              category,
              sourceListId,
            });
          }
        }
      }
    }

    return items;
  }

  /**
   * Converts CuratedItems into standard DiscoveredResource candidates
   */
  toDiscoveredResources(items: CuratedItem[]): DiscoveredResource[] {
    return items.map((item) => {
      const canonicalUrl = DeduplicationEngine.normalizeUrl(item.url);
      const isGitHub = item.url.includes('github.com');

      const resource: DiscoveredResource = {
        id: DeduplicationEngine.generateResourceId(canonicalUrl, item.name),
        canonicalUrl,
        name: item.name,
        description: item.description,
        category: item.category,
        tags: [item.category, item.sourceListId],
        repositoryUrl: isGitHub ? item.url : undefined,
        officialUrl: !isGitHub ? item.url : undefined,
        freeClassification: 'unknown',
        freeTierLimitations: [],
        evidenceUrls: [item.url],
        status: 'discovered',
        discoveredAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return resource;
    });
  }

  /**
   * Fetches and parses a remote curated markdown list
   */
  async fetchCuratedList(
    url: string,
    category: string,
    sourceListId: string,
    format: 'markdown-list' | 'markdown-table' = 'markdown-list'
  ): Promise<DiscoveredResource[]> {
    this.logger.info(`Fetching curated list from ${url} (format: ${format})`);
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'AI-Satellite-Discovery-Bot/2.0' },
      });
      if (!response.ok) {
        this.logger.error(`Failed to fetch curated list: HTTP ${response.status}`);
        return [];
      }
      const text = await response.text();
      const items =
        format === 'markdown-table'
          ? this.parseMarkdownTable(text, category, sourceListId)
          : this.parseMarkdownList(text, category, sourceListId);

      this.logger.info(`Parsed ${items.length} items from ${sourceListId}`);
      return this.toDiscoveredResources(items);
    } catch (err: any) {
      this.logger.error(`Exception while fetching curated list ${sourceListId}: ${err.message}`);
      return [];
    }
  }
}
