/**
 * AI Satellite — Workspace Authentication Service (Phase 12)
 * Secure salted password hashing, rate limiting, session issuance, email verification,
 * and session lifecycle management.
 */

import crypto from 'node:crypto';
import { workspaceDatabase } from './database';
import type { User, Session, UserPreferences } from './types';
import { RegisterUserSchema, LoginUserSchema } from './types';

export class AuthService {
  private failedAttempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  private readonly SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

  /**
   * Generates a random cryptographic salt.
   */
  public generateSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Hashes a password using PBKDF2 with SHA-512 and salt.
   */
  public hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  }

  /**
   * Compares two hashes in constant time to prevent timing attacks.
   */
  public verifyPasswordHash(password: string, salt: string, storedHash: string): boolean {
    const computed = this.hashPassword(password, salt);
    const bufA = Buffer.from(computed, 'hex');
    const bufB = Buffer.from(storedHash, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  }

  /**
   * Generates a 256-bit cryptographically secure session token.
   */
  public generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Registers a new user account with hashed credentials and default preferences.
   */
  public register(input: { email: string; password: string; name?: string }): {
    success: boolean;
    user?: User;
    error?: string;
  } {
    const validated = RegisterUserSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: validated.error.errors[0]?.message || 'Invalid registration details' };
    }

    const existing = workspaceDatabase.findUserByEmail(input.email);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const salt = this.generateSalt();
    const passwordHash = this.hashPassword(input.password, salt);
    const now = new Date().toISOString();
    const userId = `usr-${crypto.randomBytes(6).toString('hex')}`;
    const verificationToken = crypto.randomBytes(24).toString('hex');

    const newUser: User = {
      id: userId,
      email: input.email.toLowerCase().trim(),
      name: input.name?.trim() || 'Developer',
      passwordHash,
      salt,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      role: 'user',
      createdAt: now,
      updatedAt: now,
    };

    workspaceDatabase.insertUser(newUser);

    // Seed default preferences
    const defaultPreferences: UserPreferences = {
      userId,
      interests: ['AI development', 'TypeScript', 'Open-source software'],
      defaultStack: 'TypeScript & React',
      telemetryEnabled: false,
      personalizationEnabled: true,
      notificationPreferences: {
        priceAlerts: true,
        licenseAlerts: true,
        securityAlerts: true,
        learningReminders: false,
        availabilityAlerts: true,
      },
      theme: 'cosmic',
      updatedAt: now,
    };

    workspaceDatabase.savePreferences(defaultPreferences);

    workspaceDatabase.logAuditEvent({
      id: `audit-${crypto.randomBytes(6).toString('hex')}`,
      userId,
      action: 'USER_REGISTERED',
      resourceType: 'user',
      resourceId: userId,
      timestamp: now,
    });

    return { success: true, user: newUser };
  }

  /**
   * Authenticates user credentials with rate-limiting and session creation.
   */
  public login(input: { email: string; password: string; ipAddress?: string; userAgent?: string }): {
    success: boolean;
    token?: string;
    session?: Session;
    user?: User;
    error?: string;
  } {
    const validated = LoginUserSchema.safeParse(input);
    if (!validated.success) {
      return { success: false, error: 'Valid email and password required.' };
    }

    const ipKey = input.ipAddress || input.email.toLowerCase();
    const attempts = this.failedAttempts.get(ipKey);
    const nowMs = Date.now();

    if (attempts && attempts.count >= this.MAX_FAILED_ATTEMPTS) {
      if (nowMs - attempts.lastAttempt < this.LOCKOUT_WINDOW_MS) {
        return {
          success: false,
          error: 'Account temporarily locked due to excessive failed attempts. Please retry in 15 minutes.',
        };
      } else {
        this.failedAttempts.delete(ipKey);
      }
    }

    const user = workspaceDatabase.findUserByEmail(input.email);
    if (!user) {
      this.recordFailedAttempt(ipKey);
      return { success: false, error: 'Invalid email or password credentials.' };
    }

    const isValid = this.verifyPasswordHash(input.password, user.salt, user.passwordHash);
    if (!isValid) {
      this.recordFailedAttempt(ipKey);
      return { success: false, error: 'Invalid email or password credentials.' };
    }

    // Reset failed attempts on success
    this.failedAttempts.delete(ipKey);

    const token = this.generateSessionToken();
    const session: Session = {
      id: `sess-${crypto.randomBytes(8).toString('hex')}`,
      token,
      userId: user.id,
      expiresAt: new Date(nowMs + this.SESSION_DURATION_MS).toISOString(),
      createdAt: new Date(nowMs).toISOString(),
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
    };

    workspaceDatabase.insertSession(session);

    workspaceDatabase.logAuditEvent({
      id: `audit-${crypto.randomBytes(6).toString('hex')}`,
      userId: user.id,
      action: 'USER_LOGIN',
      resourceType: 'session',
      resourceId: session.id,
      timestamp: new Date().toISOString(),
      ipAddress: input.ipAddress,
    });

    return {
      success: true,
      token,
      session,
      user,
    };
  }

  private recordFailedAttempt(key: string): void {
    const current = this.failedAttempts.get(key) || { count: 0, lastAttempt: Date.now() };
    this.failedAttempts.set(key, { count: current.count + 1, lastAttempt: Date.now() });
  }

  /**
   * Validates session token, returning user and session if still valid.
   */
  public validateSession(token: string): { user: User; session: Session } | undefined {
    if (!token) return undefined;
    const session = workspaceDatabase.findSessionByToken(token);
    if (!session) return undefined;

    // Check expiration
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      workspaceDatabase.deleteSession(token);
      return undefined;
    }

    const user = workspaceDatabase.findUserById(session.userId);
    if (!user) {
      workspaceDatabase.deleteSession(token);
      return undefined;
    }

    return { user, session };
  }

  /**
   * Logs out user by revoking the session token.
   */
  public logout(token: string): boolean {
    if (!token) return false;
    const session = workspaceDatabase.findSessionByToken(token);
    if (session) {
      workspaceDatabase.deleteSession(token);
      workspaceDatabase.logAuditEvent({
        id: `audit-${crypto.randomBytes(6).toString('hex')}`,
        userId: session.userId,
        action: 'USER_LOGOUT',
        resourceType: 'session',
        resourceId: session.id,
        timestamp: new Date().toISOString(),
      });
      return true;
    }
    return false;
  }

  /**
   * Verifies user email address.
   */
  public verifyEmail(userId: string, token: string): boolean {
    const user = workspaceDatabase.findUserById(userId);
    if (!user) return false;

    if (user.emailVerificationToken === token) {
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      user.updatedAt = new Date().toISOString();
      workspaceDatabase.updateUser(user);
      return true;
    }
    return false;
  }

  /**
   * Initiates password reset flow.
   */
  public requestPasswordReset(email: string): { success: boolean; token?: string } {
    const user = workspaceDatabase.findUserByEmail(email);
    if (!user) return { success: true }; // Prevent email enumeration

    const resetToken = crypto.randomBytes(24).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hr
    workspaceDatabase.updateUser(user);

    return { success: true, token: resetToken };
  }

  /**
   * Completes password reset.
   */
  public resetPassword(token: string, newPassword: string): boolean {
    if (newPassword.length < 8) return false;
    const user = workspaceDatabase.findUserById(
      workspaceDatabase['data'].users.find((u) => u.passwordResetToken === token)?.id || ''
    );
    if (!user) return false;

    if (!user.passwordResetExpires || new Date(user.passwordResetExpires).getTime() < Date.now()) {
      return false;
    }

    const salt = this.generateSalt();
    user.passwordHash = this.hashPassword(newPassword, salt);
    user.salt = salt;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.updatedAt = new Date().toISOString();
    workspaceDatabase.updateUser(user);
    return true;
  }

  /**
   * Deletes user account and cascades all private records.
   */
  public deleteAccount(userId: string, sessionToken: string): boolean {
    const valid = this.validateSession(sessionToken);
    if (!valid || valid.user.id !== userId) {
      return false;
    }

    workspaceDatabase.deleteUserAccount(userId);
    return true;
  }
}

export const authService = new AuthService();
