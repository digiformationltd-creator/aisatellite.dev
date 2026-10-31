import fs from 'node:fs';
import path from 'node:path';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  subsystem: string;
  message: string;
  meta?: Record<string, unknown>;
}

export class Logger {
  private subsystem: string;
  private logDir: string;

  constructor(subsystem: string, baseDir = process.cwd()) {
    this.subsystem = subsystem;
    this.logDir = path.join(baseDir, 'data', 'reports');
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private format(level: LogLevel, message: string, meta?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      subsystem: this.subsystem,
      message,
      meta,
    };
  }

  private write(entry: LogEntry): void {
    const logLine = `[${entry.timestamp}] [${entry.level}] [${entry.subsystem}] ${entry.message}${
      entry.meta ? ' ' + JSON.stringify(entry.meta) : ''
    }\n`;

    // Console output
    if (entry.level === 'ERROR') {
      console.error(logLine.trim());
    } else if (entry.level === 'WARN') {
      console.warn(logLine.trim());
    } else {
      console.log(logLine.trim());
    }

    // Daily audit log file
    try {
      const today = new Date().toISOString().split('T')[0];
      const auditFile = path.join(this.logDir, `audit-${today}.log`);
      fs.appendFileSync(auditFile, logLine, 'utf8');
    } catch {
      // Non-fatal if filesystem append fails
    }
  }

  info(message: string, meta?: Record<string, unknown>): void {
    this.write(this.format('INFO', message, meta));
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.write(this.format('WARN', message, meta));
  }

  error(message: string, meta?: Record<string, unknown>): void {
    this.write(this.format('ERROR', message, meta));
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.write(this.format('DEBUG', message, meta));
  }
}
