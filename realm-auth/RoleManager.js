/* ===========================================================================
 * Piza Sukeruton Realm — RoleManager
 * Another Fine Product from We Make Trouble
 * ===========================================================================
 * RBAC operations: check, grant, revoke, list.
 * All mutations write to both user_roles AND role_audit_log (append-only).
 * No role is implicit — even 'member' is an explicit grant.
 *
 * Roles are NOT hierarchical. 'admin' does not imply 'researcher'.
 * A user must hold each role explicitly.
 *
 *   import { hasRole, getRoles, grantRole, revokeRole } from './RoleManager.js';
 * =========================================================================== */
import { query, withTransaction } from './db.js';

/* ── Queries ────────────────────────────────────────────────────────────── */

/**
 * Check if a user holds a specific active role.
 * Returns boolean. Designed for hot-path middleware — single indexed lookup.
 */
export async function hasRole(userId, role) {
  const { rows } = await query(
    `SELECT 1 FROM user_roles
     WHERE user_id = $1 AND role = $2 AND revoked_at IS NULL
     LIMIT 1`,
    [userId, role]
  );
  return rows.length > 0;
}

/**
 * Get all active roles for a user.
 * Returns string[] of role names.
 */
export async function getRoles(userId) {
  const { rows } = await query(
    `SELECT role FROM user_roles
     WHERE user_id = $1 AND revoked_at IS NULL
     ORDER BY granted_at`,
    [userId]
  );
  return rows.map(r => r.role);
}

/**
 * Get all active roles for a user with full grant metadata.
 * Returns array of { role, granted_at, granted_by, grant_reason }.
 */
export async function getRolesDetailed(userId) {
  const { rows } = await query(
    `SELECT ur.role, rd.label, rd.description,
            ur.granted_at, ur.granted_by, ur.grant_reason
     FROM user_roles ur
     JOIN role_definitions rd ON rd.role = ur.role
     WHERE ur.user_id = $1 AND ur.revoked_at IS NULL
     ORDER BY ur.granted_at`,
    [userId]
  );
  return rows;
}

/* ── Mutations ──────────────────────────────────────────────────────────── */

/**
 * Grant a role to a user.
 * Returns { ok, error? }.
 * Writes to user_roles + role_audit_log in a single transaction.
 *
 * @param {string} userId     - target user
 * @param {string} role       - role name (must exist in role_definitions)
 * @param {object} opts
 * @param {string} opts.grantedBy  - user_id of the granter (null = system/CLI)
 * @param {string} opts.reason     - audit note
 * @param {string} opts.ip         - request IP (for audit)
 * @param {string} opts.userAgent  - request user-agent (for audit)
 */
export async function grantRole(userId, role, opts = {}) {
  const { grantedBy = null, reason = null, ip = null, userAgent = null } = opts;

  return withTransaction(async (client) => {
    // Verify the role exists
    const { rows: roleDef } = await client.query(
      `SELECT role FROM role_definitions WHERE role = $1`, [role]
    );
    if (roleDef.length === 0) {
      return { ok: false, error: `Role '${role}' does not exist.` };
    }

    // Verify the target user exists
    const { rows: userRows } = await client.query(
      `SELECT id FROM users WHERE id = $1`, [userId]
    );
    if (userRows.length === 0) {
      return { ok: false, error: `User '${userId}' does not exist.` };
    }

    // Check if already actively granted
    const { rows: existing } = await client.query(
      `SELECT id FROM user_roles
       WHERE user_id = $1 AND role = $2 AND revoked_at IS NULL`,
      [userId, role]
    );
    if (existing.length > 0) {
      return { ok: false, error: `User '${userId}' already has role '${role}'.` };
    }

    // Insert the grant
    await client.query(
      `INSERT INTO user_roles (user_id, role, granted_by, grant_reason)
       VALUES ($1, $2, $3, $4)`,
      [userId, role, grantedBy, reason]
    );

    // Append to audit log
    await client.query(
      `INSERT INTO role_audit_log (action, user_id, role, performed_by, reason, ip_address, user_agent)
       VALUES ('grant', $1, $2, $3, $4, $5, $6)`,
      [userId, role, grantedBy, reason, ip, userAgent]
    );

    return { ok: true };
  });
}

/**
 * Revoke a role from a user.
 * Does NOT delete the row — sets revoked_at + revoked_by for audit trail.
 * Returns { ok, error? }.
 */
export async function revokeRole(userId, role, opts = {}) {
  const { revokedBy = null, reason = null, ip = null, userAgent = null } = opts;

  return withTransaction(async (client) => {
    // Find the active grant
    const { rows } = await client.query(
      `SELECT id FROM user_roles
       WHERE user_id = $1 AND role = $2 AND revoked_at IS NULL`,
      [userId, role]
    );
    if (rows.length === 0) {
      return { ok: false, error: `User '${userId}' does not hold role '${role}'.` };
    }

    // Revoke (soft delete)
    await client.query(
      `UPDATE user_roles
       SET revoked_at = now(), revoked_by = $3, revoke_reason = $4
       WHERE id = $1`,
      [rows[0].id, userId, revokedBy, reason]
    );

    // Append to audit log
    await client.query(
      `INSERT INTO role_audit_log (action, user_id, role, performed_by, reason, ip_address, user_agent)
       VALUES ('revoke', $1, $2, $3, $4, $5, $6)`,
      [userId, role, revokedBy, reason, ip, userAgent]
    );

    return { ok: true };
  });
}

/**
 * Log a denied access attempt (for audit / anomaly detection).
 * Does not modify roles. Append-only to role_audit_log.
 */
export async function logDeniedAccess(userId, role, opts = {}) {
  const { ip = null, userAgent = null } = opts;
  await query(
    `INSERT INTO role_audit_log (action, user_id, role, performed_by, reason, ip_address, user_agent)
     VALUES ('deny', $1, $2, NULL, 'Access attempted without required role', $3, $4)`,
    [userId, role, ip, userAgent]
  );
}

/* ── Admin queries ──────────────────────────────────────────────────────── */

/**
 * List all users who hold a specific role.
 * Returns array of { user_id, granted_at, granted_by }.
 */
export async function getUsersByRole(role) {
  const { rows } = await query(
    `SELECT ur.user_id, u.name, u.email,
            ur.granted_at, ur.granted_by, ur.grant_reason
     FROM user_roles ur
     JOIN users u ON u.id = ur.user_id
     WHERE ur.role = $1 AND ur.revoked_at IS NULL
     ORDER BY ur.granted_at`,
    [role]
  );
  return rows;
}

/**
 * Get the full audit history for a user.
 * Returns array of { action, role, performed_by, reason, ip_address, created_at }.
 */
export async function getAuditHistory(userId) {
  const { rows } = await query(
    `SELECT action, role, performed_by, reason, ip_address, user_agent, created_at
     FROM role_audit_log
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

/**
 * Get available roles that can be assigned via admin UI.
 */
export async function getAssignableRoles() {
  const { rows } = await query(
    `SELECT role, label, description
     FROM role_definitions
     WHERE is_assignable = true
     ORDER BY role`
  );
  return rows;
}

export default {
  hasRole, getRoles, getRolesDetailed,
  grantRole, revokeRole, logDeniedAccess,
  getUsersByRole, getAuditHistory, getAssignableRoles,
};
