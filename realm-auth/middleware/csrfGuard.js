/* ===========================================================================
 * Piza Sukeruton Realm — CSRF protection middleware
 * Another Fine Product from We Make Trouble
 * ===========================================================================
 * Origin-header check for state-changing requests (POST, PATCH, PUT, DELETE).
 * Rejects cross-origin mutations — the browser always sends Origin on these
 * verbs, so a missing or mismatched header means the request did not come
 * from our site.
 *
 * Wire BEFORE route handlers:
 *
 *   import { csrfGuard } from './realm-auth/middleware/csrfGuard.js';
 *   app.use('/api/account', requireAuth, csrfGuard, accountRouter);
 *   app.use('/api/auth',    authLimiter,  csrfGuard, authRouter);
 *
 * GET/HEAD/OPTIONS are safe methods — passed through without checks.
 *
 * ALLOWED_ORIGINS defaults to the production domain. In dev, set the
 * ALLOWED_ORIGINS env var (comma-separated) to include localhost origins:
 *   ALLOWED_ORIGINS=http://localhost:3002,http://localhost:5173
 * =========================================================================== */

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

const DEFAULT_ORIGINS = ['https://www.pizasukeruton.com'];

function parseAllowed() {
  const env = process.env.ALLOWED_ORIGINS;
  if (env) {
    return env.split(',').map(s => s.trim()).filter(Boolean);
  }
  return DEFAULT_ORIGINS;
}

export function csrfGuard(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();

  const origin = req.get('Origin');
  const allowed = parseAllowed();

  // If Origin is present, it must match one of our allowed origins
  if (origin) {
    if (allowed.includes(origin)) return next();
    console.warn(`[CSRF] Blocked ${req.method} ${req.originalUrl} from origin: ${origin}`);
    return res.status(403).json({ error: 'Request blocked — origin not allowed.' });
  }

  // No Origin header. Browsers always send it on POST/PATCH/etc from a page.
  // Its absence usually means a non-browser client (curl, Postman) which is
  // fine behind requireAuth, OR a same-origin request in some older browsers.
  // We allow it if Referer matches, otherwise block.
  const referer = req.get('Referer');
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      if (allowed.includes(refOrigin)) return next();
    } catch (_) { /* malformed referer — fall through to block */ }
  }

  // In development, allow requests with no Origin and no Referer (e.g. curl)
  if (process.env.NODE_ENV !== 'production') return next();

  console.warn(`[CSRF] Blocked ${req.method} ${req.originalUrl} — no Origin or Referer header`);
  return res.status(403).json({ error: 'Request blocked — origin verification failed.' });
}

export default csrfGuard;
