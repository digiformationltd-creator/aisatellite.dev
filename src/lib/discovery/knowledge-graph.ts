/**
 * AI Satellite — Phase 14 Autonomous Global Technology Discovery & Intelligence Network
 * Engine H: Technology Knowledge Graph
 * 
 * Graph data structure representing entities (products, companies, repos, licenses, capabilities)
 * and directed semantic relationships (replaces, implements, requires, licensed_under, has_alternative).
 */

import { uuidv4 } from './id-generator';
import type {
  KnowledgeGraphNode,
  KnowledgeGraphEdge,
  KnowledgeNodeType,
  KnowledgeRelationshipType,
} from './types';
import { discoveryDatabase, DiscoveryDatabase } from './database';

export class TechnologyKnowledgeGraph {
  private db: DiscoveryDatabase;

  constructor(db?: DiscoveryDatabase) {
    this.db = db || discoveryDatabase;
    this.seedDefaultGraph();
  }

  public addNode(input: {
    type: KnowledgeNodeType;
    name: string;
    slug: string;
    attributes?: Record<string, string | number | boolean | string[]>;
  }): KnowledgeGraphNode {
    const existing = this.db.getGraphNodes().find((n) => n.slug === input.slug && n.type === input.type);
    if (existing) {
      const updated: KnowledgeGraphNode = {
        ...existing,
        name: input.name,
        attributes: { ...existing.attributes, ...(input.attributes || {}) },
      };
      this.db.saveGraphNode(updated);
      return updated;
    }

    const node: KnowledgeGraphNode = {
      id: `node-${uuidv4().slice(0, 8)}`,
      type: input.type,
      name: input.name,
      slug: input.slug,
      attributes: input.attributes || {},
    };

    this.db.saveGraphNode(node);
    return node;
  }

  public addEdge(input: {
    sourceNodeId: string;
    targetNodeId: string;
    relationship: KnowledgeRelationshipType;
    confidence?: number;
    evidenceId?: string;
  }): KnowledgeGraphEdge {
    const existing = this.db.getGraphEdges().find(
      (e) =>
        e.sourceNodeId === input.sourceNodeId &&
        e.targetNodeId === input.targetNodeId &&
        e.relationship === input.relationship
    );

    if (existing) {
      existing.confidence = input.confidence ?? existing.confidence;
      existing.evidenceId = input.evidenceId || existing.evidenceId;
      this.db.saveGraphEdge(existing);
      return existing;
    }

    const edge: KnowledgeGraphEdge = {
      id: `edge-${uuidv4().slice(0, 8)}`,
      sourceNodeId: input.sourceNodeId,
      targetNodeId: input.targetNodeId,
      relationship: input.relationship,
      confidence: input.confidence ?? 1.0,
      evidenceId: input.evidenceId,
    };

    this.db.saveGraphEdge(edge);
    return edge;
  }

  public getNode(id: string): KnowledgeGraphNode | undefined {
    return this.db.getGraphNodes().find((n) => n.id === id);
  }

  public getNodeBySlug(slug: string, type?: KnowledgeNodeType): KnowledgeGraphNode | undefined {
    return this.db.getGraphNodes().find((n) => n.slug === slug && (!type || n.type === type));
  }

  public getNodes(): KnowledgeGraphNode[] {
    return this.db.getGraphNodes();
  }

  public getEdges(): KnowledgeGraphEdge[] {
    return this.db.getGraphEdges();
  }

  public findOutgoingEdges(nodeId: string, rel?: KnowledgeRelationshipType): KnowledgeGraphEdge[] {
    return this.db.getGraphEdges().filter((e) => e.sourceNodeId === nodeId && (!rel || e.relationship === rel));
  }

  public findIncomingEdges(nodeId: string, rel?: KnowledgeRelationshipType): KnowledgeGraphEdge[] {
    return this.db.getGraphEdges().filter((e) => e.targetNodeId === nodeId && (!rel || e.relationship === rel));
  }

  /**
   * Find alternatives for a given product slug
   */
  public findAlternatives(productSlug: string): KnowledgeGraphNode[] {
    const node = this.getNodeBySlug(productSlug, 'product');
    if (!node) return [];

    // Check outgoing replaces / has_alternative
    const outgoing = this.findOutgoingEdges(node.id).filter(
      (e) => e.relationship === 'replaces' || e.relationship === 'has_alternative'
    );
    // Check incoming replaces (tools that replace this product)
    const incoming = this.findIncomingEdges(node.id).filter(
      (e) => e.relationship === 'replaces' || e.relationship === 'has_alternative'
    );

    const relatedIds = new Set<string>();
    outgoing.forEach((e) => relatedIds.add(e.targetNodeId));
    incoming.forEach((e) => relatedIds.add(e.sourceNodeId));

    return this.db.getGraphNodes().filter((n) => relatedIds.has(n.id) && n.id !== node.id);
  }

  /**
   * Find all tools that provide a specific capability
   */
  public findToolsByCapability(capabilitySlug: string): KnowledgeGraphNode[] {
    const capNode = this.getNodeBySlug(capabilitySlug, 'capability');
    if (!capNode) return [];

    // Tools that have edge provides_capability -> capNode
    const incoming = this.findIncomingEdges(capNode.id, 'provides_capability');
    const toolIds = new Set(incoming.map((e) => e.sourceNodeId));

    return this.db.getGraphNodes().filter((n) => toolIds.has(n.id));
  }

  /**
   * Graph neighborhood traversal with cycle protection
   */
  public getNeighborhood(nodeId: string, depth: number = 1): {
    nodes: KnowledgeGraphNode[];
    edges: KnowledgeGraphEdge[];
  } {
    const visitedNodeIds = new Set<string>([nodeId]);
    const gatheredEdges: KnowledgeGraphEdge[] = [];
    let currentLevelIds = [nodeId];

    for (let i = 0; i < depth; i++) {
      const nextLevelIds: string[] = [];

      for (const currId of currentLevelIds) {
        const outEdges = this.findOutgoingEdges(currId);
        const inEdges = this.findIncomingEdges(currId);

        for (const edge of [...outEdges, ...inEdges]) {
          if (!gatheredEdges.some((e) => e.id === edge.id)) {
            gatheredEdges.push(edge);
          }

          const otherId = edge.sourceNodeId === currId ? edge.targetNodeId : edge.sourceNodeId;
          if (!visitedNodeIds.has(otherId)) {
            visitedNodeIds.add(otherId);
            nextLevelIds.push(otherId);
          }
        }
      }

      currentLevelIds = nextLevelIds;
    }

    const nodes = this.db.getGraphNodes().filter((n) => visitedNodeIds.has(n.id));
    return { nodes, edges: gatheredEdges };
  }

  public seedDefaultGraph(): void {
    const existing = this.db.getGraphNodes();
    if (existing.length > 0) return;

    // Nodes
    const supNode = this.addNode({ type: 'product', name: 'Supabase', slug: 'supabase' });
    const fireNode = this.addNode({ type: 'product', name: 'Firebase', slug: 'firebase' });
    const ollamaNode = this.addNode({ type: 'product', name: 'Ollama', slug: 'ollama' });
    const n8nNode = this.addNode({ type: 'product', name: 'n8n', slug: 'n8n' });
    const zapNode = this.addNode({ type: 'product', name: 'Zapier', slug: 'zapier' });
    const mitNode = this.addNode({ type: 'license', name: 'MIT License', slug: 'mit' });
    const apacheNode = this.addNode({ type: 'license', name: 'Apache 2.0', slug: 'apache-2-0' });
    const dbCapNode = this.addNode({ type: 'capability', name: 'Databases', slug: 'databases' });
    const autoCapNode = this.addNode({ type: 'capability', name: 'Workflow Automation', slug: 'workflow-automation' });

    // Edges
    this.addEdge({ sourceNodeId: supNode.id, targetNodeId: fireNode.id, relationship: 'replaces', confidence: 0.95 });
    this.addEdge({ sourceNodeId: supNode.id, targetNodeId: apacheNode.id, relationship: 'licensed_under', confidence: 1.0 });
    this.addEdge({ sourceNodeId: supNode.id, targetNodeId: dbCapNode.id, relationship: 'provides_capability', confidence: 1.0 });

    this.addEdge({ sourceNodeId: n8nNode.id, targetNodeId: zapNode.id, relationship: 'has_alternative', confidence: 0.92 });
    this.addEdge({ sourceNodeId: n8nNode.id, targetNodeId: autoCapNode.id, relationship: 'provides_capability', confidence: 1.0 });

    this.addEdge({ sourceNodeId: ollamaNode.id, targetNodeId: mitNode.id, relationship: 'licensed_under', confidence: 1.0 });
  }
}

export const technologyKnowledgeGraph = new TechnologyKnowledgeGraph();
