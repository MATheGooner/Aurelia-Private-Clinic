import { and, eq, gt, isNull, sql } from 'drizzle-orm';
import { getDatabase } from '@/lib/db/client';
import { authCredentials, authSessions, patientProfiles, practitioners, staffProfiles, users } from '@/lib/db/schema';
import { performDummyPasswordCheck, verifyPassword } from './password';
import { createSessionToken, hashSessionToken } from './session-token';

const maximumFailures = 5;
const lockMinutes = 15;
const sessionHours = 8;

export class AuthenticationError extends Error {
  constructor(message = 'The email address or password is incorrect.') { super(message); this.name = 'AuthenticationError'; }
}

export async function authenticate(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const db = getDatabase();
  const [record] = await db.select({
    userId: users.id, email: users.email, role: users.role, status: users.status,
    passwordHash: authCredentials.passwordHash, failedAttempts: authCredentials.failedAttempts,
    lockedUntil: authCredentials.lockedUntil, patientId: patientProfiles.id,
    staffProfileId: staffProfiles.id, practitionerId: practitioners.id,
  }).from(users)
    .innerJoin(authCredentials, eq(authCredentials.userId, users.id))
    .leftJoin(patientProfiles, eq(patientProfiles.userId, users.id))
    .leftJoin(staffProfiles, eq(staffProfiles.userId, users.id))
    .leftJoin(practitioners, eq(practitioners.staffProfileId, staffProfiles.id))
    .where(sql`lower(${users.email}) = ${normalized}`).limit(1);
  if (!record) { await performDummyPasswordCheck(password); throw new AuthenticationError(); }
  if (record.status !== 'ACTIVE') throw new AuthenticationError('This account is not active.');
  if (record.lockedUntil && record.lockedUntil > new Date()) throw new AuthenticationError('This account is temporarily locked. Please try again later.');
  if (!await verifyPassword(password, record.passwordHash)) {
    const failures = record.failedAttempts + 1;
    await db.update(authCredentials).set({
      failedAttempts: failures,
      lockedUntil: failures >= maximumFailures ? new Date(Date.now() + lockMinutes * 60_000) : null,
      updatedAt: new Date(),
    }).where(eq(authCredentials.userId, record.userId));
    throw new AuthenticationError();
  }
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + sessionHours * 60 * 60_000);
  await db.transaction(async tx => {
    await tx.update(authCredentials).set({ failedAttempts: 0, lockedUntil: null, updatedAt: new Date() }).where(eq(authCredentials.userId, record.userId));
    await tx.update(users).set({ lastLoginAt: new Date(), updatedAt: new Date() }).where(eq(users.id, record.userId));
    await tx.insert(authSessions).values({ userId: record.userId, tokenHash: hashSessionToken(token), expiresAt });
  });
  return { token, expiresAt, user: { userId: record.userId, email: record.email, role: record.role, patientId: record.patientId, staffProfileId: record.staffProfileId, practitionerId: record.practitionerId } };
}

export async function resolveSession(token: string) {
  const [record] = await getDatabase().select({
    sessionId: authSessions.id, userId: users.id, email: users.email, role: users.role,
    status: users.status, patientId: patientProfiles.id, staffProfileId: staffProfiles.id, practitionerId: practitioners.id,
  }).from(authSessions)
    .innerJoin(users, eq(users.id, authSessions.userId))
    .leftJoin(patientProfiles, eq(patientProfiles.userId, users.id))
    .leftJoin(staffProfiles, eq(staffProfiles.userId, users.id))
    .leftJoin(practitioners, eq(practitioners.staffProfileId, staffProfiles.id))
    .where(and(eq(authSessions.tokenHash, hashSessionToken(token)), isNull(authSessions.revokedAt), gt(authSessions.expiresAt, new Date()))).limit(1);
  if (!record || record.status !== 'ACTIVE') return null;
  return { sessionId: record.sessionId, user: { userId: record.userId, email: record.email, role: record.role, patientId: record.patientId, staffProfileId: record.staffProfileId, practitionerId: record.practitionerId } };
}

export async function revokeSession(token: string) {
  await getDatabase().update(authSessions).set({ revokedAt: new Date() }).where(eq(authSessions.tokenHash, hashSessionToken(token)));
}
