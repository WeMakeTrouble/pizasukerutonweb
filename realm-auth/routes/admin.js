/* ===========================================================================
 * Piza Sukeruton Realm — admin role management routes (mounted at /api/admin)
 * Another Fine Product from We Make Trouble
 * ===========================================================================
 *   GET    /api/admin/roles                     -> list all defined roles
 *   GET    /api/admin/roles/:role/users         -> users holding a role
 *   GET    /api/admin/users/:userId/roles       -> roles for a user
 *   GET    /api/admin/users/:userId/audit       -> audit trail for a user
 *   POST   /api/admin/users/:userId/roles       -> grant a role
 *   DELETE /api/admin/users/:userId/roles/:role -> revoke a role
 *
 * All routes gated by requireAuth + requireRole('admin', 'superadmin').
 * Superadmin can grant/revoke 'admin'. Admin cannot.
 *
 * Wire:
 *   import { adminRouter } from './realm-auth/routes/admin.js';
 *   app.use('/api/admin', requireAuth, csrfGuard, requireRole('admin','superadmin'), adminRouter);
 * =========================================================================== */
import { Router } from 'express';
import {
  getAssignableRoles, getUsersByRole,
  getRolesDetailed, getAuditHistory,
  grantRole, revokeRole,
} from '../RoleManager.js';
import { findById } from '../UserManager.js';

export const adminRouter = Router();

/* ── GET /roles — list defined roles ─────────────────────────────────── */
adminRouter.get('/roles', async (req, res, next) => {
  try {
    const roles = await getAssignableRoles();
    res.json({ roles });
  } catch (err) { next(err); }
});

/* ── GET /roles/:role/users — who holds this role ────────────────────── */
adminRouter.get('/roles/:role/users', async (req, res, next) => {
  try {
    const users = await getUsersByRole(req.params.role);
    res.json({ role: req.params.role, users });
  } catch (err) { next(err); }
});

/* ── GET /users/:userId/roles — roles for a user ────────────────────── */
adminRouter.get('/users/:userId/roles', async (req, res, next) => {
  try {
    const user = await findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const roles = await getRolesDetailed(req.params.userId);
    res.json({ user: { id: user.id, name: user.name, email: user.email }, roles });
  } catch (err) { next(err); }
});

/* ── GET /users/:userId/audit — full audit trail ────────────────────── */
adminRouter.get('/users/:userId/audit', async (req, res, next) => {
  try {
    const user = await findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const history = await getAuditHistory(req.params.userId);
    res.json({ user: { id: user.id, name: user.name, email: user.email }, history });
  } catch (err) { next(err); }
});

/* ── POST /users/:userId/roles — grant a role ───────────────────────── */
adminRouter.post('/users/:userId/roles', async (req, res, next) => {
  try {
    const { role, reason } = req.body || {};
    if (!role || typeof role !== 'string') {
      return res.status(400).json({ error: 'Missing role.' });
    }

    // Only superadmin can grant 'admin' or 'superadmin'
    const privilegedRoles = ['admin', 'superadmin'];
    if (privilegedRoles.includes(role) && req.matchedRole !== 'superadmin') {
      console.warn(
        `[ADMIN] ${req.userId} attempted to grant '${role}' to ${req.params.userId} — insufficient privilege`
      );
      return res.status(403).json({ error: 'Only superadmin can grant this role.' });
    }

    // Prevent self-escalation (admin granting themselves superadmin)
    if (req.params.userId === req.userId && privilegedRoles.includes(role)) {
      return res.status(403).json({ error: 'Cannot self-escalate privileges.' });
    }

    const result = await grantRole(req.params.userId, role, {
      grantedBy: req.userId,
      reason: typeof reason === 'string' ? reason.trim() : null,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    if (!result.ok) {
      return res.status(400).json({ error: result.error });
    }

    console.log(`[ADMIN] ${req.userId} granted '${role}' to ${req.params.userId}`);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

/* ── DELETE /users/:userId/roles/:role — revoke a role ──────────────── */
adminRouter.delete('/users/:userId/roles/:role', async (req, res, next) => {
  try {
    const { role } = req.params;
    const { reason } = req.body || {};

    // Only superadmin can revoke 'admin' or 'superadmin'
    const privilegedRoles = ['admin', 'superadmin'];
    if (privilegedRoles.includes(role) && req.matchedRole !== 'superadmin') {
      console.warn(
        `[ADMIN] ${req.userId} attempted to revoke '${role}' from ${req.params.userId} — insufficient privilege`
      );
      return res.status(403).json({ error: 'Only superadmin can revoke this role.' });
    }

    // Prevent superadmin from revoking their own superadmin
    if (req.params.userId === req.userId && role === 'superadmin') {
      return res.status(403).json({ error: 'Cannot revoke your own superadmin role.' });
    }

    const result = await revokeRole(req.params.userId, role, {
      revokedBy: req.userId,
      reason: typeof reason === 'string' ? reason.trim() : null,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    if (!result.ok) {
      return res.status(400).json({ error: result.error });
    }

    console.log(`[ADMIN] ${req.userId} revoked '${role}' from ${req.params.userId}`);
    res.json({ ok: true });
  } catch (err) { next(err); }
});

export default adminRouter;
