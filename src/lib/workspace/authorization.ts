/**
 * AI Satellite — Workspace Authorization & IDOR Defense (Phase 12)
 * Enforces server-side ownership checks across private workspace resources.
 */

import { workspaceDatabase } from './database';
import crypto from 'node:crypto';

export interface OwnershipGuarded {
  userId: string;
  isPublic?: boolean;
}

export class AuthorizationGuard {
  /**
   * Verifies if requesting user owns the resource or if the resource is explicitly public.
   */
  public canAccess<T extends OwnershipGuarded>(
    requestingUserId: string,
    resource: T | undefined
  ): { allowed: boolean; error?: string } {
    if (!resource) {
      return { allowed: false, error: 'Resource not found.' };
    }

    if (resource.userId === requestingUserId) {
      return { allowed: true };
    }

    if (resource.isPublic === true) {
      return { allowed: true };
    }

    // Unauthorized IDOR attempt
    workspaceDatabase.logAuditEvent({
      id: `audit-${crypto.randomBytes(6).toString('hex')}`,
      userId: requestingUserId,
      action: 'UNAUTHORIZED_IDOR_BLOCKED',
      resourceType: 'private_resource',
      timestamp: new Date().toISOString(),
      details: { targetOwnerId: resource.userId },
    });

    return {
      allowed: false,
      error: 'Access Denied: You do not have authorization to view or modify this private resource.',
    };
  }

  /**
   * Strictly enforces write/mutation ownership (never allows public modifications).
   */
  public canMutate<T extends OwnershipGuarded>(
    requestingUserId: string,
    resource: T | undefined
  ): { allowed: boolean; error?: string } {
    if (!resource) {
      return { allowed: false, error: 'Resource not found.' };
    }

    if (resource.userId !== requestingUserId) {
      workspaceDatabase.logAuditEvent({
        id: `audit-${crypto.randomBytes(6).toString('hex')}`,
        userId: requestingUserId,
        action: 'UNAUTHORIZED_MUTATION_BLOCKED',
        resourceType: 'private_resource',
        timestamp: new Date().toISOString(),
        details: { targetOwnerId: resource.userId },
      });

      return {
        allowed: false,
        error: 'Access Denied: You are not the authorized owner of this resource.',
      };
    }

    return { allowed: true };
  }
}

export const authorizationGuard = new AuthorizationGuard();
