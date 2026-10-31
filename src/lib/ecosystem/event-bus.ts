/**
 * AI Satellite — Phase 19 Platform Event Bus
 * Decoupled in-process event publish/subscribe with persistent audit logging
 * and idempotency checks.
 * Permanent Canonical Domain: https://aisatellite.dev
 */

import { randomBytes } from 'node:crypto';
import type { PlatformEvent, PlatformEventType } from './types';
import { ecosystemDatabase, EcosystemDatabase } from './database';

export type EventHandler<T = any> = (event: PlatformEvent<T>) => void | Promise<void>;

export class PlatformEventBus {
  private static instance: PlatformEventBus;
  private db: EcosystemDatabase;
  private subscribers: Map<PlatformEventType, Set<EventHandler>> = new Map();
  private processedEventIds: Set<string> = new Set();

  private constructor(db?: EcosystemDatabase) {
    this.db = db || ecosystemDatabase;
  }

  public static getInstance(): PlatformEventBus {
    if (!PlatformEventBus.instance) {
      PlatformEventBus.instance = new PlatformEventBus();
    }
    return PlatformEventBus.instance;
  }

  public subscribe<T = any>(eventType: PlatformEventType, handler: EventHandler<T>): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType)!.add(handler as EventHandler);

    // Return unsubscribe function
    return () => {
      const handlers = this.subscribers.get(eventType);
      if (handlers) {
        handlers.delete(handler as EventHandler);
      }
    };
  }

  public publish<T extends Record<string, any> = Record<string, any>>(
    eventType: PlatformEventType,
    payload: T,
    emitter = 'system',
    traceId?: string
  ): PlatformEvent<T> {
    const event: PlatformEvent<T> = {
      id: `evt_${randomBytes(6).toString('hex')}`,
      eventType,
      payload,
      timestamp: new Date().toISOString(),
      emitter,
      traceId: traceId || `trc_${randomBytes(6).toString('hex')}`,
    };

    // Idempotency check
    if (this.processedEventIds.has(event.id)) {
      return event;
    }
    this.processedEventIds.add(event.id);
    if (this.processedEventIds.size > 2000) {
      this.processedEventIds.clear();
    }

    // Persist to store
    this.db.addEvent(event as PlatformEvent<Record<string, any>>);

    // Dispatch to registered subscribers
    const handlers = this.subscribers.get(eventType);
    if (handlers) {
      for (const handler of handlers) {
        try {
          const res = handler(event);
          if (res instanceof Promise) {
            res.catch((err) => {
              console.error(`[EventBus] Async handler error for ${eventType}:`, err);
            });
          }
        } catch (err) {
          console.error(`[EventBus] Sync handler error for ${eventType}:`, err);
        }
      }
    }

    return event;
  }

  public getEventHistory(limit = 100): PlatformEvent[] {
    const events = this.db.getEvents();
    return events.slice(-limit).reverse();
  }

  public clearSubscribers(): void {
    this.subscribers.clear();
  }
}

export const platformEventBus = PlatformEventBus.getInstance();
