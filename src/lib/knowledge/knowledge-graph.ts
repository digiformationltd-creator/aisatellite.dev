/**
 * AI Satellite — Semantic Knowledge Graph & Internal Linking Engine (Phase 11)
 * Traverses interconnected relationships between Paid Tools, Verified Free Alternatives,
 * Open-Source Projects, Coding Tutorials, APIs, System Prompts, and Troubleshooting Guides.
 */

export interface KnowledgeGraphNode {
  id: string;
  title: string;
  slug: string;
  type: 'paid_tool' | 'free_alternative' | 'open_source' | 'tutorial' | 'api' | 'prompt' | 'troubleshooting' | 'comparison';
  url: string;
  relatedNodeIds: string[];
}

export interface SemanticRelationship {
  sourceId: string;
  targetId: string;
  relationshipType: 'replaces' | 'implements' | 'documents' | 'integrates_with' | 'troubleshoots' | 'prompts_for';
  confidence: number;
}

export class KnowledgeGraphEngine {
  private nodes: Map<string, KnowledgeGraphNode> = new Map();
  private relationships: SemanticRelationship[] = [];

  constructor() {
    this.seedDefaultGraph();
  }

  private seedDefaultGraph(): void {
    const defaultNodes: KnowledgeGraphNode[] = [
      {
        id: 'zapier',
        title: 'Zapier (Commercial Automation)',
        slug: 'zapier',
        type: 'paid_tool',
        url: '/tools/zapier',
        relatedNodeIds: ['n8n', 'activepieces', 'tutorial-cloudflare-worker-api-proxy'],
      },
      {
        id: 'n8n',
        title: 'n8n (Self-Hosted Workflow Automation)',
        slug: 'n8n',
        type: 'free_alternative',
        url: '/alternatives/zapier-alternatives',
        relatedNodeIds: ['zapier', 'tutorial-cloudflare-worker-api-proxy', 'prompt-agentic-mcp-system-prompt'],
      },
      {
        id: 'firebase',
        title: 'Firebase (Proprietary BaaS)',
        slug: 'firebase',
        type: 'paid_tool',
        url: '/tools/firebase',
        relatedNodeIds: ['supabase'],
      },
      {
        id: 'supabase',
        title: 'Supabase (Open-Source Firebase Alternative)',
        slug: 'supabase',
        type: 'free_alternative',
        url: '/tools/supabase',
        relatedNodeIds: ['firebase', 'trouble-react-hydration-mismatch'],
      },
      {
        id: 'trouble-react-hydration-mismatch',
        title: 'React Hydration Mismatch Fix',
        slug: 'react-hydration-mismatch-fix',
        type: 'troubleshooting',
        url: '/troubleshooting/react-hydration-mismatch-fix',
        relatedNodeIds: ['supabase'],
      },
      {
        id: 'prompt-claude-code-senior-architect',
        title: 'Claude Code Senior Architect Prompt',
        slug: 'claude-code-senior-architect',
        type: 'prompt',
        url: '/prompts/claude-code-senior-architect',
        relatedNodeIds: ['openai-api'],
      },
      {
        id: 'openai-api',
        title: 'OpenAI API (Cloud LLM Platform)',
        slug: 'openai-api',
        type: 'paid_tool',
        url: '/tools/openai',
        relatedNodeIds: ['ollama', 'prompt-claude-code-senior-architect'],
      },
      {
        id: 'ollama',
        title: 'Ollama (Local Open-Source LLM Runner)',
        slug: 'ollama',
        type: 'open_source',
        url: '/tools/ollama',
        relatedNodeIds: ['openai-api', 'api-github-rest', 'trouble-webgl-context-lost'],
      },
      {
        id: 'activepieces',
        title: 'Activepieces (Open-Source Automation)',
        slug: 'activepieces',
        type: 'free_alternative',
        url: '/alternatives/zapier-alternatives',
        relatedNodeIds: ['zapier', 'n8n'],
      },
      {
        id: 'tutorial-cloudflare-worker-api-proxy',
        title: 'Cloudflare Worker Free API Proxy',
        slug: 'cloudflare-worker-api-proxy',
        type: 'tutorial',
        url: '/tutorials/cloudflare-worker-api-proxy',
        relatedNodeIds: ['zapier', 'n8n'],
      },
      {
        id: 'prompt-agentic-mcp-system-prompt',
        title: 'Agentic MCP System Prompt',
        slug: 'agentic-mcp-system-prompt',
        type: 'prompt',
        url: '/prompts/agentic-mcp-system-prompt',
        relatedNodeIds: ['n8n'],
      },
      {
        id: 'api-github-rest',
        title: 'GitHub REST API v3',
        slug: 'github-rest-api',
        type: 'api',
        url: '/free-apis/github-rest-api',
        relatedNodeIds: ['ollama'],
      },
      {
        id: 'prompt-threejs-shader-cyber-grid',
        title: 'Three.js Shader Cyber Grid Prompt',
        slug: 'threejs-shader-cyber-grid',
        type: 'prompt',
        url: '/prompts/threejs-shader-cyber-grid',
        relatedNodeIds: ['tutorial-radar'],
      },
      {
        id: 'tutorial-radar',
        title: 'Building an Orbital 3D Radar with Three.js',
        slug: 'building-orbital-3d-radar-threejs-astro',
        type: 'tutorial',
        url: '/tutorials/building-orbital-3d-radar-threejs-astro',
        relatedNodeIds: ['trouble-webgl-context-lost', 'prompt-threejs-shader-cyber-grid'],
      },
      {
        id: 'trouble-webgl-context-lost',
        title: 'Handling Three.js WebGL Context Loss',
        slug: 'threejs-webgl-context-loss-handling',
        type: 'troubleshooting',
        url: '/troubleshooting/threejs-webgl-context-loss-handling',
        relatedNodeIds: ['tutorial-radar'],
      },
    ];

    defaultNodes.forEach((node) => this.nodes.set(node.id, node));

    this.relationships = [
      { sourceId: 'n8n', targetId: 'zapier', relationshipType: 'replaces', confidence: 0.95 },
      { sourceId: 'supabase', targetId: 'firebase', relationshipType: 'replaces', confidence: 0.92 },
      { sourceId: 'ollama', targetId: 'openai-api', relationshipType: 'replaces', confidence: 0.88 },
      { sourceId: 'tutorial-radar', targetId: 'trouble-webgl-context-lost', relationshipType: 'troubleshoots', confidence: 0.9 },
    ];
  }

  /**
   * Retrieves a node by ID.
   */
  public getNode(nodeId: string): KnowledgeGraphNode | undefined {
    return this.nodes.get(nodeId);
  }

  /**
   * Retrieves all contextual relationships for a given resource.
   */
  public getRelatedNodes(nodeId: string): KnowledgeGraphNode[] {
    const node = this.nodes.get(nodeId);
    if (!node) return [];

    return node.relatedNodeIds
      .map((id) => this.nodes.get(id))
      .filter((n): n is KnowledgeGraphNode => !!n);
  }

  /**
   * Validates internal link integrity across all graph nodes.
   */
  public validateGraphIntegrity(): { isValid: boolean; brokenLinks: Array<{ source: string; target: string }> } {
    const broken: Array<{ source: string; target: string }> = [];
    for (const [id, node] of this.nodes.entries()) {
      for (const relId of node.relatedNodeIds) {
        if (!this.nodes.has(relId)) {
          broken.push({ source: id, target: relId });
        }
      }
    }
    return {
      isValid: broken.length === 0,
      brokenLinks: broken,
    };
  }

  /**
   * Returns complete graph data for visualization or search semantic ranking.
   */
  public getGraphData(): { nodes: KnowledgeGraphNode[]; relationships: SemanticRelationship[] } {
    return {
      nodes: Array.from(this.nodes.values()),
      relationships: [...this.relationships],
    };
  }
}

export const knowledgeGraphEngine = new KnowledgeGraphEngine();
