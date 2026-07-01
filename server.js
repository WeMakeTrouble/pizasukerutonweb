/**
 * Copyright © 2026 James Straker / We Make Trouble
 * Piza Sukeruton Realm — Server
 * Another Fine Product from We Make Trouble
 */
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { sessionMiddleware, authLimiter } from './realm-auth/session.js';
import { authRouter } from './realm-auth/routes/auth.js';
import { accountRouter } from './realm-auth/routes/account.js';
import { adminRouter } from './realm-auth/routes/admin.js';
import { requireAuth } from './realm-auth/middleware/requireAuth.js';
import { csrfGuard } from './realm-auth/middleware/csrfGuard.js';
import { requireRole } from './realm-auth/middleware/requireRole.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.use(express.json());
app.use(sessionMiddleware);

/* ── Public routes (no auth) ──────────────────────────── */

app.use('/api/auth', authLimiter, csrfGuard, authRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/pizafrontpageweb.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'pizafrontpageweb.png'));
});

/* ── Gated API routes (auth required) ─────────────────── */

app.use('/api/account', requireAuth, csrfGuard, accountRouter);
app.use('/api/admin', requireAuth, csrfGuard,
    requireRole('admin', 'superadmin'), adminRouter);

/* ── Gated pages (redirect to front if not signed in) ── */

function requireAuthPage(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect('/');
  }
  next();
}

app.get('/portal', requireAuthPage, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'portal.html'));
});

app.use('/public', requireAuthPage, express.static(path.join(__dirname, 'public')));

/* ── Catch-all ─────────────────────────────────────────── */

app.use((req, res) => {
  res.redirect('/');
});

/* ── Error handler ─────────────────────────────────────── */

app.use((err, req, res, next) => {
  console.error('[SERVER]', err.stack || err.message);
  res.status(500).json({ error: 'Something went wrong.' });
});

app.listen(PORT, () => {
  console.log(`Piza Sukeruton Realm listening on port ${PORT}`);
});
