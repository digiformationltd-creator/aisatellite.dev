-- =============================================================================
-- AI SATELLITE — PHASE 14: AUTONOMOUS GLOBAL TECHNOLOGY DISCOVERY SCHEMA
-- Migration: 0003_discovery_intelligence_schema.sql
-- Target: Cloudflare D1 (SQLite Dialect)
-- Canonical Domain: https://aisatellite.dev
-- =============================================================================

-- 1. Discovery Technology Sources
CREATE TABLE IF NOT EXISTS discovery_sources (
    id TEXT PRIMARY KEY,
    source_url TEXT NOT NULL UNIQUE,
    source_type TEXT NOT NULL,
    organization TEXT NOT NULL,
    access_method TEXT NOT NULL DEFAULT 'rest_api',
    verification_level TEXT NOT NULL DEFAULT 'authoritative',
    crawl_permissions_allowed INTEGER NOT NULL DEFAULT 1,
    rate_limit_per_minute INTEGER NOT NULL DEFAULT 30,
    last_successful_retrieval TEXT,
    last_verification TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sources_status ON discovery_sources(status);
CREATE INDEX IF NOT EXISTS idx_sources_type ON discovery_sources(source_type);

-- 2. Autonomous Discovery Jobs
CREATE TABLE IF NOT EXISTS discovery_jobs (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    schedule_cron TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled',
    timeout_ms INTEGER NOT NULL DEFAULT 15000,
    retry_limit INTEGER NOT NULL DEFAULT 3,
    current_retries INTEGER NOT NULL DEFAULT 0,
    concurrency_limit INTEGER NOT NULL DEFAULT 2,
    cost_budget_usd REAL NOT NULL DEFAULT 5.0,
    last_run_at TEXT,
    next_run_at TEXT,
    last_run_duration_ms INTEGER,
    failure_reason TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_jobs_category ON discovery_jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON discovery_jobs(status);

-- 3. GitHub Intelligence Records
CREATE TABLE IF NOT EXISTS discovery_github_records (
    id TEXT PRIMARY KEY,
    repo_url TEXT NOT NULL UNIQUE,
    owner TEXT NOT NULL,
    repo_name TEXT NOT NULL,
    description TEXT NOT NULL,
    license TEXT NOT NULL,
    is_osi_license INTEGER NOT NULL DEFAULT 0,
    latest_release_tag TEXT,
    latest_release_date TEXT,
    is_archived INTEGER NOT NULL DEFAULT 0,
    supported_languages TEXT NOT NULL, -- JSON array
    has_documentation INTEGER NOT NULL DEFAULT 1,
    documentation_url TEXT,
    open_issue_count INTEGER NOT NULL DEFAULT 0,
    security_advisories_count INTEGER NOT NULL DEFAULT 0,
    install_instructions TEXT,
    last_checked_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_github_osi ON discovery_github_records(is_osi_license);
CREATE INDEX IF NOT EXISTS idx_github_archived ON discovery_github_records(is_archived);

-- 4. AI Tool Profiles
CREATE TABLE IF NOT EXISTS discovery_ai_tool_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    website_url TEXT NOT NULL,
    developer_org TEXT NOT NULL,
    primary_purpose TEXT NOT NULL,
    capabilities TEXT NOT NULL, -- JSON array
    pricing_model TEXT NOT NULL,
    free_tier_conditions TEXT NOT NULL,
    api_available INTEGER NOT NULL DEFAULT 0,
    supported_platforms TEXT NOT NULL, -- JSON array
    documentation_url TEXT NOT NULL,
    confidence TEXT NOT NULL DEFAULT 'high',
    last_verified_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ai_tools_slug ON discovery_ai_tool_profiles(slug);
CREATE INDEX IF NOT EXISTS idx_ai_tools_pricing ON discovery_ai_tool_profiles(pricing_model);

-- 5. Free Alternative Findings
CREATE TABLE IF NOT EXISTS discovery_free_alternatives (
    id TEXT PRIMARY KEY,
    paid_tool_name TEXT NOT NULL,
    alternative_name TEXT NOT NULL,
    alternative_url TEXT NOT NULL,
    license TEXT NOT NULL,
    classification TEXT NOT NULL,
    capability_overlap TEXT NOT NULL, -- JSON array
    deployment_options TEXT NOT NULL, -- JSON array
    limitations TEXT NOT NULL, -- JSON array
    infrastructure_cost_estimated TEXT NOT NULL,
    evidence_urls TEXT NOT NULL, -- JSON array
    editorial_proposal_id TEXT,
    verified_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_alternatives_paid_tool ON discovery_free_alternatives(paid_tool_name);
CREATE INDEX IF NOT EXISTS idx_alternatives_classification ON discovery_free_alternatives(classification);

-- 6. Technology Change Events
CREATE TABLE IF NOT EXISTS discovery_change_events (
    id TEXT PRIMARY KEY,
    resource_id TEXT NOT NULL,
    resource_name TEXT NOT NULL,
    change_type TEXT NOT NULL,
    previous_value TEXT NOT NULL,
    new_value TEXT NOT NULL,
    evidence_url TEXT NOT NULL,
    detection_timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    verification_status TEXT NOT NULL DEFAULT 'verified',
    affected_resource_urls TEXT NOT NULL, -- JSON array
    proposed_action TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_change_events_type ON discovery_change_events(change_type);
CREATE INDEX IF NOT EXISTS idx_change_events_status ON discovery_change_events(verification_status);

-- 7. Evidence & Multi-Source Verification Records
CREATE TABLE IF NOT EXISTS discovery_evidence_records (
    id TEXT PRIMARY KEY,
    claim_id TEXT NOT NULL,
    source_url TEXT NOT NULL,
    source_title TEXT NOT NULL,
    source_type TEXT NOT NULL,
    retrieval_timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    verification_timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    claim_supported TEXT NOT NULL,
    relevant_excerpt TEXT NOT NULL,
    confidence TEXT NOT NULL DEFAULT 'high',
    is_authoritative INTEGER NOT NULL DEFAULT 1,
    review_status TEXT NOT NULL DEFAULT 'approved'
);

CREATE INDEX IF NOT EXISTS idx_evidence_claim ON discovery_evidence_records(claim_id);
CREATE INDEX IF NOT EXISTS idx_evidence_authoritative ON discovery_evidence_records(is_authoritative);

-- 8. Knowledge Graph Nodes
CREATE TABLE IF NOT EXISTS discovery_knowledge_nodes (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    attributes TEXT NOT NULL DEFAULT '{}' -- JSON object
);

CREATE INDEX IF NOT EXISTS idx_nodes_slug_type ON discovery_knowledge_nodes(slug, type);

-- 9. Knowledge Graph Edges
CREATE TABLE IF NOT EXISTS discovery_knowledge_edges (
    id TEXT PRIMARY KEY,
    source_node_id TEXT NOT NULL REFERENCES discovery_knowledge_nodes(id) ON DELETE CASCADE,
    target_node_id TEXT NOT NULL REFERENCES discovery_knowledge_nodes(id) ON DELETE CASCADE,
    relationship TEXT NOT NULL,
    confidence REAL NOT NULL DEFAULT 1.0,
    evidence_id TEXT REFERENCES discovery_evidence_records(id)
);

CREATE INDEX IF NOT EXISTS idx_edges_source ON discovery_knowledge_edges(source_node_id);
CREATE INDEX IF NOT EXISTS idx_edges_target ON discovery_knowledge_edges(target_node_id);
CREATE INDEX IF NOT EXISTS idx_edges_rel ON discovery_knowledge_edges(relationship);

-- 10. Editorial Proposals
CREATE TABLE IF NOT EXISTS discovery_editorial_proposals (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    proposal_type TEXT NOT NULL,
    research_evidence_ids TEXT NOT NULL, -- JSON array
    target_audience TEXT NOT NULL,
    search_intent TEXT NOT NULL,
    unique_value TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_review',
    proposed_by_agent TEXT NOT NULL,
    reviewed_by TEXT,
    review_notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_proposals_status ON discovery_editorial_proposals(status);

-- 11. Radar Telemetry
CREATE TABLE IF NOT EXISTS discovery_radar_telemetry (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_slug TEXT NOT NULL,
    summary TEXT NOT NULL,
    license TEXT NOT NULL,
    pricing_classification TEXT NOT NULL,
    is_trending INTEGER NOT NULL DEFAULT 0,
    replaces TEXT, -- JSON array
    radius_distance REAL NOT NULL,
    theta_degrees REAL NOT NULL,
    quadrant TEXT NOT NULL,
    verified_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_radar_quadrant ON discovery_radar_telemetry(quadrant);

-- 12. Cost Records
CREATE TABLE IF NOT EXISTS discovery_cost_records (
    id TEXT PRIMARY KEY,
    job_id TEXT REFERENCES discovery_jobs(id),
    operation_type TEXT NOT NULL,
    cost_usd REAL NOT NULL,
    token_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_costs_job ON discovery_cost_records(job_id);

-- 13. Security Logs
CREATE TABLE IF NOT EXISTS discovery_security_logs (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL, -- ssrf_block, prompt_injection_redaction, rate_limit_hit
    target_value TEXT NOT NULL,
    details TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sec_event ON discovery_security_logs(event_type);

-- 14. Discovery Audit Trail
CREATE TABLE IF NOT EXISTS discovery_audit_trail (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    actor TEXT NOT NULL,
    metadata TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON discovery_audit_trail(entity_type, entity_id);
