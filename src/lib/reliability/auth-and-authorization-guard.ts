/**
 * AI SATELLITE — AUTHENTICATION & AUTHORIZATION GUARD
 * Enforces session cookie security, OAuth CSRF state validation, and prevents Insecure Direct Object References (IDOR).
 */

import crypto from 'node:crypto';
import type {
  SessionSecurityPolicy,
  ResourceAccessRequest,
  AuthorizationResult,
} from './types';

export class AuthAndAuthorizationGuard {
  private activeSessions: Map<string, { userId: string; roles: string[]; createdAt: number; lastActiveAt: number }> =
    new Map();

  private sessionPolicy: SessionSecurityPolicy = {
    cookieName: '__Secure-aisatellite-session',
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAgeSeconds: 7 * 86400, // 7 days max lifetime
    inactivityTimeoutSeconds: 24 * 3600, // 24 hours idle timeout
    csrfTokenRequired: true,
  };

  /**
   * Retrieves the hardened session security policy.
   */
  public getSessionPolicy(): SessionSecurityPolicy {
    return this.sessionPolicy;
  }

  /**
   * Creates a cryptographically secure session token and registers the session.
   */
  public createSession(userId: string, roles: string[] = ['developer']): { sessionToken: string; csrfToken: string } {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const csrfToken = crypto.randomBytes(24).toString('hex');
    const now = Date.now();

    this.activeSessions.set(sessionToken, {
      userId,
      roles,
      createdAt: now,
      lastActiveAt: now,
    });

    return { sessionToken, csrfToken };
  }

  /**
   * Validates an active session token and enforces inactivity expiration.
   */
  public validateSession(sessionToken: string): { isValid: boolean; userId?: string; roles?: string[]; error?: string } {
    const session = this.activeSessions.get(sessionToken);

    if (!session) {
      return { isValid: false, error: 'Session token not found or already revoked.' };
    }

    const now = Date.now();
    const maxAgeMs = this.sessionPolicy.maxAgeSeconds * 1000;
    const idleTimeoutMs = this.sessionPolicy.inactivityTimeoutSeconds * 1000;

    if (now - session.createdAt > maxAgeMs) {
      this.activeSessions.delete(sessionToken);
      return { isValid: false, error: 'Session has exceeded maximum lifetime (7 days).' };
    }

    if (now - session.lastActiveAt > idleTimeoutMs) {
      this.activeSessions.delete(sessionToken);
      return { isValid: false, error: 'Session expired due to 24-hour inactivity.' };
    }

    // Refresh last active timestamp
    session.lastActiveAt = now;

    return {
      isValid: true,
      userId: session.userId,
      roles: session.roles,
    };
  }

  /**
   * Revokes an existing session token.
   */
  public revokeSession(sessionToken: string): boolean {
    return this.activeSessions.delete(sessionToken);
  }

  /**
   * Generates and validates cryptographically secure OAuth state tokens for CSRF protection.
   */
  public generateOAuthState(provider: string): { state: string; signature: string } {
    const nonce = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now().toString();
    const state = `${provider}:${nonce}:${timestamp}`;
    const hmac = crypto.createHmac('sha256', 'oauth-state-secret-internal');
    hmac.update(state);
    const signature = hmac.digest('hex');

    return { state, signature };
  }

  /**
   * Validates OAuth state token to prevent CSRF callback manipulation.
   */
  public verifyOAuthState(state: string, signature: string, maxAgeMs: number = 300000): boolean {
    try {
      const parts = state.split(':');
      if (parts.length !== 3) return false;

      const [, , timestampStr] = parts;
      const timestamp = parseInt(timestampStr, 10);
      if (isNaN(timestamp) || Date.now() - timestamp > maxAgeMs) {
        return false; // Expired state
      }

      const hmac = crypto.createHmac('sha256', 'oauth-state-secret-internal');
      hmac.update(state);
      const expectedSignature = hmac.digest('hex');

      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    } catch {
      return false;
    }
  }

  /**
   * Server-side authorization check preventing Insecure Direct Object References (IDOR).
   * Validates that the requesting user owns the resource or has an authorized administrator role.
   */
  public authorizeResourceAccess(request: ResourceAccessRequest): AuthorizationResult {
    const { requestingUserId, resourceOwnerId, resourceType, action, requestingUserRoles = [] } = request;

    // Admin role bypass for moderation and operations
    const isAdmin = requestingUserRoles.includes('admin') || requestingUserRoles.includes('steward');

    if (resourceType === 'admin-console') {
      if (isAdmin) {
        return { granted: true };
      }
      return {
        granted: false,
        denialReason: 'Access to administrative consoles requires administrator or steward privileges.',
      };
    }

    // Direct object ownership check
    if (requestingUserId === resourceOwnerId) {
      return { granted: true };
    }

    // Read-only public exception could apply, but for private user resources (workspace, private snippet/prompt)
    if (isAdmin && action === 'READ') {
      return { granted: true };
    }

    // IDOR violation detected
    return {
      granted: false,
      isIdorAttemptDetected: true,
      denialReason: `Unauthorized: User "${requestingUserId}" cannot ${action} ${resourceType} belonging to "${resourceOwnerId}".`,
    };
  }
}

export const authAndAuthorizationGuard = new AuthAndAuthorizationGuard();
