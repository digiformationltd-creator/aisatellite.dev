# AI SATELLITE — UNIFIED DATA ARCHITECTURE
## CLOUDFLARE D1 (SQLITE ENGINE) & CRIS ENTITY SCHEMAS

**Permanent Canonical Domain:** `https://aisatellite.dev`  
**Primary Database Engine:** Cloudflare D1 (Distributed SQLite)  
**Total Sequential Migrations:** 6 (Validated & Atomic)

---

### MIGRATION REGISTRY

1. **`0001_workspace_schema.sql` (Phase 12):**
   - Tables: `users`, `sessions`, `workspace_items`, `prompt_vault`, `snippet_vault`, `projects`, `learning_paths`.
   - Indexing: `idx_sessions_token`, `idx_workspace_user_created`.
2. **`0002_community_schema.sql` (Phase 13):**
   - Tables: `developer_profiles`, `community_discussions`, `discussion_answers`, `collaborative_collections`, `moderation_reports`.
   - Indexing: `idx_discussions_category`, `idx_answers_parent`.
3. **`0003_discovery_intelligence_schema.sql` (Phase 14):**
   - Tables: `discovery_sources`, `discovery_jobs`, `evidence_records`, `editorial_proposals`, `radar_blips`.
   - Indexing: `idx_evidence_source_hash`, `idx_proposals_status`.
4. **`0004_growth_authority_schema.sql` (Phase 15):**
   - Tables: `growth_analytics_events`, `newsletter_subscribers`, `campaign_distributions`, `seo_audit_findings`.
   - Indexing: `idx_subscribers_hash`, `idx_analytics_event_date`.
5. **`0005_production_reliability_schema.sql` (Phase 16):**
   - Tables: `reliability_incidents`, `failure_points`, `sli_measurements`, `disaster_recovery_runbooks`.
   - Indexing: `idx_sli_metric_timestamp`, `idx_incidents_severity`.
6. **`0006_unified_ecosystem.sql` (Phase 19):**
   - Tables: `central_resources` (CRIS), `knowledge_graph_edges`, `platform_events`, `unified_notifications`, `agent_executions`.
   - Indexing: `idx_central_resources_slug`, `idx_knowledge_edges_rel`, `idx_platform_events_type`.

---

### CENTRAL RESOURCE IDENTITY SYSTEM (CRIS) SCHEMA

```sql
CREATE TABLE IF NOT EXISTS central_resources (
  id TEXT PRIMARY KEY,                       -- Deterministic: res_<slug>
  slug TEXT NOT NULL UNIQUE,                -- Canonical public URL slug
  name TEXT NOT NULL,                       -- Display title
  type TEXT NOT NULL,                       -- software_product, open_source_project, etc.
  official_url TEXT NOT NULL,               -- Verified homepage
  repository_url TEXT,                      -- GitHub / GitLab repo
  license TEXT,                             -- SPDX identifier (MIT, Apache-2.0)
  pricing TEXT,                             -- Free, Freemium, Commercial
  capabilities TEXT NOT NULL DEFAULT '[]',  -- JSON array of capabilities
  categories TEXT NOT NULL DEFAULT '[]',    -- JSON array of taxonomy categories
  verification_status TEXT NOT NULL,        -- verified, community_submitted, archived
  editorial_status TEXT NOT NULL,           -- draft, ready_for_review, published
  verified_at TEXT,                         -- ISO 8601 timestamp
  last_reviewed_at TEXT NOT NULL,           -- ISO 8601 timestamp
  metadata TEXT NOT NULL DEFAULT '{}',      -- Extensible JSON metadata
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

### UNIFIED KNOWLEDGE GRAPH SCHEMA

```sql
CREATE TABLE IF NOT EXISTS knowledge_graph_edges (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,                  -- Foreign key -> central_resources(id)
  target_id TEXT NOT NULL,                  -- Foreign key -> central_resources(id)
  relationship TEXT NOT NULL,               -- alternative_to, replaces, implements
  confidence REAL NOT NULL DEFAULT 1.0,     -- Score between 0.0 and 1.0
  verified INTEGER NOT NULL DEFAULT 1,      -- 1 = Human/Agent Verified, 0 = Candidate
  evidence_id TEXT,                         -- Foreign key -> evidence_records(id)
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (source_id) REFERENCES central_resources(id) ON DELETE CASCADE,
  FOREIGN KEY (target_id) REFERENCES central_resources(id) ON DELETE CASCADE
);
```
