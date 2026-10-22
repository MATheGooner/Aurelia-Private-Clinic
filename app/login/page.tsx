'use client';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { loginAction } from './actions';

export default function LoginPage() {
  const [state, action] = useFormState(loginAction, {});
  return <main className="grid min-h-screen place-items-center bg-canvas p-5"><div className="w-full max-w-md border border-border bg-surface p-8">
    <Link href="/" aria-label="Aurelia Private Clinic home" className="inline-block"><Image src="/brand/aurelia-icon.png" alt="Aurelia Private Clinic" width={64} height={64} className="h-16 w-16" priority /></Link><p className="eyebrow mt-10">Secure account access</p>
    <h1 className="mt-3 font-display text-4xl">Sign in</h1><p className="mt-3 text-muted">Use your Aurelia account credentials.</p>
    <form action={action} className="mt-8 space-y-5">
      <label className="block font-medium">Email address<input className="auth-field mt-2" name="email" type="email" autoComplete="email" required /></label>
      <label className="block font-medium">Password<input className="auth-field mt-2" name="password" type="password" autoComplete="current-password" required /></label>
      {state.error && <p role="alert" className="text-red-800">{state.error}</p>}
      <button className="min-h-12 w-full bg-accent px-5 font-medium text-white">Sign in</button>
    </form>
  </div></main>;
}
