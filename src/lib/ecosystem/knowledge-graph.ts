/**
 * AI Satellite — Phase 19 Unified Knowledge Graph Engine
 * Connects Central Resources, Capabilities, Licenses, Alternatives, Tutorials,
 * Prompts, and Community Discussions into an authoritative semantic graph.
 * Permanent Canonical Domain: https://aisatellite.dev
 */

import { randomBytes } from 'node:crypto';
import type {
  UnifiedKnowledgeGraphEdge,
  KnowledgeRelationship,
  CentralResource,
} from './types';
import { ecosystemDatabase, EcosystemDatabase } from './database';

export class UnifiedKnowledgeGraph {
  private db: EcosystemDatabase;

  constructor(db?: EcosystemDatabase) {
    this.db = db || ecosystemDatabase;
  }

  public addEdge(input: {
    sourceId: string;
    targetId: string;
    relationship: KnowledgeRelationship;
    confidence?: number;
    verified?: boolean;
    evidenceId?: string;
  }): UnifiedKnowledgeGraphEdge {
    // Check if edge already exists
    const existing = this.db
      .getGraphEdges()
      .find(
        (e) =>
          e.sourceId === input.sourceId &&
          e.targetId === input.targetId &&
          e.relationship === input.relationship
      );

    if (existing) {
      const updated: UnifiedKnowledgeGraphEdge = {
        ...existing,
        confidence: input.confidence ?? existing.confidence,
        verified: input.verified ?? existing.verified,
        evidenceId: input.evidenceId || existing.evidenceId,
      };
      this.db.saveGraphEdge(updated);
      return updated;
    }

    const edge: UnifiedKnowledgeGraphEdge = {
      id: `edge_${randomBytes(6).toString('hex')}`,
      sourceId: input.sourceId,
      targetId: input.targetId,
      relationship: input.relationship,
      confidence: input.confidence ?? 0.95,
      verified: input.verified ?? true,
      evidenceId: input.evidenceId,
      createdAt: new Date().toISOString(),
    };

    this.db.saveGraphEdge(edge);
    return edge;
  }

  public getEdges(): UnifiedKnowledgeGraphEdge[] {
    return this.db.getGraphEdges();
  }

  public getEdgesForResource(resourceId: string): UnifiedKnowledgeGraphEdge[] {
    return this.db
      .getGraphEdges()
      .filter((e) => e.sourceId === resourceId || e.targetId === resourceId);
  }

  public getAlternativesFor(resourceId: string): {
    resource: CentralResource;
    relationship: KnowledgeRelationship;
    confidence: number;
  }[] {
    const edges = this.db
      .getGraphEdges()
      .filter(
        (e) =>
          (e.sourceId === resourceId || e.targetId === resourceId) &&
          (e.relationship === 'alternative_to' || e.relationship === 'replaces')
      );

    const results: {
      resource: CentralResource;
      relationship: KnowledgeRelationship;
      confidence: number;
    }[] = [];

    for (const edge of edges) {
      const otherId = edge.sourceId === resourceId ? edge.targetId : edge.sourceId;
      const otherResource = this.db.getResourceById(otherId);
      if (otherResource) {
        results.push({
          resource: otherResource,
          relationship: edge.relationship,
          confidence: edge.confidence,
        });
      }
    }

    return results;
  }

  public removeEdge(id: string): boolean {
    return this.db.deleteGraphEdge(id);
  }
}

export const unifiedKnowledgeGraph = new UnifiedKnowledgeGraph();
