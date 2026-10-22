import '../lib/env/load-script-env';
import { sql } from 'drizzle-orm';
import { hashPassword } from '../lib/auth/password';
import { closeDatabaseConnection, getDatabase } from '../lib/db/client';
import { authCredentials, users } from '../lib/db/schema';

async function main() {
  const email = process.argv[2].trim().toLowerCase();
  const password = process.env.AURELIA_PASSWORD;
  if (!email || !password) {
    throw new Error('Usage: set AURELIA_PASSWORD temporarily, then run npm run auth:set-password -- user@example.com');
  }

  const [user] = await getDatabase().select({ id: users.id }).from(users).where(sql`lower(${users.email}) = ${email}`).limit(1);
  if (!user) throw new Error(`No Aurelia user exists for ${email}.`);

  const passwordHash = await hashPassword(password);
  const [credential] = await getDatabase().insert(authCredentials).values({ userId: user.id, passwordHash }).onConflictDoUpdate({
    target: authCredentials.userId,
    set: { passwordHash, failedAttempts: 0, lockedUntil: null, passwordChangedAt: new Date(), updatedAt: new Date() },
  }).returning({ userId: authCredentials.userId });
  if (!credential || credential.userId !== user.id) throw new Error(`Password credential was not persisted for ${email}.`);
  console.log(`Password credential updated for ${email}.`);
}

async function run() {
  try {
    await main();
  } catch (error) {
    console.error('Password provisioning failed.', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    try {
      await closeDatabaseConnection();
    } catch (error) {
      console.error('Password provisioning failed while closing the database connection.', error instanceof Error ? error.message : error);
      process.exitCode = 1;
    }
  }
}

void run();
