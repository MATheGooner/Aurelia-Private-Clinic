import { cookies } from 'next/headers';
import type { AuthenticatedUser } from './types';
import { resolveSession, revokeSession } from './auth';

const cookieName = 'aurelia_session';

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const token = cookies().get(cookieName)?.value;
  if (!token) return null;
  return (await resolveSession(token))?.user ?? null;
}

export function setSessionCookie(token: string, expiresAt: Date): void {
  cookies().set(cookieName, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', expires: expiresAt });
}

export async function revokeCurrentSession(): Promise<void> {
  const token = cookies().get(cookieName)?.value;
  if (token) await revokeSession(token);
  cookies().set(cookieName, '', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', expires: new Date(0) });
}
