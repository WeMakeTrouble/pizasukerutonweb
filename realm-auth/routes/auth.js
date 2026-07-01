/* ===========================================================================
 * Piza Sukeruton Realm — auth routes  (mounted at /api/auth)
 * Another Fine Product from We Make Trouble
 * ===========================================================================
 *   POST /api/auth/login     { email, password }       -> signs in
 *   POST /api/auth/logout                               -> ends the session
 *   GET  /api/auth/me                                   -> { user } | { user:null }
 *
 * Registration disabled — accounts created via CLI only (createUser.js).
 *
 * Session-cookie based (see session.js). The session only ever holds the
 * user's id + name — never anything sensitive.
 * =========================================================================== */
import { Router } from 'express';
import { authenticate, findById } from '../UserManager.js';

export const authRouter = Router();

function signIn(req, user) {
  req.session.userId = user.id;
  req.session.name = user.name;
}

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const user = await authenticate(email, password);
    if (!user) return res.status(401).json({ error: 'Wrong email or password.' });
    req.session.regenerate((err) => {
      if (err) return next(err);
      signIn(req, user);
      res.json({ user });
    });
  } catch (err) { next(err); }
});

authRouter.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('realm.sid');
    res.json({ ok: true });
  });
});

authRouter.get('/me', async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) return res.json({ user: null });
    const user = await findById(req.session.userId);
    res.json({ user: user || null });
  } catch (err) { next(err); }
});
