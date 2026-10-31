/**
 * AI Satellite — Phase 19 Role-Based Access Control & Authorization Guard
 * Enforces least-privilege role permissions, server-side session checks,
 * and strict IDOR cross-account resource ownership protection.
 * Permanent Canonical Domain: https://aisatellite.dev
 */

import type { UserRole, PlatformPermission } from './types';
import { ROLE_PERMISSIONS } from './types';
import { platformEventBus } from './event-bus';

export interface AuthenticatedUserSession {
  userId: string;
  email: string;
  role: UserRole;
  expiresAt: string;
}

export class AuthGuard {
  // Mock active sessions cache for edge verification
  private activeSessions: Map<string, AuthenticatedUserSession> = new Map();

  constructor() {
    // Seed default admin session for automated operations and testing
    this.activeSessions.set('test_admin_token', {
      userId: 'usr_admin_001',
      email: 'admin@aisatellite.dev',
      role: 'administrator',
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    });

    this.activeSessions.set('test_user_token_a', {
      userId: 'usr_user_001',
      email: 'alex@example.com',
      role: 'registered_user',
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    });

    this.activeSessions.set('test_user_token_b', {
      userId: 'usr_user_002',
      email: 'sam@example.com',
      role: 'registered_user',
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    });
  }

  public registerSession(token: string, session: AuthenticatedUserSession): void {
    this.activeSessions.set(token, session);
  }

  public getSession(token?: string): AuthenticatedUserSession | null {
    if (!token) return null;
    const session = this.activeSessions.get(token);
    if (!session) return null;

    if (new Date(session.expiresAt) < new Date()) {
      this.activeSessions.delete(token);
      return null;
    }
    return session;
  }

  public hasPermission(role: UserRole, permission: PlatformPermission): boolean {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  }

  public authorizeRequest(
    token: string | undefined,
    requiredPermission: PlatformPermission
  ): { authorized: boolean; session?: AuthenticatedUserSession; error?: string } {
    const session = this.getSession(token);
    if (!session) {
      if (requiredPermission === 'read:public') {
        return { authorized: true };
      }
      return { authorized: false, error: 'UNAUTHENTICATED' };
    }

    if (!this.hasPermission(session.role, requiredPermission)) {
      return { authorized: false, session, error: 'FORBIDDEN' };
    }

    return { authorized: true, session };
  }

  /**
   * Strict Insecure Direct Object Reference (IDOR) check:
   * Asserts that the authenticated user strictly matches the owner of the resource.
   * If mismatched, records a security event and blocks access.
   */
  public assertResourceOwnership(
    session: AuthenticatedUserSession,
    resourceOwnerUserId: string
  ): boolean {
    if (session.role === 'administrator' || session.role === 'system_operator') {
      return true; // Superuser override for support
    }

    if (session.userId !== resourceOwnerUserId) {
      platformEventBus.publish(
        'ResearchJobFailed',
        {
          securityAlert: 'IDOR_ACCESS_DENIED',
          requestingUserId: session.userId,
          targetResourceOwner: resourceOwnerUserId,
        },
        'AuthGuard'
      );
      return false;
    }

    return true;
  }
}

export const authGuard = new AuthGuard();
