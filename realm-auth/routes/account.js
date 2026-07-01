/* ===========================================================================
 * Piza Sukeruton Realm — account routes  (mounted at /api/account)
 * Another Fine Product from We Make Trouble
 * ===========================================================================
 *   GET   /api/account/profile          -> { user, stats }
 *   PATCH /api/account/profile          -> { ok, user }
 *   POST  /api/account/profile          -> alias for PATCH (front-end compat)
 *   POST  /api/account/change-password  -> { ok }
 *   GET   /api/account/orders           -> { orders }
 *   GET   /api/account/codes            -> { codes }
 *
 * All routes are behind requireAuth (wired by the consumer).
 * User ID is req.userId (varchar(7) hex, e.g. '#A3F2B1').
 *
 * Tables read:
 *   users            (realm-auth owned)
 *   merch_orders     (commerce, bicameral_sweep_17)
 *   purchase_codes   (commerce, bicameral_sweep_17)
 *
 * No writes to commerce tables — read only. Writes only to users
 * (name update, password change).
 * =========================================================================== */
import { Router } from 'express';
import { query } from '../db.js';
import { authenticate, setPassword } from '../UserManager.js';
import { getRoles } from '../RoleManager.js';

export const accountRouter = Router();

/* ── helpers ────────────────────────────────────────────────────────────── */

function memberSinceLabel(createdAt) {
  const d = new Date(createdAt);
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

/* ── GET /profile ───────────────────────────────────────────────────────── */

accountRouter.get('/profile', async (req, res, next) => {
  try {
    // user row (safe — requireAuth already verified existence)
    const { rows: userRows } = await query(
      `SELECT id, name, email, created_at FROM users WHERE id = $1`,
      [req.userId]
    );
    const user = userRows[0];
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // active roles for this user
    const roles = await getRoles(req.userId);

    // stats — computed from joins, never stored
    const { rows: orderStats } = await query(
      `SELECT count(*) AS total_orders,
              coalesce(sum((SELECT sum((e->>'qty')::int)
                            FROM jsonb_array_elements(selections) e)), 0) AS total_units
       FROM merch_orders
       WHERE user_id = $1 AND status IN ('paid','fulfilled')`,
      [req.userId]
    );

    const { rows: codeStats } = await query(
      `SELECT count(*) AS total_claimed
       FROM purchase_codes
       WHERE claimed_by = $1 AND is_claimed = true`,
      [req.userId]
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        member_since_label: memberSinceLabel(user.created_at),
        roles: roles,
      },
      stats: {
        total_orders: parseInt(orderStats[0].total_orders, 10),
        total_units: parseInt(orderStats[0].total_units, 10) || 0,
        total_codes_claimed: parseInt(codeStats[0].total_claimed, 10),
      },
    });
  } catch (err) { next(err); }
});

/* ── PATCH /profile (+ POST alias) ──────────────────────────────────────── */

async function updateProfile(req, res, next) {
  try {
    const name = typeof req.body.name === 'string'
      ? req.body.name.trim()
      : null;

    if (!name || name.length === 0) {
      return res.status(400).json({ error: 'Name cannot be empty.' });
    }
    if (name.length > 200) {
      return res.status(400).json({ error: 'Name is too long (200 chars max).' });
    }

    const { rows } = await query(
      `UPDATE users SET name = $1 WHERE id = $2
       RETURNING id, name, email`,
      [name, req.userId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User not found.' });

    // keep session in sync
    req.session.name = rows[0].name;

    res.json({ ok: true, user: rows[0] });
  } catch (err) { next(err); }
}

accountRouter.patch('/profile', updateProfile);
accountRouter.post('/profile', updateProfile);

/* ── POST /change-password ──────────────────────────────────────────────── */

accountRouter.post('/change-password', async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body || {};

    if (!current_password || typeof current_password !== 'string') {
      return res.status(400).json({ error: 'Please enter your current password.' });
    }
    if (!new_password || typeof new_password !== 'string' || new_password.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters.' });
    }
    if (new_password.length > 200) {
      return res.status(400).json({ error: 'That password is too long.' });
    }

    // verify current password using the existing authenticate() —
    // we need the email for that
    const { rows } = await query(
      `SELECT email FROM users WHERE id = $1`, [req.userId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User not found.' });

    const verified = await authenticate(rows[0].email, current_password);
    if (!verified) {
      return res.status(403).json({ error: 'Current password is incorrect.' });
    }

    const result = await setPassword(rows[0].email, new_password);
    if (!result.ok) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ ok: true });
  } catch (err) { next(err); }
});

/* ── GET /orders ────────────────────────────────────────────────────────── */

accountRouter.get('/orders', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT o.id, o.drop_id, o.region_id, o.selections,
              o.base_price_cents, o.total_upcharge_cents, o.total_paid_cents,
              o.status, o.created_at,
              (SELECT jsonb_agg(jsonb_build_object(
                'code', c.code,
                'code_type', c.code_type,
                'claimed_at', c.claimed_at,
                              ) ORDER BY c.claimed_at)
              FROM purchase_codes c
              WHERE c.claimed_by = o.user_id AND c.is_claimed = true
              ) AS codes
       FROM merch_orders o
       WHERE o.user_id = $1 AND o.status IN ('paid','fulfilled')
       ORDER BY o.created_at DESC`,
      [req.userId]
    );

    // Parse selections from jsonb if needed, ensure codes is array
    const orders = rows.map(o => ({
      ...o,
      selections: typeof o.selections === 'string'
        ? JSON.parse(o.selections)
        : o.selections || [],
      codes: o.codes || [],
    }));

    res.json({ orders });
  } catch (err) { next(err); }
});

/* ── GET /codes ─────────────────────────────────────────────────────────── */

accountRouter.get('/codes', async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT code, code_type, is_claimed, claimed_at,
              batch_label
       FROM purchase_codes
       WHERE claimed_by = $1 AND is_claimed = true
       ORDER BY claimed_at DESC`,
      [req.userId]
    );

    res.json({ codes: rows });
  } catch (err) { next(err); }
});

export default accountRouter;
