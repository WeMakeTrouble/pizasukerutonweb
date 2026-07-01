-- ===========================================================================
-- Piza Sukeruton Realm — RBAC (Role-Based Access Control)
-- Another Fine Product from We Make Trouble
-- ===========================================================================
-- Named-role RBAC. Users can hold multiple roles simultaneously.
-- Roles are NOT hierarchical — admin does not imply researcher access.
-- Each grant carries a full audit trail: who, when, why.
--
-- Apply AFTER realm-auth/schema.sql (depends on users table).
-- psql "$DATABASE_URL" -f realm-auth/schema-roles.sql
-- ===========================================================================

CREATE TABLE IF NOT EXISTS role_definitions (
  role          TEXT PRIMARY KEY,
  label         TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  is_assignable BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO role_definitions (role, label, description, is_assignable) VALUES
  ('member',     'Member',      'Basic access: store, dossier, portal.',           false),
  ('researcher', 'Researcher',  'Engine Laboratory access. Observation tools.',    true),
  ('admin',      'Admin',       'User management, role grants, system config.',    true),
  ('superadmin', 'Superadmin',  'God-mode. Can manage admins, system-level ops.', false)
ON CONFLICT (role) DO NOTHING;

CREATE TABLE IF NOT EXISTS user_roles (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id       BIGINT NOT NULL,
  role          TEXT NOT NULL REFERENCES role_definitions(role),
  granted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  granted_by    BIGINT,
  grant_reason  TEXT,
  revoked_at    TIMESTAMPTZ,
  revoked_by    BIGINT,
  revoke_reason TEXT
);

DROP INDEX IF EXISTS idx_user_roles_active_unique;
CREATE UNIQUE INDEX idx_user_roles_active_unique
  ON user_roles (user_id, role)
  WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_user_roles_user
  ON user_roles (user_id)
  WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_user_roles_role
  ON user_roles (role)
  WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_user_roles_granted_by
  ON user_roles (granted_by)
  WHERE granted_by IS NOT NULL;

CREATE TABLE IF NOT EXISTS role_audit_log (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  action        TEXT NOT NULL CHECK (action IN ('grant', 'revoke', 'deny')),
  user_id       BIGINT NOT NULL,
  role          TEXT NOT NULL,
  performed_by  BIGINT,
  reason        TEXT,
  ip_address    INET,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_role_audit_user
  ON role_audit_log (user_id);

CREATE INDEX IF NOT EXISTS idx_role_audit_created
  ON role_audit_log (created_at DESC);
