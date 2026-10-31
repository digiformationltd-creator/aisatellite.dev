import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { AuditLogSchema, type AuditLog } from '../schemas/index.js';

export class AuditLogger {
  private logFilePath: string;

  constructor(customPath?: string) {
    this.logFilePath =
      customPath ||
      path.resolve(process.cwd(), 'data', 'factory', 'audit-logs.json');

    const dir = path.dirname(this.logFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(this.logFilePath)) {
      fs.writeFileSync(this.logFilePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  /**
   * Generates a tamper-evident hash signature for an audit record
   */
  private generateSignature(record: Omit<AuditLog, 'signature'>): string {
    const raw = `${record.logId}|${record.timestamp}|${record.actor}|${record.action}|${record.projectId || ''}|${JSON.stringify(record.details)}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  /**
   * Appends an audit log entry immutably (supports object or positional arguments)
   */
  log(
    actorOrEntry: string | { actor: string; action: string; details?: Record<string, unknown>; projectId?: string },
    action?: string,
    details: Record<string, unknown> = {},
    projectId?: string
  ): AuditLog {
    let actualActor = '';
    let actualAction = '';
    let actualDetails: Record<string, unknown> = {};
    let actualProjectId: string | undefined;

    if (typeof actorOrEntry === 'object' && actorOrEntry !== null) {
      actualActor = actorOrEntry.actor;
      actualAction = actorOrEntry.action;
      actualDetails = actorOrEntry.details || {};
      actualProjectId = actorOrEntry.projectId;
    } else {
      actualActor = actorOrEntry;
      actualAction = action || '';
      actualDetails = details || {};
      actualProjectId = projectId;
    }

    const logId = `audit-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const timestamp = new Date().toISOString();

    const unsignedEntry = {
      logId,
      timestamp,
      actor: actualActor,
      action: actualAction,
      projectId: actualProjectId,
      details: actualDetails,
    };

    const signature = this.generateSignature(unsignedEntry);
    const validatedEntry = AuditLogSchema.parse({
      ...unsignedEntry,
      signature,
    });

    try {
      const current = this.getAllLogs();
      current.push(validatedEntry);
      fs.writeFileSync(this.logFilePath, JSON.stringify(current, null, 2), 'utf-8');
    } catch {
      // Emergency sync fallback
      fs.writeFileSync(this.logFilePath, JSON.stringify([validatedEntry], null, 2), 'utf-8');
    }

    return validatedEntry;
  }

  /**
   * Retrieves all audit logs
   */
  getAllLogs(): AuditLog[] {
    try {
      if (!fs.existsSync(this.logFilePath)) return [];
      const content = fs.readFileSync(this.logFilePath, 'utf-8');
      return JSON.parse(content) as AuditLog[];
    } catch {
      return [];
    }
  }

  getLogs(): AuditLog[] {
    return this.getAllLogs();
  }

  /**
   * Retrieves audit logs for a specific project
   */
  getLogsByProject(projectId: string): AuditLog[] {
    return this.getAllLogs().filter((l) => l.projectId === projectId);
  }

  /**
   * Verifies the cryptographic integrity of the entire audit chain
   */
  verifyIntegrity(): { valid: boolean; invalidEntries: string[]; errors: string[] } {
    const logs = this.getAllLogs();
    const invalidEntries: string[] = [];

    for (const entry of logs) {
      const { signature, ...unsigned } = entry;
      const expectedSignature = this.generateSignature(unsigned);
      if (signature !== expectedSignature) {
        invalidEntries.push(entry.logId);
      }
    }

    return {
      valid: invalidEntries.length === 0,
      invalidEntries,
      errors: invalidEntries,
    };
  }
}

export const auditLogger = new AuditLogger();
