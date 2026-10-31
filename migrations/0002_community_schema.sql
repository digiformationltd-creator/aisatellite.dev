-- AI Satellite — Phase 13 D1 Relational Schema Migration
-- Migration: 0002_community_schema.sql
-- Production Domain: https://aisatellite.dev

-- 1. Public Developer Profiles Table
CREATE TABLE IF NOT EXISTS community_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  technical_interests TEXT NOT NULL DEFAULT '[]', -- JSON array of strings
  public_website TEXT DEFAULT '',
  github_username TEXT,
  is_public_profile INTEGER NOT NULL DEFAULT 0, -- Opt-in privacy strictly enforced
  reputation_score INTEGER NOT NULL DEFAULT 0,
  badges TEXT NOT NULL DEFAULT '[]', -- JSON array of badge keys
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_community_profiles_username ON community_profiles(username);
CREATE INDEX IF NOT EXISTS idx_community_profiles_public ON community_profiles(is_public_profile);

-- 2. GitHub Connections Table
CREATE TABLE IF NOT EXISTS github_connections (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  github_user_id TEXT NOT NULL,
  github_username TEXT NOT NULL,
  profile_url TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  public_repo_count INTEGER NOT NULL DEFAULT 0,
  linked_repo_urls TEXT NOT NULL DEFAULT '[]', -- JSON array of verified repo URLs
  connected_at TEXT NOT NULL,
  last_synced_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_github_connections_github_username ON github_connections(github_username);

-- 3. Technical Discussions Table
CREATE TABLE IF NOT EXISTS community_discussions (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_username TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]', -- JSON array
  reply_count INTEGER NOT NULL DEFAULT 0,
  is_resolved INTEGER NOT NULL DEFAULT 0,
  is_locked INTEGER NOT NULL DEFAULT 0,
  is_hidden INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_discussions_category ON community_discussions(category);
CREATE INDEX IF NOT EXISTS idx_discussions_author ON community_discussions(author_id);
CREATE INDEX IF NOT EXISTS idx_discussions_created ON community_discussions(created_at);

-- 4. Discussion Replies Table
CREATE TABLE IF NOT EXISTS discussion_replies (
  id TEXT PRIMARY KEY,
  discussion_id TEXT NOT NULL REFERENCES community_discussions(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_username TEXT NOT NULL,
  content TEXT NOT NULL,
  is_hidden INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_discussion_replies_parent ON discussion_replies(discussion_id);

-- 5. Developer Q&A Questions Table
CREATE TABLE IF NOT EXISTS community_questions (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_username TEXT NOT NULL,
  title TEXT NOT NULL,
  technical_context TEXT NOT NULL,
  code_snippet TEXT,
  tags TEXT NOT NULL DEFAULT '[]',
  accepted_answer_id TEXT,
  is_answered INTEGER NOT NULL DEFAULT 0,
  answer_count INTEGER NOT NULL DEFAULT 0,
  related_doc_urls TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_questions_author ON community_questions(author_id);
CREATE INDEX IF NOT EXISTS idx_questions_answered ON community_questions(is_answered);

-- 6. Question Answers Table
CREATE TABLE IF NOT EXISTS question_answers (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES community_questions(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_username TEXT NOT NULL,
  content TEXT NOT NULL,
  code_example TEXT,
  is_accepted INTEGER NOT NULL DEFAULT 0,
  is_outdated INTEGER NOT NULL DEFAULT 0,
  upvote_count INTEGER NOT NULL DEFAULT 0,
  upvoter_user_ids TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_answers_question ON question_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_accepted ON question_answers(is_accepted);

-- 7. Open-Source Project Showcases Table
CREATE TABLE IF NOT EXISTS project_showcases (
  id TEXT PRIMARY KEY,
  submitter_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submitter_username TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  repo_url TEXT UNIQUE NOT NULL,
  maintainer_attribution TEXT NOT NULL,
  license TEXT NOT NULL,
  is_license_verified INTEGER NOT NULL DEFAULT 0,
  supported_platforms TEXT NOT NULL DEFAULT '[]',
  doc_url TEXT NOT NULL,
  install_instructions TEXT NOT NULL,
  verified_release_version TEXT NOT NULL DEFAULT 'v1.0.0',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, changes_requested
  editorial_notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON project_showcases(status);
CREATE INDEX IF NOT EXISTS idx_projects_repo_url ON project_showcases(repo_url);

-- 8. Community Resource Submissions Table
CREATE TABLE IF NOT EXISTS community_resource_submissions (
  id TEXT PRIMARY KEY,
  submitter_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submitter_username TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  license TEXT,
  replaces_paid_tool TEXT,
  tags TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending',
  editorial_notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_resource_submissions_status ON community_resource_submissions(status);
CREATE INDEX IF NOT EXISTS idx_resource_submissions_category ON community_resource_submissions(category);

-- 9. Verified Contribution Records Table
CREATE TABLE IF NOT EXISTS contribution_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  contribution_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  resource_title TEXT NOT NULL,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  verified_at TEXT NOT NULL,
  evidence_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_contributions_user ON contribution_records(user_id);

-- 10. Reputation Events Table
CREATE TABLE IF NOT EXISTS reputation_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  points_delta INTEGER NOT NULL,
  source_entity_id TEXT NOT NULL,
  description TEXT NOT NULL,
  is_reversed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reputation_user ON reputation_events(user_id);

-- 11. Collaborative Collections Table
CREATE TABLE IF NOT EXISTS collaborative_collections (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  owner_username TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  is_public INTEGER NOT NULL DEFAULT 0,
  resource_ids TEXT NOT NULL DEFAULT '[]',
  notes TEXT DEFAULT '',
  tags TEXT NOT NULL DEFAULT '[]',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_collaborative_collections_owner ON collaborative_collections(owner_id);
CREATE INDEX IF NOT EXISTS idx_collaborative_collections_public ON collaborative_collections(is_public);

-- 12. Collection Memberships Table
CREATE TABLE IF NOT EXISTS collection_memberships (
  collection_id TEXT NOT NULL REFERENCES collaborative_collections(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer', -- owner, editor, viewer
  added_at TEXT NOT NULL,
  PRIMARY KEY (collection_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_collection_memberships_user ON collection_memberships(user_id);

-- 13. Community Reports Table
CREATE TABLE IF NOT EXISTS community_reports (
  id TEXT PRIMARY KEY,
  reporter_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  action_taken TEXT,
  created_at TEXT NOT NULL,
  resolved_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON community_reports(status);

-- 14. Moderation Actions Audit Log Table
CREATE TABLE IF NOT EXISTS moderation_actions (
  id TEXT PRIMARY KEY,
  moderator_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  moderator_username TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  timestamp TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_moderation_actions_timestamp ON moderation_actions(timestamp);

-- 15. Moderation Appeals Table
CREATE TABLE IF NOT EXISTS moderation_appeals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  moderation_action_id TEXT NOT NULL REFERENCES moderation_actions(id) ON DELETE CASCADE,
  statement TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, rejected
  reviewed_by TEXT,
  review_notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_appeals_status ON moderation_appeals(status);
