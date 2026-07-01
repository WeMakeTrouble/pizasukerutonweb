/* ===========================================================================
 * Piza Sukeruton Realm — requireRole middleware
 * Another Fine Product from We Make Trouble
 * ===========================================================================
 * RBAC gate for routes that need a specific role. Designed to be chained
 * AFTER requireAuth (which sets req.userId and req.user).
 *
 *   import { requireRole } from './realm-auth/middleware/requireRole.js';
 *
 *   // Single role:
 *   app.use('/api/lab', requireAuth, requireRole('researcher'), labRouter);
 *
 *   // Any of several roles (OR):
 *   app.use('/api/admin', requireAuth, requireRole('admin', 'superadmin'), adminRouter);
 *
 * Behaviour on denial:
 *   - Logs the attempt to role_audit_log (append-only, for anomaly detection)
 *   - Returns 403 with a generic message (no information leakage about
 *     what roles exist or what the resource is)
 *   - Response headers: no Cache-Control leak, no role enumeration
 *
 * NOTE: requireAuth MUST run first. If req.userId is missing, this
 * middleware returns 401 (same as requireAuth) — defense in depth.
 * =========================================================================== */
import { hasRole, logDeniedAccess } from '../RoleManager.js';

/**
 * Returns Express middleware that checks the authenticated user holds
 * at least one of the specified roles.
 *
 * @param  {...string} roles - one or more role names (OR logic)
 * @returns {Function} Express middleware
 */
export function requireRole(...roles) {
  if (roles.length === 0) {
    throw new Error('requireRole() called with no roles — this is a configuration error.');
  }

  return async (req, res, next) => {
    // Defense in depth — requireAuth should have already run
    if (!req.userId) {
      console.warn(`[RBAC] 401 — requireRole(${roles.join(',')}) hit without req.userId. requireAuth not wired?`);
      return res.status(401).json({ error: 'Authentication required.' });
    }

    try {
      // Check each role (OR logic — any match is sufficient)
      for (const role of roles) {
        const granted = await hasRole(req.userId, role);
        if (granted) {
          // Attach the matched role for downstream handlers if needed
          req.matchedRole = role;
          return next();
        }
      }

      // All checks failed — access denied
      console.warn(
        `[RBAC] 403 — user ${req.userId} denied access to ${req.method} ${req.originalUrl} ` +
        `(requires: ${roles.join(' | ')})`
      );

      // Log the denied attempt for audit / anomaly detection
      // Fire-and-forget — don't let audit failure block the response
      logDeniedAccess(req.userId, roles.join(','), {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      }).catch(err => {
        console.error('[RBAC] Failed to log denied access:', err.message);
      });

      // Generic 403 — no information about what roles exist or what's behind the gate
      return res.status(403).json({ error: 'You do not have access to this resource.' });

    } catch (err) {
      // DB failure during role check — fail closed (deny access)
      console.error(`[RBAC] DB error checking roles for ${req.userId}:`, err.message);
      return res.status(503).json({ error: 'Service temporarily unavailable.' });
    }
  };
}

export default requireRole;
