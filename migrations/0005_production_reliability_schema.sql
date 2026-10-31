-- ==============================================================================
-- AI SATELLITE — PHASE 16: PRODUCTION RELIABILITY & SCALE SCHEMA
-- Cloudflare D1 Relational Migration (Migration 0005)
-- Production Domain: https://aisatellite.dev
-- ==============================================================================

-- 1. Service Level Indicators & Objectives Tracking
CREATE TABLE IF NOT EXISTS reliability_slo_metrics (
  id TEXT PRIMARY KEY,
  sli_name TEXT NOT NULL,
  target_value REAL NOT NULL,
  observed_value REAL NOT NULL,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  status TEXT CHECK (status IN ('COMPLIANT', 'AT_RISK', 'BREACHED')) NOT NULL DEFAULT 'COMPLIANT',
  error_budget_remaining REAL NOT NULL DEFAULT 100.0,
  recorded_at TEXT NOT NULL DEFAULT (DATETIME('now'))
);
CREATE INDEX IF NOT EXISTS idx_slo_name_recorded ON reliability_slo_metrics(sli_name, recorded_at);

-- 2. Reliability Incidents
CREATE TABLE IF NOT EXISTS reliability_incidents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('P1-CRITICAL', 'P2-HIGH', 'P3-MEDIUM', 'P4-LOW')) NOT NULL,
  category TEXT CHECK (category IN ('DATABASE', 'EDGE_CDN', 'AUTH', 'SEARCH', 'BACKGROUND_JOBS', 'DEPLOYMENT', 'SECURITY', 'THIRD_PARTY')) NOT NULL,
  status TEXT CHECK (status IN ('DETECTED', 'INVESTIGATING', 'MITIGATED', 'RESOLVED', 'POST_MORTEM')) NOT NULL DEFAULT 'DETECTED',
  impact_summary TEXT NOT NULL,
  detected_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  mitigated_at TEXT,
  resolved_at TEXT,
  root_cause TEXT,
  action_items TEXT -- JSON array of remediation tasks
);
CREATE INDEX IF NOT EXISTS idx_incidents_severity_status ON reliability_incidents(severity, status);
CREATE INDEX IF NOT EXISTS idx_incidents_detected_at ON reliability_incidents(detected_at);

-- 3. Operational Alerts & Deduplication
CREATE TABLE IF NOT EXISTS reliability_alerts (
  id TEXT PRIMARY KEY,
  incident_id TEXT REFERENCES reliability_incidents(id) ON DELETE SET NULL,
  fingerprint TEXT NOT NULL, -- SHA-256 hash of (component + error_type) for deduplication
  severity TEXT CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')) NOT NULL,
  summary TEXT NOT NULL,
  source_component TEXT NOT NULL,
  status TEXT CHECK (status IN ('FIRING', 'ACKNOWLEDGED', 'RESOLVED', 'SUPPRESSED')) NOT NULL DEFAULT 'FIRING',
  first_seen_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  last_seen_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  occurrences INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_alerts_fingerprint ON reliability_alerts(fingerprint);
CREATE INDEX IF NOT EXISTS idx_alerts_status_severity ON reliability_alerts(status, severity);

-- 4. Backup Catalog
CREATE TABLE IF NOT EXISTS reliability_backups (
  id TEXT PRIMARY KEY,
  target_component TEXT NOT NULL, -- e.g., 'd1-relational', 'workspace-store', 'research-evidence'
  backup_type TEXT CHECK (backup_type IN ('FULL', 'INCREMENTAL', 'SNAPSHOT')) NOT NULL DEFAULT 'SNAPSHOT',
  storage_location TEXT NOT NULL,
  checksum_sha256 TEXT NOT NULL,
  byte_size INTEGER NOT NULL,
  retention_days INTEGER NOT NULL DEFAULT 30,
  status TEXT CHECK (status IN ('PENDING', 'COMPLETED', 'VERIFIED', 'FAILED', 'EXPIRED')) NOT NULL DEFAULT 'COMPLETED',
  created_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_backups_component_status ON reliability_backups(target_component, status);

-- 5. Backup Restorations & Sandbox Validation
CREATE TABLE IF NOT EXISTS reliability_backup_restorations (
  id TEXT PRIMARY KEY,
  backup_id TEXT NOT NULL REFERENCES reliability_backups(id) ON DELETE CASCADE,
  target_environment TEXT NOT NULL DEFAULT 'sandbox-validation',
  duration_ms INTEGER NOT NULL,
  records_verified INTEGER NOT NULL,
  status TEXT CHECK (status IN ('SUCCESS', 'CORRUPTED', 'FAILED')) NOT NULL,
  initiated_by TEXT NOT NULL,
  executed_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  verified_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_restorations_backup ON reliability_backup_restorations(backup_id);

-- 6. Background Jobs & Idempotency
CREATE TABLE IF NOT EXISTS reliability_background_jobs (
  id TEXT PRIMARY KEY,
  job_type TEXT NOT NULL,
  idempotency_key TEXT UNIQUE NOT NULL,
  payload_hash TEXT NOT NULL,
  status TEXT CHECK (status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'DEAD_LETTER')) NOT NULL DEFAULT 'PENDING',
  attempt_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  scheduled_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  started_at TEXT,
  completed_at TEXT,
  error_message TEXT
);
CREATE INDEX IF NOT EXISTS idx_jobs_idempotency ON reliability_background_jobs(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_jobs_status_scheduled ON reliability_background_jobs(status, scheduled_at);

-- 7. Dead Letter Queue
CREATE TABLE IF NOT EXISTS reliability_dead_letter_queue (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES reliability_background_jobs(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL,
  failure_reason TEXT NOT NULL,
  payload TEXT NOT NULL, -- JSON string
  retry_count INTEGER NOT NULL,
  first_failed_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  last_failed_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  replayed INTEGER NOT NULL DEFAULT 0,
  replayed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_dlq_job_type ON reliability_dead_letter_queue(job_type, replayed);

-- 8. Deployment Registry & Validation Gates
CREATE TABLE IF NOT EXISTS reliability_deployments (
  id TEXT PRIMARY KEY,
  commit_sha TEXT NOT NULL,
  environment TEXT NOT NULL DEFAULT 'production',
  branch TEXT NOT NULL DEFAULT 'master',
  migration_version INTEGER NOT NULL DEFAULT 5,
  build_duration_ms INTEGER NOT NULL,
  status TEXT CHECK (status IN ('PENDING', 'VALIDATED', 'DEPLOYED', 'ROLLED_BACK', 'FAILED')) NOT NULL DEFAULT 'DEPLOYED',
  deployed_by TEXT NOT NULL,
  verified_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  created_at TEXT NOT NULL DEFAULT (DATETIME('now'))
);
CREATE INDEX IF NOT EXISTS idx_deployments_commit ON reliability_deployments(commit_sha);

-- 9. Rollback History & Migration Compatibility
CREATE TABLE IF NOT EXISTS reliability_rollback_history (
  id TEXT PRIMARY KEY,
  deployment_id TEXT NOT NULL REFERENCES reliability_deployments(id) ON DELETE CASCADE,
  target_commit_sha TEXT NOT NULL,
  reason TEXT NOT NULL,
  migration_compatible INTEGER NOT NULL DEFAULT 1,
  status TEXT CHECK (status IN ('SUCCESS', 'ABORTED_MIGRATION_CONFLICT', 'FAILED')) NOT NULL,
  executed_by TEXT NOT NULL,
  executed_at TEXT NOT NULL DEFAULT (DATETIME('now')),
  verified_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rollback_deployment ON reliability_rollback_history(deployment_id);

-- 10. Service Quotas & Budget Records
CREATE TABLE IF NOT EXISTS reliability_quota_records (
  id TEXT PRIMARY KEY,
  service_name TEXT NOT NULL, -- e.g., 'cloudflare-workers', 'cloudflare-d1', 'cloudflare-r2', 'ai-tokens'
  quota_period TEXT NOT NULL, -- e.g., '2026-10'
  current_usage REAL NOT NULL DEFAULT 0,
  limit_ceiling REAL NOT NULL,
  unit TEXT NOT NULL, -- 'requests', 'read_ops', 'write_ops', 'gb_storage', 'tokens'
  status TEXT CHECK (status IN ('NORMAL', 'WARNING_80', 'CRITICAL_90', 'EXCEEDED')) NOT NULL DEFAULT 'NORMAL',
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_quota_service_period ON reliability_quota_records(service_name, quota_period);

-- 11. Security & Operational Audit Logs
CREATE TABLE IF NOT EXISTS reliability_audit_logs (
  id TEXT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  metadata TEXT, -- JSON structured context
  ip_hash TEXT NOT NULL, -- Anonymized one-way hash (zero PII)
  created_at TEXT NOT NULL DEFAULT (DATETIME('now'))
);
CREATE INDEX IF NOT EXISTS idx_audit_actor_created ON reliability_audit_logs(actor, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_action ON reliability_audit_logs(action);

-- 12. Controlled Load & Capacity Benchmarks
CREATE TABLE IF NOT EXISTS reliability_load_benchmarks (
  id TEXT PRIMARY KEY,
  scenario_name TEXT NOT NULL,
  virtual_users INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL,
  total_requests INTEGER NOT NULL,
  rps REAL NOT NULL,
  p50_ms REAL NOT NULL,
  p95_ms REAL NOT NULL,
  p99_ms REAL NOT NULL,
  error_rate REAL NOT NULL,
  bottleneck_detected TEXT,
  tested_at TEXT NOT NULL DEFAULT (DATETIME('now'))
);
CREATE INDEX IF NOT EXISTS idx_benchmarks_scenario ON reliability_load_benchmarks(scenario_name, tested_at);
