/**
 * AI Satellite — Phase 19 Unified Notification System
 * Consolidates alerts across Workspace, Community, Editorial, Security, and SRE
 * with category routing and user preference filtering.
 * Permanent Canonical Domain: https://aisatellite.dev
 */

import { randomBytes } from 'node:crypto';
import type {
  UnifiedNotification,
  NotificationCategory,
} from './types';
import { ecosystemDatabase, EcosystemDatabase } from './database';

export class UnifiedNotificationService {
  private db: EcosystemDatabase;

  constructor(db?: EcosystemDatabase) {
    this.db = db || ecosystemDatabase;
  }

  public dispatchNotification(input: {
    userId: string;
    category: NotificationCategory;
    title: string;
    body: string;
    actionUrl?: string;
  }): UnifiedNotification {
    const notification: UnifiedNotification = {
      id: `notif_${randomBytes(6).toString('hex')}`,
      userId: input.userId,
      category: input.category,
      title: input.title,
      body: input.body,
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: input.actionUrl,
    };

    this.db.saveNotification(notification);
    return notification;
  }

  public getUserNotifications(userId: string, unreadOnly = false): UnifiedNotification[] {
    const all = this.db.getNotifications(userId);
    if (unreadOnly) {
      return all.filter((n) => !n.read);
    }
    return all.reverse();
  }

  public markAsRead(id: string, userId: string): boolean {
    return this.db.markNotificationRead(id, userId);
  }

  public getUnreadCount(userId: string): number {
    return this.db.getNotifications(userId).filter((n) => !n.read).length;
  }
}

export const unifiedNotificationService = new UnifiedNotificationService();
