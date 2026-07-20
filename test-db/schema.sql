-- Zimbabwe Maids Centre - Test Database Schema
-- SQLite 3

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK(role IN ('admin', 'employer', 'worker')),
  phone         TEXT,
  avatar_url    TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS employer_profiles (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name      TEXT NOT NULL,
  city           TEXT,
  suburb         TEXT,
  household_size INTEGER,
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS worker_profiles (
  id                    TEXT PRIMARY KEY,
  user_id               TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name             TEXT NOT NULL,
  gender                TEXT,
  city                  TEXT,
  suburb                TEXT,
  skills                TEXT,
  experience_years      INTEGER DEFAULT 0,
  bio                   TEXT,
  verification_status   TEXT DEFAULT '{}',
  created_at            TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at            TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS jobs (
  id            TEXT PRIMARY KEY,
  employer_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  worker_type   TEXT NOT NULL,
  city          TEXT,
  suburb        TEXT,
  salary_min    REAL,
  salary_max    REAL,
  currency      TEXT DEFAULT 'USD',
  status        TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'filled', 'expired', 'cancelled')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at    TEXT NOT NULL DEFAULT (datetime('now', '+30 days'))
);

CREATE TABLE IF NOT EXISTS verifications (
  id            TEXT PRIMARY KEY,
  worker_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type          TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  documents     TEXT DEFAULT '[]',
  notes         TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS payments (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id        TEXT REFERENCES jobs(id),
  amount        REAL NOT NULL,
  currency      TEXT DEFAULT 'USD',
  method        TEXT DEFAULT 'ecocash',
  type          TEXT DEFAULT 'placement_fee',
  status        TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'success', 'failed')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS matches (
  id            TEXT PRIMARY KEY,
  job_id        TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score         REAL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'rejected')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
