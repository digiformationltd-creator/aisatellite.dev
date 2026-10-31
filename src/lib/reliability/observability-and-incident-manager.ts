/**
 * AI SATELLITE — OBSERVABILITY, INCIDENTS & ALERT DEDUPLICATION
 * Unified operational error tracking, deduplicated alert routing, and incident lifecycle management.
 */

import crypto from 'node:crypto';
import type {
  Incident,
  IncidentSeverity,
  OperationalAlert,
} from './types';
import { CreateIncidentSchema } from './types';
import { reliabilityDb } from './database';

export class ObservabilityAndIncidentManager {
  /**
   * Dispatches an operational alert with automatic fingerprint-based deduplication.
   * Prevents alert fatigue by grouping identical error signatures within a 15-minute sliding window.
   */
  public triggerAlert(
    sourceComponent: string,
    summary: string,
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  ): { alert: OperationalAlert; isDeduplicated: boolean } {
    const fingerprint = crypto
      .createHash('sha256')
      .update(`${sourceComponent}:${summary.toLowerCase().trim()}`)
      .digest('hex');

    const store = reliabilityDb.getData();
    const now = new Date();
    const existing = store.alerts.find(
      (a) => a.fingerprint === fingerprint && a.status === 'FIRING'
    );

    if (existing) {
      const windowMs = 15 * 60 * 1000;
      const lastSeen = new Date(existing.lastSeenAt).getTime();

      if (now.getTime() - lastSeen < windowMs) {
        // Deduplicate: Increment occurrence counter and update timestamp
        existing.occurrences += 1;
        existing.lastSeenAt = now.toISOString();
        reliabilityDb.persist();
        return { alert: existing, isDeduplicated: true };
      }
    }

    const newAlert: OperationalAlert = {
      id: `alt-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      fingerprint,
      severity,
      summary,
      sourceComponent,
      status: 'FIRING',
      firstSeenAt: now.toISOString(),
      lastSeenAt: now.toISOString(),
      occurrences: 1,
    };

    store.alerts.push(newAlert);
    reliabilityDb.persist();

    return { alert: newAlert, isDeduplicated: false };
  }

  /**
   * Creates an incident record.
   */
  public createIncident(
    title: string,
    severity: IncidentSeverity,
    category: Incident['category'],
    impactSummary: string,
    actionItems: string[] = []
  ): Incident {
    CreateIncidentSchema.parse({
      title,
      severity,
      category,
      impactSummary,
      actionItems,
    });

    const incident: Incident = {
      id: `inc-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      title,
      severity,
      category,
      status: 'DETECTED',
      impactSummary,
      detectedAt: new Date().toISOString(),
      actionItems,
    };

    const store = reliabilityDb.getData();
    store.incidents.unshift(incident);
    reliabilityDb.persist();

    return incident;
  }

  /**
   * Updates an incident status (e.g. from DETECTED to INVESTIGATING, MITIGATED, or RESOLVED).
   */
  public updateIncidentStatus(
    incidentId: string,
    status: Incident['status'],
    rootCause?: string
  ): Incident {
    const store = reliabilityDb.getData();
    const incident = store.incidents.find((i) => i.id === incidentId);

    if (!incident) {
      throw new Error(`Incident ${incidentId} not found.`);
    }

    incident.status = status;
    const now = new Date().toISOString();

    if (status === 'MITIGATED' && !incident.mitigatedAt) {
      incident.mitigatedAt = now;
    }
    if (status === 'RESOLVED' && !incident.resolvedAt) {
      incident.resolvedAt = now;
    }
    if (rootCause) {
      incident.rootCause = rootCause;
    }

    reliabilityDb.persist();
    return incident;
  }

  /**
   * Retrieves all incidents.
   */
  public getIncidents(): Incident[] {
    return reliabilityDb.getData().incidents;
  }

  /**
   * Retrieves active firing alerts.
   */
  public getActiveAlerts(): OperationalAlert[] {
    return reliabilityDb.getData().alerts.filter((a) => a.status === 'FIRING');
  }

  /**
   * Resolves an operational alert.
   */
  public resolveAlert(alertId: string): boolean {
    const store = reliabilityDb.getData();
    const alert = store.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.status = 'RESOLVED';
      reliabilityDb.persist();
      return true;
    }
    return false;
  }
}

export const observabilityAndIncidentManager = new ObservabilityAndIncidentManager();
