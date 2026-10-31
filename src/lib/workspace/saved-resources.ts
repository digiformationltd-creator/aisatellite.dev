/**
 * AI Satellite — Saved Tools & Alternatives Manager (Phase 12)
 * Allows developers to bookmark verified tools and alternatives, attach private notes,
 * and group into custom collections without telemetry.
 */

import crypto from 'node:crypto';
import { workspaceDatabase } from './database';
import { authorizationGuard } from './authorization';
import type { SavedResource, Collection } from './types';

export class SavedResourcesManager {
  /**
   * Saves a tool or alternative to user's private orbit.
   */
  public saveResource(
    userId: string,
    input: {
      resourceId: string;
      resourceCategory: string;
      title: string;
      originalUrl?: string;
      notes?: string;
      tags?: string[];
      collectionId?: string;
    }
  ): { success: boolean; savedResource?: SavedResource; error?: string } {
    const existing = workspaceDatabase
      .getSavedResources(userId)
      .find((r) => r.resourceId === input.resourceId && r.resourceCategory === input.resourceCategory);

    const now = new Date().toISOString();

    if (existing) {
      if (input.notes !== undefined) existing.notes = input.notes;
      if (input.tags) existing.tags = input.tags;
      if (input.collectionId !== undefined) existing.collectionId = input.collectionId;
      existing.updatedAt = now;
      workspaceDatabase.updateSavedResource(existing);
      return { success: true, savedResource: existing };
    }

    const saved: SavedResource = {
      id: `sav-${crypto.randomBytes(6).toString('hex')}`,
      userId,
      resourceId: input.resourceId,
      resourceCategory: input.resourceCategory,
      title: input.title.trim(),
      originalUrl: input.originalUrl || '',
      notes: input.notes?.trim() || '',
      tags: input.tags || [],
      collectionId: input.collectionId,
      savedAt: now,
      updatedAt: now,
    };

    workspaceDatabase.insertSavedResource(saved);
    return { success: true, savedResource: saved };
  }

  /**
   * Removes a saved resource.
   */
  public removeSavedResource(userId: string, savedResourceId: string): boolean {
    return workspaceDatabase.deleteSavedResource(userId, savedResourceId);
  }

  /**
   * Retrieves saved tools for a user.
   */
  public getSavedTools(userId: string): SavedResource[] {
    return workspaceDatabase.getSavedResources(userId).filter((r) => r.resourceCategory !== 'free_alternatives');
  }

  /**
   * Retrieves saved alternatives for a user.
   */
  public getSavedAlternatives(userId: string): SavedResource[] {
    return workspaceDatabase.getSavedResources(userId).filter((r) => r.resourceCategory === 'free_alternatives');
  }

  /**
   * Creates a private or public collection.
   */
  public createCollection(
    userId: string,
    input: { name: string; description?: string; isPublic?: boolean; tags?: string[] }
  ): { success: boolean; collection?: Collection; error?: string } {
    if (!input.name || input.name.trim().length < 2) {
      return { success: false, error: 'Collection name must be at least 2 characters.' };
    }

    const now = new Date().toISOString();
    const col: Collection = {
      id: `col-${crypto.randomBytes(6).toString('hex')}`,
      userId,
      name: input.name.trim(),
      description: input.description?.trim() || '',
      isPublic: input.isPublic || false,
      tags: input.tags || [],
      createdAt: now,
      updatedAt: now,
    };

    workspaceDatabase.insertCollection(col);
    return { success: true, collection: col };
  }

  /**
   * Retrieves user collections.
   */
  public getUserCollections(userId: string): Collection[] {
    return workspaceDatabase.getCollections(userId);
  }
}

export const savedResourcesManager = new SavedResourcesManager();
