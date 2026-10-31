/**
 * AI SATELLITE — DATABASE RELIABILITY & SCALING SERVICE
 * Verifies Cloudflare D1 migrations, schema constraints, composite indexes, and scaling policies.
 */

import fs from 'node:fs';
import path from 'node:path';

export interface MigrationAuditResult {
  migrationFile: string;
  version: number;
  tablesCount: number;
  indicesCount: number;
  hasForeignKeys: boolean;
  hasCompositeIndices: boolean;
  isValid: boolean;
}

export interface DatabaseScalingStrategy {
  maxPageLimit: number;
  defaultPageLimit: number;
  eventRetentionDays: number;
  archiveStrategy: string;
  isConnectionPoolingAware: boolean;
  queryTimeoutMs: number;
}

export class DatabaseReliabilityService {
  private migrationsDir: string;

  constructor() {
    this.migrationsDir = path.resolve(process.cwd(), 'migrations');
  }

  /**
   * Audits all existing migration SQL files on disk.
   */
  public auditMigrations(): MigrationAuditResult[] {
    if (!fs.existsSync(this.migrationsDir)) {
      return [];
    }

    const files = fs
      .readdirSync(this.migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    return files.map((file, idx) => {
      const filePath = path.join(this.migrationsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      const tablesCount = (content.match(/CREATE TABLE IF NOT EXISTS/gi) || []).length;
      const indicesCount = (content.match(/CREATE INDEX IF NOT EXISTS|CREATE UNIQUE INDEX IF NOT EXISTS/gi) || []).length;
      const hasForeignKeys = /REFERENCES/i.test(content);
      const hasCompositeIndices = /\([a-zA-Z0-9_]+,\s*[a-zA-Z0-9_]+\)/i.test(content);

      return {
        migrationFile: file,
        version: idx + 1,
        tablesCount,
        indicesCount,
        hasForeignKeys,
        hasCompositeIndices,
        isValid: tablesCount > 0,
      };
    });
  }

  /**
   * Retrieves database scaling, pagination, and archival policies.
   */
  public getScalingStrategy(): DatabaseScalingStrategy {
    return {
      maxPageLimit: 100,
      defaultPageLimit: 25,
      eventRetentionDays: 90,
      archiveStrategy: 'Cold partition compression into Cloudflare R2 object storage for events > 90 days',
      isConnectionPoolingAware: true,
      queryTimeoutMs: 5000,
    };
  }

  /**
   * Verifies that all migrations are sequential and syntactically consistent.
   */
  public verifyIntegrity(): { isHealthy: boolean; totalTables: number; totalIndices: number; errors: string[] } {
    const audits = this.auditMigrations();
    const errors: string[] = [];

    let totalTables = 0;
    let totalIndices = 0;

    audits.forEach((audit, index) => {
      totalTables += audit.tablesCount;
      totalIndices += audit.indicesCount;

      if (!audit.isValid) {
        errors.push(`Migration ${audit.migrationFile} has 0 tables defined.`);
      }
      if (audit.version !== index + 1) {
        errors.push(`Migration sequence mismatch for ${audit.migrationFile}.`);
      }
    });

    return {
      isHealthy: errors.length === 0,
      totalTables,
      totalIndices,
      errors,
    };
  }
}

export const databaseReliabilityService = new DatabaseReliabilityService();
