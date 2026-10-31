-- ==============================================================================
-- AI SATELLITE — PHASE 19: UNIFIED ECOSYSTEM & COMMAND CENTER MIGRATION
-- Migration: 0006_unified_ecosystem.sql
-- Target Database: Cloudflare D1 (SQLite Engine)
-- Canonical Production Domain: https://aisatellite.dev
-- ==============================================================================

-- 1. Central Resource Identity System (CRIS)
CREATE TABLE IF NOT EXISTS central_resources (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  official_url TEXT NOT NULL,
  repository_url TEXT,
  license TEXT,
  pricing TEXT,
  capabilities TEXT NOT NULL DEFAULT '[]',
  categories TEXT NOT NULL DEFAULT '[]',
  verification_status TEXT NOT NULL DEFAULT 'in_review',
  editorial_status TEXT NOT NULL DEFAULT 'draft',
  verified_at TEXT,
  last_reviewed_at TEXT NOT NULL,
  metadata TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_central_resources_slug ON central_resources(slug);
CREATE INDEX IF NOT EXISTS idx_central_resources_type ON central_resources(type);
CREATE INDEX IF NOT EXISTS idx_central_resources_verification ON central_resources(verification_status);
CREATE INDEX IF NOT EXISTS idx_central_resources_editorial ON central_resources(editorial_status);

-- 2. Unified Knowledge Graph Edges
CREATE TABLE IF NOT EXISTS knowledge_graph_edges (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  relationship TEXT NOT NULL,
  confidence REAL NOT NULL DEFAULT 1.0,
  verified INTEGER NOT NULL DEFAULT 1,
  evidence_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (source_id) REFERENCES central_resources(id) ON DELETE CASCADE,
  FOREIGN KEY (target_id) REFERENCES central_resources(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_knowledge_edges_source ON knowledge_graph_edges(source_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_edges_target ON knowledge_graph_edges(target_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_edges_rel ON knowledge_graph_edges(relationship);

-- 3. Platform Event Bus Ledger
CREATE TABLE IF NOT EXISTS platform_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload TEXT NOT NULL DEFAULT '{}',
  emitter TEXT NOT NULL,
  trace_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_platform_events_type ON platform_events(event_type);
CREATE INDEX IF NOT EXISTS idx_platform_events_trace ON platform_events(trace_id);

-- 4. Unified Notifications System
CREATE TABLE IF NOT EXISTS unified_notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read INTEGER NOT NULL DEFAULT 0,
  action_url TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_unified_notifs_user ON unified_notifications(user_id, read);

-- 5. Autonomous Multi-Agent Executions
CREATE TABLE IF NOT EXISTS agent_executions (
  id TEXT PRIMARY KEY,
  agent TEXT NOT NULL,
  status TEXT NOT NULL,
  output TEXT,
  findings TEXT NOT NULL DEFAULT '[]',
  cost_estimate_usd REAL NOT NULL DEFAULT 0.0,
  duration_ms INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_agent_executions_agent ON agent_executions(agent, status);
