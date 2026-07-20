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

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('inquiry', 'matched', 'booked', 'fee_paid', 'worker_assigned', 'started', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid REFERENCES users(id) ON DELETE SET NULL,
  worker_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text NOT NULL,
  city text NOT NULL,
  suburb text NOT NULL,
  work_type text NOT NULL,
  start_date date NOT NULL,
  schedule_notes text NOT NULL DEFAULT '',
  requirements text NOT NULL DEFAULT '',
  status booking_status NOT NULL DEFAULT 'inquiry',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bookings_worker_idx ON bookings(worker_id, created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_employer_idx ON bookings(employer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings(status, created_at DESC);

CREATE TABLE IF NOT EXISTS booking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  status booking_status NOT NULL,
  note text NOT NULL DEFAULT '',
  actor_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS booking_events_booking_idx ON booking_events(booking_id, created_at DESC);

ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'Housekeeper';
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS work_types text[] NOT NULL DEFAULT '{}';
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;
ALTER TABLE worker_profiles ADD COLUMN IF NOT EXISTS admin_notes text NOT NULL DEFAULT '';

DO $$ BEGIN
  CREATE TYPE applicant_stage AS ENUM ('new', 'screened', 'interviewed', 'training', 'approved', 'converted', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS applicants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL DEFAULT '',
  phone_number text NOT NULL,
  whatsapp_number text NOT NULL DEFAULT '',
  city text NOT NULL,
  suburb text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Housekeeper',
  work_types text[] NOT NULL DEFAULT '{}',
  skills text[] NOT NULL DEFAULT '{}',
  languages text[] NOT NULL DEFAULT '{}',
  experience_years integer NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
  expected_salary numeric(12,2) NOT NULL DEFAULT 0,
  bio text NOT NULL DEFAULT '',
  source text NOT NULL DEFAULT 'admin',
  stage applicant_stage NOT NULL DEFAULT 'new',
  interview_at timestamptz,
  notes text NOT NULL DEFAULT '',
  converted_worker_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS applicants_stage_created_idx ON applicants(stage, created_at DESC);
CREATE INDEX IF NOT EXISTS applicants_phone_idx ON applicants(phone_number);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  action text NOT NULL,
  actor_id uuid REFERENCES users(id) ON DELETE SET NULL,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_logs_entity_idx ON audit_logs(entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_actor_idx ON audit_logs(actor_id, created_at DESC);

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS client_request_id text;
CREATE UNIQUE INDEX IF NOT EXISTS bookings_client_request_idx
  ON bookings(client_request_id) WHERE client_request_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS bookings_created_status_idx ON bookings(created_at DESC, status);
CREATE INDEX IF NOT EXISTS worker_profiles_public_directory_idx
  ON worker_profiles(is_published, city, category, rating DESC) WHERE is_published=true;
CREATE INDEX IF NOT EXISTS worker_profiles_skills_gin_idx ON worker_profiles USING gin(skills);
CREATE INDEX IF NOT EXISTS worker_profiles_work_types_gin_idx ON worker_profiles USING gin(work_types);
CREATE INDEX IF NOT EXISTS applicants_updated_stage_idx ON applicants(updated_at DESC, stage);
CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS sessions_expires_idx ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS request_rate_limits (
  scope text NOT NULL,
  identifier_hash text NOT NULL,
  window_started_at timestamptz NOT NULL,
  request_count integer NOT NULL DEFAULT 1,
  PRIMARY KEY (scope, identifier_hash, window_started_at)
);

CREATE INDEX IF NOT EXISTS request_rate_limits_expiry_idx ON request_rate_limits(window_started_at);

CREATE TABLE IF NOT EXISTS account_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS account_invites_user_idx ON account_invites(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS account_invites_expiry_idx ON account_invites(expires_at);
