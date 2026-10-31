-- ==============================================================================
-- AI SATELLITE — PHASE 21 D1 DATABASE MIGRATION
-- Migration: 0007_blog_hub_schema.sql
-- Description: D1 SQLite Schema for Premium Blog Hub, Verified Service Catalogue,
--              Contextual CTAs, Quality Gates, and Consent-Based Newsletter.
-- Canonical Production Domain: https://aisatellite.dev
-- ==============================================================================

-- 1. Editorial Categories
CREATE TABLE IF NOT EXISTS blog_categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  article_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 2. Verified Authors
CREATE TABLE IF NOT EXISTS blog_authors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar_url TEXT,
  credentials TEXT, -- JSON array
  social_links TEXT, -- JSON object
  verified_expert INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 3. Articles Content Model
CREATE TABLE IF NOT EXISTS blog_articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  primary_category TEXT NOT NULL,
  secondary_categories TEXT, -- JSON array
  tags TEXT, -- JSON array
  author_id TEXT NOT NULL REFERENCES blog_authors(id),
  published_at TEXT NOT NULL,
  updated_at TEXT,
  scheduled_at TEXT,
  reading_time TEXT NOT NULL,
  review_status TEXT NOT NULL DEFAULT 'Published',
  editorially_reviewed INTEGER DEFAULT 1,
  target_audience TEXT, -- JSON array
  jurisdiction TEXT DEFAULT 'Global',
  search_intent TEXT DEFAULT 'informational',
  content_body TEXT NOT NULL,
  summary TEXT,
  quick_answer TEXT,
  key_takeaways TEXT, -- JSON array
  practical_steps TEXT, -- JSON array
  checklist TEXT, -- JSON array
  common_mistakes TEXT, -- JSON array
  source_references TEXT, -- JSON array
  related_tools TEXT, -- JSON array
  related_articles TEXT, -- JSON array
  cta_placements TEXT, -- JSON array
  canonical_url TEXT NOT NULL,
  indexable INTEGER DEFAULT 1,
  featured INTEGER DEFAULT 0,
  published INTEGER DEFAULT 1,
  series_id TEXT,
  series_name TEXT,
  series_order INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_cat ON blog_articles(primary_category);
CREATE INDEX IF NOT EXISTS idx_blog_articles_published ON blog_articles(published, published_at);

-- 4. Verified Commercial Service Catalogue
CREATE TABLE IF NOT EXISTS blog_service_catalogue (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  relevant_problems TEXT NOT NULL, -- JSON array
  target_audience TEXT NOT NULL, -- JSON array
  jurisdiction TEXT NOT NULL, -- JSON array
  official_url TEXT NOT NULL,
  offer_information TEXT,
  eligibility_notes TEXT,
  last_verified_date TEXT NOT NULL,
  active INTEGER DEFAULT 1,
  editorially_approved INTEGER DEFAULT 1,
  badge TEXT NOT NULL,
  accent_color TEXT DEFAULT 'cyan',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 5. Contextual CTA Telemetry & Click Analytics
CREATE TABLE IF NOT EXISTS blog_cta_analytics (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  cta_id TEXT NOT NULL,
  destination_url TEXT NOT NULL,
  placement_type TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'impression' | 'click'
  timestamp TEXT NOT NULL,
  referrer TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blog_cta_art ON blog_cta_analytics(article_id);
CREATE INDEX IF NOT EXISTS idx_blog_cta_ts ON blog_cta_analytics(timestamp);

-- 6. Consent-Based Newsletter Subscribers
CREATE TABLE IF NOT EXISTS blog_newsletter_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  consent_given INTEGER NOT NULL,
  privacy_policy_accepted INTEGER NOT NULL,
  subscribed_at TEXT NOT NULL,
  topic_preferences TEXT, -- JSON array
  unsubscribe_token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active', -- 'active' | 'unsubscribed'
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 7. Editorial Quality Gate Records
CREATE TABLE IF NOT EXISTS blog_quality_gates (
  article_id TEXT PRIMARY KEY REFERENCES blog_articles(id),
  passed INTEGER NOT NULL,
  original_usefulness_score INTEGER NOT NULL,
  factual_correctness_score INTEGER NOT NULL,
  source_quality_score INTEGER NOT NULL,
  disclosure_compliance INTEGER NOT NULL,
  duplicate_risk TEXT NOT NULL,
  reviewer_notes TEXT,
  reviewed_at TEXT NOT NULL,
  reviewed_by TEXT NOT NULL
);
