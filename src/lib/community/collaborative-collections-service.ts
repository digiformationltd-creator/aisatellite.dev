/**
 * AI Satellite — Collaborative Collections Service (Phase 13)
 * Multi-user collaborative resource curations with role-based permissions
 * (owner, editor, viewer), version bumps, and strict workspace isolation.
 */

import crypto from 'node:crypto';
import { communityDatabase } from './database';
import {
  CreateCollaborativeCollectionSchema,
  type CollaborativeCollection,
  type CollectionRole,
} from './types';
import { spamPreventionService } from './spam-prevention';

export class CollaborativeCollectionsService {
  /**
   * Creates a new collaborative collection. Private by default.
   */
  public createCollection(
    ownerId: string,
    ownerUsername: string,
    input: {
      title: string;
      description?: string;
      isPublic?: boolean;
      resourceIds?: string[];
      notes?: string;
      tags?: string[];
    }
  ): { success: boolean; collection?: CollaborativeCollection; error?: string } {
    const validated = CreateCollaborativeCollectionSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || 'Invalid collection data' };
    }

    const now = new Date().toISOString();
    const id = `col-${crypto.randomBytes(6).toString('hex')}`;

    const collection: CollaborativeCollection = {
      id,
      ownerId,
      ownerUsername,
      title: spamPreventionService.sanitizeContent(input.title.trim()),
      description: input.description ? spamPreventionService.sanitizeContent(input.description.trim()) : '',
      isPublic: input.isPublic ?? false, // Private by default
      resourceIds: input.resourceIds || [],
      notes: input.notes ? spamPreventionService.sanitizeContent(input.notes) : '',
      tags: (input.tags || []).map((t) => t.trim().toLowerCase()),
      version: 1,
      members: [
        {
          userId: ownerId,
          username: ownerUsername,
          role: 'owner',
          addedAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    communityDatabase.saveCollaborativeCollection(collection);
    return { success: true, collection };
  }

  /**
   * Checks whether a user has the required permission level for a collection.
   * Role hierarchy: owner > editor > viewer
   */
  public checkRole(
    collection: CollaborativeCollection,
    userId: string,
    requiredRole: CollectionRole
  ): boolean {
    if (collection.ownerId === userId) return true;

    const membership = collection.members.find((m) => m.userId === userId);
    if (!membership) return false;

    if (requiredRole === 'viewer') {
      return true; // Any member can view
    }
    if (requiredRole === 'editor') {
      return membership.role === 'editor' || membership.role === 'owner';
    }
    if (requiredRole === 'owner') {
      return membership.role === 'owner';
    }

    return false;
  }

  /**
   * Invites a collaborator with editor or viewer role.
   * Permission: Only the owner can invite collaborators.
   */
  public inviteMember(
    collectionId: string,
    requesterId: string,
    targetUser: { userId: string; username: string; role: 'editor' | 'viewer' }
  ): { success: boolean; error?: string } {
    const col = communityDatabase.findCollectionById(collectionId);
    if (!col) return { success: false, error: 'Collection not found' };

    if (!this.checkRole(col, requesterId, 'owner')) {
      return { success: false, error: 'Permission denied: only the collection owner can invite collaborators.' };
    }

    const existingIndex = col.members.findIndex((m) => m.userId === targetUser.userId);
    if (existingIndex >= 0) {
      col.members[existingIndex].role = targetUser.role;
    } else {
      col.members.push({
        userId: targetUser.userId,
        username: targetUser.username,
        role: targetUser.role,
        addedAt: new Date().toISOString(),
      });
    }

    col.updatedAt = new Date().toISOString();
    communityDatabase.saveCollaborativeCollection(col);
    return { success: true };
  }

  /**
   * Removes a member from a collection.
   */
  public removeMember(
    collectionId: string,
    requesterId: string,
    targetUserId: string
  ): { success: boolean; error?: string } {
    const col = communityDatabase.findCollectionById(collectionId);
    if (!col) return { success: false, error: 'Collection not found' };

    // Member can remove themselves; otherwise only owner can remove members
    if (requesterId !== targetUserId && !this.checkRole(col, requesterId, 'owner')) {
      return { success: false, error: 'Permission denied: only the owner or the member themselves can remove access.' };
    }

    if (targetUserId === col.ownerId) {
      return { success: false, error: 'Cannot remove the collection owner.' };
    }

    col.members = col.members.filter((m) => m.userId !== targetUserId);
    col.updatedAt = new Date().toISOString();
    communityDatabase.saveCollaborativeCollection(col);
    return { success: true };
  }

  /**
   * Adds or removes resources in collection.
   * Permission: Owner or Editor.
   */
  public updateResources(
    collectionId: string,
    userId: string,
    resourceIds: string[]
  ): { success: boolean; collection?: CollaborativeCollection; error?: string } {
    const col = communityDatabase.findCollectionById(collectionId);
    if (!col) return { success: false, error: 'Collection not found' };

    if (!this.checkRole(col, userId, 'editor')) {
      return { success: false, error: 'Permission denied: viewer role cannot modify collection resources.' };
    }

    col.resourceIds = resourceIds;
    col.version += 1;
    col.updatedAt = new Date().toISOString();
    communityDatabase.saveCollaborativeCollection(col);
    return { success: true, collection: col };
  }

  /**
   * Publishes or unpublishes collection.
   * Permission: Owner only.
   */
  public setPublicVisibility(
    collectionId: string,
    userId: string,
    isPublic: boolean
  ): { success: boolean; error?: string } {
    const col = communityDatabase.findCollectionById(collectionId);
    if (!col) return { success: false, error: 'Collection not found' };

    if (!this.checkRole(col, userId, 'owner')) {
      return { success: false, error: 'Permission denied: only the collection owner can change visibility.' };
    }

    col.isPublic = isPublic;
    col.updatedAt = new Date().toISOString();
    communityDatabase.saveCollaborativeCollection(col);
    return { success: true };
  }

  /**
   * Gets accessible collections for a user (collections they own or belong to, plus public ones).
   */
  public getUserAccessibleCollections(userId: string): CollaborativeCollection[] {
    return communityDatabase
      .getCollaborativeCollections()
      .filter((c) => c.ownerId === userId || c.members.some((m) => m.userId === userId));
  }

  /**
   * Gets all public collections for the community directory.
   */
  public getPublicCollections(): CollaborativeCollection[] {
    return communityDatabase.getCollaborativeCollections().filter((c) => c.isPublic);
  }
}

export const collaborativeCollectionsService = new CollaborativeCollectionsService();
