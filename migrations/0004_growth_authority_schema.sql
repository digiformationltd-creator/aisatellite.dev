-- =============================================================================
-- AI SATELLITE — PHASE 15: GLOBAL SEARCH AUTHORITY & ADOPTION SCHEMA
-- Migration: 0004_growth_authority_schema.sql
-- Target: Cloudflare D1 (SQLite Dialect)
-- Canonical Domain: https://aisatellite.dev
-- =============================================================================

-- 1. Technical SEO Findings
CREATE TABLE IF NOT EXISTS growth_seo_findings (
    id TEXT PRIMARY KEY,
    affected_url TEXT NOT NULL,
    category TEXT NOT NULL,
    severity TEXT NOT NULL,
    evidence TEXT NOT NULL,
    recommended_fix TEXT NOT NULL,
    responsible_module TEXT NOT NULL,
    verification_procedure TEXT NOT NULL,
    detected_at TEXT NOT NULL DEFAULT (datetime('now')),
    resolved_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_seo_findings_url ON growth_seo_findings(affected_url);
CREATE INDEX IF NOT EXISTS idx_seo_findings_sev ON growth_seo_findings(severity);

-- 2. Search Console Status
CREATE TABLE IF NOT EXISTS growth_search_console_status (
    service TEXT PRIMARY KEY,
    is_connected INTEGER NOT NULL DEFAULT 0,
    is_configured INTEGER NOT NULL DEFAULT 0,
    status_message TEXT NOT NULL,
    reporting_period TEXT,
    total_clicks INTEGER NOT NULL DEFAULT 0,
    total_impressions INTEGER NOT NULL DEFAULT 0,
    average_ctr REAL NOT NULL DEFAULT 0.0,
    average_position REAL NOT NULL DEFAULT 0.0,
    top_queries TEXT, -- JSON array
    top_landing_pages TEXT, -- JSON array
    country_breakdown TEXT, -- JSON array
    crawl_issues_count INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 3. Topical Authority Clusters
CREATE TABLE IF NOT EXISTS growth_authority_clusters (
    id TEXT PRIMARY KEY,
    pillar_title TEXT NOT NULL,
    pillar_slug TEXT NOT NULL UNIQUE,
    topic_family TEXT NOT NULL,
    target_search_intent TEXT NOT NULL,
    supporting_resources TEXT NOT NULL, -- JSON array
    internal_link_depth_max INTEGER NOT NULL DEFAULT 2,
    coverage_score INTEGER NOT NULL DEFAULT 0,
    freshness_status TEXT NOT NULL DEFAULT 'fresh',
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_clusters_family ON growth_authority_clusters(topic_family);

-- 4. Content Gap Proposals
CREATE TABLE IF NOT EXISTS growth_content_gap_proposals (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    topic_family TEXT NOT NULL,
    search_intent TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    identified_via TEXT NOT NULL,
    unmet_need_explanation TEXT NOT NULL,
    evidence_requirement TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'proposed',
    proposed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_gaps_status ON growth_content_gap_proposals(status);

-- 5. Original Research Studies
CREATE TABLE IF NOT EXISTS growth_original_research (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    format TEXT NOT NULL,
    methodology TEXT NOT NULL,
    source_references TEXT NOT NULL, -- JSON array
    transparent_limitations TEXT NOT NULL, -- JSON array
    measured_results TEXT NOT NULL, -- JSON object
    software_versions_tested TEXT NOT NULL, -- JSON object
    publication_date TEXT NOT NULL DEFAULT (datetime('now')),
    last_correction_date TEXT,
    peer_review_status TEXT NOT NULL DEFAULT 'published',
    author TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_research_slug ON growth_original_research(slug);

-- 6. Referring Domains
CREATE TABLE IF NOT EXISTS growth_referring_domains (
    id TEXT PRIMARY KEY,
    referring_domain TEXT NOT NULL,
    referring_url TEXT NOT NULL UNIQUE,
    target_url TEXT NOT NULL,
    citation_context TEXT NOT NULL,
    citation_type TEXT NOT NULL,
    is_observed INTEGER NOT NULL DEFAULT 1,
    anchor_text TEXT,
    discovered_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_referring_domain ON growth_referring_domains(referring_domain);

-- 7. GitHub Adoption Metrics
CREATE TABLE IF NOT EXISTS growth_github_adoption_metrics (
    repository TEXT PRIMARY KEY,
    stars INTEGER NOT NULL DEFAULT 0,
    forks INTEGER NOT NULL DEFAULT 0,
    open_issues INTEGER NOT NULL DEFAULT 0,
    closed_issues INTEGER NOT NULL DEFAULT 0,
    open_pull_requests INTEGER NOT NULL DEFAULT 0,
    merged_pull_requests INTEGER NOT NULL DEFAULT 0,
    total_contributors INTEGER NOT NULL DEFAULT 0,
    latest_release_tag TEXT NOT NULL,
    latest_release_date TEXT NOT NULL,
    reporting_window TEXT NOT NULL,
    is_api_configured INTEGER NOT NULL DEFAULT 1,
    traffic_views_weekly INTEGER,
    unique_clones_weekly INTEGER,
    measured_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 8. AEO Quality Evaluations
CREATE TABLE IF NOT EXISTS growth_aeo_evaluations (
    page_url TEXT PRIMARY KEY,
    has_direct_answer_definition INTEGER NOT NULL DEFAULT 0,
    has_structured_troubleshooting INTEGER NOT NULL DEFAULT 0,
    has_verified_code_example INTEGER NOT NULL DEFAULT 0,
    has_explicit_limitations INTEGER NOT NULL DEFAULT 0,
    schema_types_present TEXT NOT NULL, -- JSON array
    question_framing_score INTEGER NOT NULL DEFAULT 0,
    overall_aeo_score INTEGER NOT NULL DEFAULT 0,
    recommendations TEXT NOT NULL, -- JSON array
    evaluated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 9. GEO Visibility Evaluations
CREATE TABLE IF NOT EXISTS growth_geo_evaluations (
    entity_name TEXT PRIMARY KEY,
    entity_type TEXT NOT NULL,
    stable_description TEXT NOT NULL,
    accurate_relationships TEXT NOT NULL, -- JSON array
    authoritative_sources_cited TEXT NOT NULL, -- JSON array
    visible_verification_date TEXT NOT NULL,
    is_grounded_without_fabrication INTEGER NOT NULL DEFAULT 1,
    geo_clarity_score INTEGER NOT NULL DEFAULT 0,
    evaluated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 10. User Conversion Events
CREATE TABLE IF NOT EXISTS growth_conversion_events (
    id TEXT PRIMARY KEY,
    action_type TEXT NOT NULL,
    resource_slug TEXT,
    category_slug TEXT,
    referrer_source TEXT,
    has_user_consent INTEGER NOT NULL DEFAULT 1,
    respects_dnt INTEGER NOT NULL DEFAULT 1,
    timestamp TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_conversions_type ON growth_conversion_events(action_type);
CREATE INDEX IF NOT EXISTS idx_conversions_time ON growth_conversion_events(timestamp);

-- 11. Growth Experiments
CREATE TABLE IF NOT EXISTS growth_experiments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    hypothesis TEXT NOT NULL,
    target_metric TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'running',
    start_date TEXT NOT NULL DEFAULT (datetime('now')),
    end_date TEXT,
    minimum_sample_size INTEGER NOT NULL DEFAULT 200,
    current_sample_size INTEGER NOT NULL DEFAULT 0,
    winner_variant_id TEXT,
    confidence_percentage REAL
);

-- 12. Experiment Variants
CREATE TABLE IF NOT EXISTS growth_experiment_variants (
    id TEXT PRIMARY KEY,
    experiment_id TEXT NOT NULL REFERENCES growth_experiments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    weight_percent INTEGER NOT NULL DEFAULT 50,
    impressions INTEGER NOT NULL DEFAULT 0,
    conversions INTEGER NOT NULL DEFAULT 0
);

-- 13. Automation Schedule Configurations
CREATE TABLE IF NOT EXISTS growth_automation_schedule (
    frequency TEXT PRIMARY KEY, -- 'daily', 'weekly', 'monthly'
    tasks TEXT NOT NULL, -- JSON array of task names
    last_run_at TEXT,
    next_run_at TEXT,
    status TEXT NOT NULL DEFAULT 'active'
);

-- 14. Growth Audit Trail
CREATE TABLE IF NOT EXISTS growth_audit_trail (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    actor TEXT NOT NULL,
    details TEXT,
    timestamp TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_growth_audit_actor ON growth_audit_trail(actor);
