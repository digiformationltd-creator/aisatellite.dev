/**
 * AI Satellite — Workspace Notification Service (Phase 12)
 * Dispatches verified event-based notifications, respecting granular user preferences.
 */

import crypto from 'node:crypto';
import { workspaceDatabase } from './database';
import type { WorkspaceNotification, NotificationType } from './types';

export class NotificationService {
  /**
   * Dispatches a notification if the user has opted in for this event category.
   */
  public dispatchNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    resourceId?: string
  ): { dispatched: boolean; notification?: WorkspaceNotification; reason?: string } {
    const prefs = workspaceDatabase.getPreferences(userId);

    // Filter by preferences
    if (prefs) {
      if (type === 'price_change' && !prefs.notificationPreferences.priceAlerts) {
        return { dispatched: false, reason: 'User opted out of price alerts.' };
      }
      if (type === 'license_update' && !prefs.notificationPreferences.licenseAlerts) {
        return { dispatched: false, reason: 'User opted out of license alerts.' };
      }
      if (type === 'security_alert' && !prefs.notificationPreferences.securityAlerts) {
        return { dispatched: false, reason: 'User opted out of security alerts.' };
      }
      if (type === 'learning_reminder' && !prefs.notificationPreferences.learningReminders) {
        return { dispatched: false, reason: 'User opted out of learning reminders.' };
      }
      if (type === 'availability_change' && !prefs.notificationPreferences.availabilityAlerts) {
        return { dispatched: false, reason: 'User opted out of availability alerts.' };
      }
    }

    const notif: WorkspaceNotification = {
      id: `notif-${crypto.randomBytes(6).toString('hex')}`,
      userId,
      type,
      title: title.trim(),
      message: message.trim(),
      resourceId,
      read: false,
      createdAt: new Date().toISOString(),
    };

    workspaceDatabase.insertNotification(notif);
    return { dispatched: true, notification: notif };
  }

  /**
   * Retrieves all notifications for a user.
   */
  public getUserNotifications(userId: string): WorkspaceNotification[] {
    return workspaceDatabase.getNotifications(userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Marks a notification as read.
   */
  public markAsRead(userId: string, notificationId: string): void {
    workspaceDatabase.markNotificationAsRead(userId, notificationId);
  }
}

export const notificationService = new NotificationService();
