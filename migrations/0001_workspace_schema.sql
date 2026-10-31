-- AI Satellite — Phase 12 D1 Relational Schema Migration
-- Migration: 0001_workspace_schema.sql
-- Production Domain: https://aisatellite.dev

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Developer',
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  is_email_verified INTEGER NOT NULL DEFAULT 0,
  email_verification_token TEXT,
  password_reset_token TEXT,
  password_reset_expires TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- 3. User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  interests TEXT NOT NULL DEFAULT '[]', -- JSON array of strings
  default_stack TEXT NOT NULL DEFAULT 'TypeScript & React',
  telemetry_enabled INTEGER NOT NULL DEFAULT 0,
  personalization_enabled INTEGER NOT NULL DEFAULT 1,
  notification_preferences TEXT NOT NULL DEFAULT '{}', -- JSON object
  theme TEXT NOT NULL DEFAULT 'cosmic',
  updated_at TEXT NOT NULL
);

-- 4. Collections Table
CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  is_public INTEGER NOT NULL DEFAULT 0,
  tags TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_collections_user ON collections(user_id);

-- 5. Saved Resources Table
CREATE TABLE IF NOT EXISTS saved_resources (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL,
  resource_category TEXT NOT NULL,
  title TEXT NOT NULL,
  original_url TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  tags TEXT NOT NULL DEFAULT '[]',
  collection_id TEXT REFERENCES collections(id) ON DELETE SET NULL,
  saved_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_saved_resources_user ON saved_resources(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_resources_category ON saved_resources(resource_category);

-- 6. Personal Prompts
CREATE TABLE IF NOT EXISTS prompts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  template_text TEXT NOT NULL,
  variables TEXT NOT NULL DEFAULT '[]', -- JSON array
  current_version INTEGER NOT NULL DEFAULT 1,
  is_public INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prompts_user ON prompts(user_id);

-- 7. Prompt Versions (Immutable History)
CREATE TABLE IF NOT EXISTS prompt_versions (
  id TEXT PRIMARY KEY,
  prompt_id TEXT NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  content TEXT NOT NULL,
  change_summary TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_prompt_versions_prompt ON prompt_versions(prompt_id, version);

-- 8. Code Snippets Vault
CREATE TABLE IF NOT EXISTS code_snippets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',
  collection_id TEXT REFERENCES collections(id) ON DELETE SET NULL,
  is_public INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_code_snippets_user ON code_snippets(user_id);
CREATE INDEX IF NOT EXISTS idx_code_snippets_lang ON code_snippets(language);

-- 9. Developer Projects
CREATE TABLE IF NOT EXISTS developer_projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'planning', -- planning, active, paused, completed, archived
  related_tool_ids TEXT NOT NULL DEFAULT '[]',
  saved_prompt_ids TEXT NOT NULL DEFAULT '[]',
  code_snippet_ids TEXT NOT NULL DEFAULT '[]',
  tutorial_ids TEXT NOT NULL DEFAULT '[]',
  external_repo_url TEXT,
  research_notes TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_user ON developer_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON developer_projects(status);

-- 10. Learning Progress
CREATE TABLE IF NOT EXISTS learning_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  path_id TEXT NOT NULL,
  completed_lesson_ids TEXT NOT NULL DEFAULT '[]',
  bookmarked_lesson_ids TEXT NOT NULL DEFAULT '[]',
  current_step INTEGER NOT NULL DEFAULT 1,
  last_active_at TEXT NOT NULL,
  percent_complete INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, path_id)
);

CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON learning_progress(user_id);

-- 11. Workspace Notifications
CREATE TABLE IF NOT EXISTS workspace_notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  resource_id TEXT,
  read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON workspace_notifications(user_id, read);

-- 12. Workspace Audit Events
CREATE TABLE IF NOT EXISTS workspace_audit_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  timestamp TEXT NOT NULL,
  ip_address TEXT,
  details TEXT DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_audit_user_time ON workspace_audit_events(user_id, timestamp);
