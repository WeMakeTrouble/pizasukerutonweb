/* ===========================================================================
 * Piza Sukeruton Realm — requireAuth
 * Another Fine Product from We Make Trouble
 * ===========================================================================
 * Gate for routes that need a signed-in member. Same shape as the TMBot
 * middleware: check the session, then RE-VERIFY the user still exists in the
 * DB (so a deleted account's stale cookie can't keep working), attach req.user
 * for handlers, and fail safe.
 *
 *   import { requireAuth } from './realm-auth/middleware/requireAuth.js';
 *   app.use('/account', requireAuth, accountRouter);
 *
 * (If you later add an `is_active` column to soft-ban accounts, check it here
 *  too — one extra condition.)
 * =========================================================================== */
import { findById } from '../UserManager.js';

export async function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    console.warn(`[AUTH] 401 from ${req.ip} — ${req.method} ${req.originalUrl}`);
    return res.status(401).json({ error: 'Please sign in to continue.' });
  }
  try {
    const user = await findById(req.session.userId);
    if (!user) {
      console.warn(`[AUTH] stale session ${req.session.userId} from ${req.ip} — ${req.method} ${req.originalUrl}`);
      req.session.destroy((err) => { if (err) console.error('[AUTH] session destroy failed:', err.message); });
      return res.status(401).json({ error: 'Please sign in to continue.' });
    }
    req.userId = user.id;
    req.user = user;
    next();
  } catch (err) {
    console.error('[AUTH] DB check failed:', err.message);
    return res.status(503).json({ error: 'Service temporarily unavailable.' });
  }
}

export default requireAuth;
