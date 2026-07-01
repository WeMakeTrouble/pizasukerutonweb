/* ===========================================================================
 * Piza Sukeruton Realm — session + auth rate limiter
 * Another Fine Product from We Make Trouble
 * ===========================================================================
 * Mirrors the TMBot server: express-session backed by connect-pg-simple, plus
 * a tight rate limit on the auth endpoints. Wire into the shopfront server.js:
 *
 *   import { sessionMiddleware, authLimiter } from './realm-auth/session.js';
 *   import { authRouter }   from './realm-auth/routes/auth.js';
 *   import { requireAuth }  from './realm-auth/middleware/requireAuth.js';
 *
 *   app.set('trust proxy', 1);            // already set in the shopfront
 *   app.use(sessionMiddleware);
 *   app.use('/api/auth', authLimiter, authRouter);
 *   // gate anything that needs a member: app.use('/account', requireAuth, ...)
 *
 * NOTE: the CSP in the shopfront already allows this (no extra script origins).
 * Production is HTTPS on www.pizasukeruton.com, so cookies go out `secure`.
 * Env needed: SESSION_SECRET (comma-separated allows rotation), DATABASE_URL.
 * =========================================================================== */
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import rateLimit from 'express-rate-limit';
import { pool } from './db.js';

const PgSession = connectPgSimple(session);

const SECRETS = (process.env.SESSION_SECRET || '')
  .split(',').map((s) => s.trim()).filter(Boolean);
if (SECRETS.length === 0) throw new Error('SESSION_SECRET required');

export const sessionMiddleware = session({
  store: new PgSession({ pool, tableName: 'session', createTableIfMissing: false }),
  secret: SECRETS,            // array → first signs, the rest still verify (rotation)
  name: 'realm.sid',
  resave: false,
  saveUninitialized: false,
  rolling: true,              // refresh the 7-day window on activity
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,           // JS can never read it
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
});

/* 15 attempts / 15 min / IP on the auth endpoints. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts — please try again later.' },
});
