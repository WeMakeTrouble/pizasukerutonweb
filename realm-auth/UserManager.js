/* ===========================================================================
 * Piza Sukeruton Realm — UserManager
 * Another Fine Product from We Make Trouble
 * ===========================================================================
 * The whole account store, kept deliberately small: name, email, password.
 * - Passwords are hashed with bcrypt (bcryptjs, cost 12). The raw password is
 *   never stored, logged, or returned.
 * - Login is timing-safe: a miss still runs a bcrypt compare so "no such email"
 *   and "wrong password" take the same time (resists account enumeration).
 * - Emails are normalised (trim + lowercase) so Casing@X.com == casing@x.com.
 * =========================================================================== */
import bcrypt from 'bcryptjs';
import { query } from './db.js';

const BCRYPT_COST = 12; // 10–13 sane range; higher = slower = harder to crack

// Cached throwaway hash, compared against on a missing email so failed logins
// cost the same as real ones.
let _dummyHash = null;
async function dummyHash() {
  if (!_dummyHash) _dummyHash = await bcrypt.hash('realm-no-such-user', BCRYPT_COST);
  return _dummyHash;
}

const normEmail = (e) => String(e ?? '').trim().toLowerCase();
const isEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

/** Create an account. Returns { ok, user } or { ok:false, error }. */
export async function createUser({ name, email, password }) {
  name = String(name ?? '').trim();
  email = normEmail(email);
  if (!name) return { ok: false, error: 'Please enter your name.' };
  if (!isEmail(email)) return { ok: false, error: 'Please enter a valid email.' };
  if (typeof password !== 'string' || password.length < 8) {
    return { ok: false, error: 'Password must be at least 8 characters.' };
  }
  if (password.length > 200) return { ok: false, error: 'That password is too long.' };

  const password_hash = await bcrypt.hash(password, BCRYPT_COST);
  try {
    const { rows } = await query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, password_hash]
    );
    return { ok: true, user: rows[0] };
  } catch (err) {
    if (err && err.code === '23505') return { ok: false, error: 'That email is already registered.' };
    throw err;
  }
}

/** Verify credentials. Returns the safe user object, or null. */
export async function authenticate(email, password) {
  email = normEmail(email);
  const { rows } = await query(
    `SELECT id, name, email, password_hash FROM users WHERE email = $1`, [email]
  );
  const user = rows[0];
  if (!user) { await bcrypt.compare(String(password ?? ''), await dummyHash()); return null; }
  const ok = await bcrypt.compare(String(password ?? ''), user.password_hash);
  return ok ? { id: user.id, name: user.name, email: user.email } : null;
}

/** Safe lookups — never select the hash. */
export async function findById(id) {
  const { rows } = await query(`SELECT id, name, email, created_at FROM users WHERE id = $1`, [id]);
  return rows[0] || null;
}
export async function findByEmail(email) {
  const { rows } = await query(
    `SELECT id, name, email, created_at FROM users WHERE email = $1`, [normEmail(email)]
  );
  return rows[0] || null;
}

/** Our resetPassword.js equivalent — rehash and store. */
export async function setPassword(email, password) {
  if (typeof password !== 'string' || password.length < 8) {
    return { ok: false, error: 'Password must be at least 8 characters.' };
  }
  const password_hash = await bcrypt.hash(password, BCRYPT_COST);
  const { rowCount } = await query(
    `UPDATE users SET password_hash = $1 WHERE email = $2`, [password_hash, normEmail(email)]
  );
  return rowCount ? { ok: true } : { ok: false, error: 'No account with that email.' };
}

export default { createUser, authenticate, findById, findByEmail, setPassword };
