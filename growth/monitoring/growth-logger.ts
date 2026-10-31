import fs from 'node:fs';
import path from 'node:path';
import type { GrowthAuditLog } from '../schemas/index.js';

export type GrowthLogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export class GrowthLogger {
  private subsystem: string;
  private logDir: string;

  constructor(subsystem: string, baseDir = process.cwd()) {
    this.subsystem = subsystem;
    this.logDir = path.join(baseDir, 'data', 'growth');
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private write(level: GrowthLogLevel, message: string, meta?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] [${level}] [${this.subsystem}] ${message}${
      meta ? ' ' + JSON.stringify(meta) : ''
    }\n`;

    if (level === 'ERROR') {
      console.error(line.trim());
    } else if (level === 'WARN') {
      console.warn(line.trim());
    } else {
      console.log(line.trim());
    }

    try {
      const logFile = path.join(this.logDir, 'audit.log');
      fs.appendFileSync(logFile, line, 'utf8');
    } catch {
      // Non-fatal if filesystem append fails
    }
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.write('INFO', message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.write('WARN', message, meta);
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.write('ERROR', message, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.write('DEBUG', message, meta);
  }

  recordAudit(action: string, actor: string, details: Record<string, unknown>): GrowthAuditLog {
    const entry: GrowthAuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      action,
      actor,
      details,
      timestamp: new Date().toISOString(),
    };

    this.info(`[AUDIT] ${action} by ${actor}`, details);
    return entry;
  }
}
