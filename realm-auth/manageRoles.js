#!/usr/bin/env node
/* ===========================================================================
 * Piza Sukeruton Realm — Role management CLI
 * Another Fine Product from We Make Trouble
 * ===========================================================================
 * Manage user roles from the terminal. Every action writes to the
 * role_audit_log with performed_by = null (system/CLI).
 *
 * Usage:
 *   node realm-auth/manageRoles.js grant  <email> <role> [reason]
 *   node realm-auth/manageRoles.js revoke <email> <role> [reason]
 *   node realm-auth/manageRoles.js list   <email>
 *   node realm-auth/manageRoles.js who    <role>
 *   node realm-auth/manageRoles.js audit  <email>
 *   node realm-auth/manageRoles.js roles
 *
 * Examples:
 *   node realm-auth/manageRoles.js grant jake@example.com researcher "Lab access approved by James"
 *   node realm-auth/manageRoles.js revoke jake@example.com researcher "Access review Q3"
 *   node realm-auth/manageRoles.js list jake@example.com
 *   node realm-auth/manageRoles.js who researcher
 *   node realm-auth/manageRoles.js audit jake@example.com
 *   node realm-auth/manageRoles.js roles
 *
 * Requires: DATABASE_URL env var pointing at bicameral_sweep_17.
 * =========================================================================== */
import { findByEmail } from './UserManager.js';
import { getRolesDetailed, grantRole, revokeRole, getUsersByRole, getAuditHistory, getAssignableRoles } from './RoleManager.js';
import { query, pool } from './db.js';

const [,, action, ...args] = process.argv;

const USAGE = `
Usage:
  node realm-auth/manageRoles.js grant  <email> <role> [reason]
  node realm-auth/manageRoles.js revoke <email> <role> [reason]
  node realm-auth/manageRoles.js list   <email>
  node realm-auth/manageRoles.js who    <role>
  node realm-auth/manageRoles.js audit  <email>
  node realm-auth/manageRoles.js roles
`.trim();

async function resolveUser(email) {
  const user = await findByEmail(email);
  if (!user) {
    console.error(`\n  ✕ No user found with email: ${email}\n`);
    process.exit(1);
  }
  return user;
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toISOString().replace('T', ' ').replace(/\.\d+Z/, ' UTC');
}

async function main() {
  if (!action) {
    console.log(USAGE);
    process.exit(0);
  }

  switch (action.toLowerCase()) {

    /* ── grant ────────────────────────────────────────────────────────── */
    case 'grant': {
      const [email, role, ...reasonParts] = args;
      if (!email || !role) {
        console.error('  ✕ Usage: grant <email> <role> [reason]');
        process.exit(1);
      }
      const user = await resolveUser(email);
      const reason = reasonParts.join(' ') || null;

      const result = await grantRole(user.id, role, {
        grantedBy: null,  // CLI / system
        reason,
      });

      if (result.ok) {
        console.log(`\n  ✓ Granted '${role}' to ${user.name} (${user.email}) [${user.id}]`);
        if (reason) console.log(`    Reason: ${reason}`);
      } else {
        console.error(`\n  ✕ ${result.error}`);
        process.exit(1);
      }
      break;
    }

    /* ── revoke ───────────────────────────────────────────────────────── */
    case 'revoke': {
      const [email, role, ...reasonParts] = args;
      if (!email || !role) {
        console.error('  ✕ Usage: revoke <email> <role> [reason]');
        process.exit(1);
      }
      const user = await resolveUser(email);
      const reason = reasonParts.join(' ') || null;

      const result = await revokeRole(user.id, role, {
        revokedBy: null,  // CLI / system
        reason,
      });

      if (result.ok) {
        console.log(`\n  ✓ Revoked '${role}' from ${user.name} (${user.email}) [${user.id}]`);
        if (reason) console.log(`    Reason: ${reason}`);
      } else {
        console.error(`\n  ✕ ${result.error}`);
        process.exit(1);
      }
      break;
    }

    /* ── list (user's roles) ─────────────────────────────────────────── */
    case 'list': {
      const [email] = args;
      if (!email) {
        console.error('  ✕ Usage: list <email>');
        process.exit(1);
      }
      const user = await resolveUser(email);
      const roles = await getRolesDetailed(user.id);

      console.log(`\n  ${user.name} (${user.email}) [${user.id}]`);
      if (roles.length === 0) {
        console.log('  No active roles.\n');
      } else {
        console.log(`  ${roles.length} active role(s):\n`);
        for (const r of roles) {
          console.log(`    ▸ ${r.role} (${r.label})`);
          console.log(`      ${r.description}`);
          console.log(`      Granted: ${fmtDate(r.granted_at)}${r.granted_by ? ` by ${r.granted_by}` : ' (system/CLI)'}`);
          if (r.grant_reason) console.log(`      Reason: ${r.grant_reason}`);
          console.log('');
        }
      }
      break;
    }

    /* ── who (users holding a role) ──────────────────────────────────── */
    case 'who': {
      const [role] = args;
      if (!role) {
        console.error('  ✕ Usage: who <role>');
        process.exit(1);
      }
      const users = await getUsersByRole(role);

      console.log(`\n  Users with role '${role}': ${users.length}\n`);
      for (const u of users) {
        console.log(`    ▸ ${u.name} (${u.email}) [${u.user_id}]`);
        console.log(`      Granted: ${fmtDate(u.granted_at)}${u.granted_by ? ` by ${u.granted_by}` : ' (system/CLI)'}`);
        if (u.grant_reason) console.log(`      Reason: ${u.grant_reason}`);
        console.log('');
      }
      break;
    }

    /* ── audit (full history for a user) ─────────────────────────────── */
    case 'audit': {
      const [email] = args;
      if (!email) {
        console.error('  ✕ Usage: audit <email>');
        process.exit(1);
      }
      const user = await resolveUser(email);
      const history = await getAuditHistory(user.id);

      console.log(`\n  Audit log for ${user.name} (${user.email}) [${user.id}]`);
      console.log(`  ${history.length} event(s):\n`);

      const actionIcons = { grant: '✓', revoke: '✕', deny: '⚠' };
      for (const h of history) {
        const icon = actionIcons[h.action] || '?';
        console.log(`    ${icon} ${h.action.toUpperCase().padEnd(7)} ${h.role.padEnd(14)} ${fmtDate(h.created_at)}`);
        if (h.performed_by) console.log(`      by: ${h.performed_by}`);
        if (h.reason) console.log(`      reason: ${h.reason}`);
        if (h.ip_address) console.log(`      ip: ${h.ip_address}`);
        console.log('');
      }
      break;
    }

    /* ── roles (list all defined roles) ──────────────────────────────── */
    case 'roles': {
      const { rows } = await query(
        `SELECT role, label, description, is_assignable FROM role_definitions ORDER BY role`
      );
      console.log(`\n  Defined roles (${rows.length}):\n`);
      for (const r of rows) {
        const flag = r.is_assignable ? '' : ' [system-only]';
        console.log(`    ▸ ${r.role} — ${r.label}${flag}`);
        console.log(`      ${r.description}`);
        console.log('');
      }
      break;
    }

    default:
      console.error(`  ✕ Unknown action: ${action}`);
      console.log(USAGE);
      process.exit(1);
  }

  await pool.end();
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
