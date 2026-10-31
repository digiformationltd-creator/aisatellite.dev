import type {
  ContentCluster,
  InternalLinkRecommendation,
} from '../schemas/index.js';
import { GrowthLogger } from '../monitoring/growth-logger.js';
import { growthStorage } from '../storage/growth-storage.js';

export const PRIMARY_CLUSTERS: Omit<ContentCluster, 'supportingUrls' | 'freshnessStatus' | 'lastUpdated'>[] = [
  {
    id: 'cluster-dev-tools',
    name: 'Free Developer Tools',
    slug: 'free-developer-tools',
    pillarUrl: '/tools',
    description: 'Curated index of 100% free, self-hostable developer tools and infrastructure.',
    keywords: ['developer tools', 'free dev tools', 'self-hosted developer tools', 'local dev utilities'],
  },
  {
    id: 'cluster-alternatives',
    name: 'Open-Source Alternatives',
    slug: 'open-source-alternatives',
    pillarUrl: '/alternatives',
    description: 'Comprehensive directory of open-source and self-hosted replacements for proprietary SaaS.',
    keywords: ['open source alternatives', 'free software alternatives', 'self-hosted replacements', 'saas alternatives'],
  },
  {
    id: 'cluster-ai-coding',
    name: 'AI Coding',
    slug: 'ai-coding',
    pillarUrl: '/prompts/coding',
    description: 'Autonomous coding agents, LLM scaffolding prompts, and AI pair-programming patterns.',
    keywords: ['ai coding', 'coding agents', 'claude code prompts', 'developer agent workflows'],
  },
  {
    id: 'cluster-ai-agents',
    name: 'AI Agents',
    slug: 'ai-agents',
    pillarUrl: '/ai-agents',
    description: 'Autonomous multi-agent architectures, reasoning loops, tool usage, and memory systems.',
    keywords: ['ai agents', 'autonomous agents', 'agentic workflows', 'langgraph alternative'],
  },
  {
    id: 'cluster-mcp-servers',
    name: 'MCP Servers',
    slug: 'mcp-servers',
    pillarUrl: '/mcp-servers',
    description: 'Model Context Protocol server directory, tool specifications, and integration playbooks.',
    keywords: ['mcp servers', 'model context protocol', 'mcp tools', 'anthropic mcp directory'],
  },
  {
    id: 'cluster-free-hosting',
    name: 'Free Hosting',
    slug: 'free-hosting',
    pillarUrl: '/free-software',
    description: 'Zero-cost edge hosting, VPS tiers, serverless runtimes, and static asset distribution.',
    keywords: ['free hosting', 'free cloudflare pages', 'self hosting', 'free vps developers'],
  },
  {
    id: 'cluster-databases',
    name: 'Databases',
    slug: 'databases',
    pillarUrl: '/topics/databases',
    description: 'Open-source relational, vector, time-series, and embedded database engines.',
    keywords: ['open source database', 'postgresql pgvector', 'sqlite edge', 'supabase self-hosted'],
  },
  {
    id: 'cluster-automation',
    name: 'Automation',
    slug: 'automation',
    pillarUrl: '/workflows',
    description: 'Self-hosted workflow orchestration, event-driven automation, and webhooks.',
    keywords: ['developer automation', 'n8n self-hosted', 'activepieces', 'temporal workflows'],
  },
  {
    id: 'cluster-threejs',
    name: 'Three.js',
    slug: 'threejs',
    pillarUrl: '/3d-lab/threejs',
    description: 'Interactive WebGL and Three.js 3D web graphics components, shaders, and animations.',
    keywords: ['threejs', 'webgl 3d', 'threejs interactive components', 'threejs canvas demos'],
  },
  {
    id: 'cluster-webgl',
    name: 'WebGL',
    slug: 'webgl',
    pillarUrl: '/3d-lab/shaders',
    description: 'Custom GLSL shaders, visual post-processing effects, and GPU particle simulations.',
    keywords: ['webgl shaders', 'glsl fragment shader', 'webgl postprocessing', 'gpu particles web'],
  },
  {
    id: 'cluster-productivity',
    name: 'Developer Productivity',
    slug: 'developer-productivity',
    pillarUrl: '/downloads',
    description: 'CLI utilities, formatters, offline tools, and local-first developer productivity suites.',
    keywords: ['developer productivity', 'cli developer tools', 'offline developer utilities'],
  },
  {
    id: 'cluster-crm',
    name: 'Open-Source CRM',
    slug: 'open-source-crm',
    pillarUrl: '/alternatives/salesforce-alternatives',
    description: 'Self-hosted customer relationship management and agency pipeline systems.',
    keywords: ['open source crm', 'twenty crm self-hosted', 'salesforce alternative open source'],
  },
  {
    id: 'cluster-erp',
    name: 'Open-Source ERP',
    slug: 'open-source-erp',
    pillarUrl: '/topics/devops',
    description: 'Integrated resource planning, open-source ledger systems, and operational platforms.',
    keywords: ['open source erp', 'erpnext guide', 'self hosted erp for agency'],
  },
  {
    id: 'cluster-original-software',
    name: 'Original Software',
    slug: 'original-software',
    pillarUrl: '/projects',
    description: 'Original open-source software factory releases and production-grade applications.',
    keywords: ['ai satellite original software', 'developer toolbox cli', 'open source applications'],
  },
  {
    id: 'cluster-founder-infra',
    name: 'Founder Infrastructure',
    slug: 'founder-infrastructure',
    pillarUrl: '/founder-hub',
    description: 'Statutory guides for remote developers, global billing prerequisites, and digital infrastructure.',
    keywords: ['developer founder hub', 'global payments for developers', 'remote company guidance'],
  },
];

export class ContentClusterPlanner {
  private logger: GrowthLogger;

  constructor(baseDir = process.cwd()) {
    this.logger = new GrowthLogger('ContentClusterPlanner', baseDir);
  }

  /**
   * Initializes or refreshes topical content clusters avoiding duplicate records
   */
  initializeClusters(): ContentCluster[] {
    const existing = growthStorage.getClusters();
    const existingMap = new Map<string, ContentCluster>(existing.map((c) => [c.id, c]));

    const clusters: ContentCluster[] = PRIMARY_CLUSTERS.map((base) => {
      const prev = existingMap.get(base.id);
      return {
        ...base,
        supportingUrls: prev ? prev.supportingUrls : [],
        freshnessStatus: prev ? prev.freshnessStatus : 'fresh',
        lastUpdated: prev ? prev.lastUpdated : new Date().toISOString(),
      };
    });

    growthStorage.saveClusters(clusters);
    this.logger.info(`Initialized ${clusters.length} content clusters with zero duplicates`);
    return clusters;
  }

  /**
   * Maps content URLs to their primary cluster
   */
  mapContentToClusters(contentUrls: string[]): ContentCluster[] {
    const clusters = this.initializeClusters();

    for (const url of contentUrls) {
      for (const cluster of clusters) {
        const matchesKeyword = cluster.keywords.some((kw) =>
          url.toLowerCase().includes(kw.replace(/\s+/g, '-')) ||
          url.toLowerCase().includes(cluster.slug)
        );

        if (matchesKeyword && !cluster.supportingUrls.includes(url) && url !== cluster.pillarUrl) {
          cluster.supportingUrls.push(url);
        }
      }
    }

    growthStorage.saveClusters(clusters);
    return clusters;
  }

  /**
   * Generates semantic internal linking recommendations
   */
  generateInternalLinkRecommendations(clusters: ContentCluster[]): InternalLinkRecommendation[] {
    const recommendations: InternalLinkRecommendation[] = [];

    for (const cluster of clusters) {
      for (const supportingUrl of cluster.supportingUrls) {
        // Recommend link to the cluster pillar page
        recommendations.push({
          id: `link-${Date.now()}-${recommendations.length}`,
          sourceUrl: supportingUrl,
          targetUrl: cluster.pillarUrl,
          suggestedAnchor: `Explore all ${cluster.name}`,
          relevanceScore: 0.95,
          clusterId: cluster.id,
          status: 'suggested',
          createdAt: new Date().toISOString(),
        });
      }
    }

    growthStorage.saveInternalLinks(recommendations);
    this.logger.info(`Generated ${recommendations.length} semantic internal linking suggestions`);
    return recommendations;
  }
}

export const contentClusterPlanner = new ContentClusterPlanner();
