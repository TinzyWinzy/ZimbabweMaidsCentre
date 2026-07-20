CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('employer', 'worker', 'admin', 'verifier');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE job_status AS ENUM ('draft', 'active', 'filled', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  display_name text NOT NULL,
  phone_number text,
  photo_url text,
  role user_role NOT NULL,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);

CREATE INDEX IF NOT EXISTS sessions_token_hash_idx ON sessions(token_hash);

CREATE TABLE IF NOT EXISTS employer_profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  suburb text NOT NULL DEFAULT '',
  household_size integer NOT NULL DEFAULT 1 CHECK (household_size > 0),
  preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  verification_status text NOT NULL DEFAULT 'pending',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS worker_profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  date_of_birth date,
  gender text,
  city text NOT NULL DEFAULT '',
  suburb text NOT NULL DEFAULT '',
  skills text[] NOT NULL DEFAULT '{}',
  experience_years integer NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
  salary_min numeric(12,2) NOT NULL DEFAULT 0,
  salary_max numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  availability jsonb NOT NULL DEFAULT '{}'::jsonb,
  languages text[] NOT NULL DEFAULT '{}',
  bio text NOT NULL DEFAULT '',
  photo_url text,
  verification_status jsonb NOT NULL DEFAULT '{"kyc":"pending","backgroundCheck":"pending","referenceCheck":"pending","training":"pending","overall":"pending"}'::jsonb,
  phone_number text,
  whatsapp_number text,
  contact_visible boolean NOT NULL DEFAULT false,
  rating numeric(3,2) NOT NULL DEFAULT 0,
  review_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  worker_type text NOT NULL,
  city text NOT NULL,
  suburb text NOT NULL,
  salary_min numeric(12,2) NOT NULL,
  salary_max numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  requirements jsonb NOT NULL DEFAULT '{}'::jsonb,
  status job_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days')
);

CREATE INDEX IF NOT EXISTS jobs_status_created_idx ON jobs(status, created_at DESC);

CREATE INDEX IF NOT EXISTS jobs_employer_idx ON jobs(employer_id, created_at DESC);

CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  worker_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score numeric(5,2) NOT NULL DEFAULT 0,
  reasons text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending',
  placement_fee_paid boolean NOT NULL DEFAULT false,
  connection_fee_paid boolean NOT NULL DEFAULT false,
  rank integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz,
  UNIQUE(job_id, worker_id)
);

CREATE TABLE IF NOT EXISTS verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  status verification_status NOT NULL DEFAULT 'pending',
  documents text[] NOT NULL DEFAULT '{}',
  reviewer_notes text NOT NULL DEFAULT '',
  reviewed_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

CREATE INDEX IF NOT EXISTS verifications_worker_idx ON verifications(worker_id, created_at DESC);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  currency text NOT NULL,
  match_id uuid REFERENCES matches(id),
  method text NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  gateway_reference text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payments_user_idx ON payments(user_id, created_at DESC);
