-- ===========================================================================
-- Piza Sukeruton Realm — accounts + sessions
-- Another Fine Product from We Make Trouble
-- ===========================================================================
-- Minimal by design: name, email, password — nothing else.
-- The password is NEVER stored. Only its bcrypt hash is (bcryptjs, cost 12).
-- Apply with: psql "$DATABASE_URL" -f realm-auth/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,   -- stored trimmed + lowercased
  password_hash TEXT NOT NULL,          -- bcrypt hash; never the raw password
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Session store for express-session + connect-pg-simple (same as the TMBot
-- server). Idempotent so it's safe to re-run. We use createTableIfMissing:false
-- in the app, so the table is owned here.
CREATE TABLE IF NOT EXISTS "session" (
  "sid"    varchar NOT NULL PRIMARY KEY,
  "sess"   json NOT NULL,
  "expire" timestamp(6) NOT NULL
);
CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
