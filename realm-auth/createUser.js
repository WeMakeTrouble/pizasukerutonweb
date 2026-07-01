/* ===========================================================================
 * Piza Sukeruton Realm — create a user from the command line
 * Another Fine Product from We Make Trouble
 * ===========================================================================
 * Our equivalent of createAdmin.js, minus the admin flag (accounts store only
 * name / email / password). Run:
 *   node realm-auth/createUser.js "James Straker" james@example.com "a-strong-password"
 * =========================================================================== */
import 'dotenv/config';
import { createUser } from './UserManager.js';
import { pool } from './db.js';

const [, , name, email, password] = process.argv;

if (!name || !email || !password) {
  console.log('Usage: node realm-auth/createUser.js "Full Name" email@example.com password');
  process.exit(1);
}

const result = await createUser({ name, email, password });
console.log(result.ok
  ? `Created user #${result.user.id} — ${result.user.email}`
  : `Failed: ${result.error}`);

await pool.end();
process.exit(result.ok ? 0 : 1);
