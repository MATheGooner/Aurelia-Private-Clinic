'use server';
import { redirect } from 'next/navigation';
import { authenticate, AuthenticationError } from '@/lib/auth/auth';
import { setSessionCookie } from '@/lib/auth/session';

export type LoginState = { error?: string };
export async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  try {
    const result = await authenticate(String(formData.get('email') ?? ''), String(formData.get('password') ?? ''));
    setSessionCookie(result.token, result.expiresAt);
  } catch (error) {
    return { error: error instanceof AuthenticationError ? error.message : 'Sign in could not be completed.' };
  }
  redirect('/account');
}
