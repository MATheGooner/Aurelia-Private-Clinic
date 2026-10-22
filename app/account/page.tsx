import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/container';
import { requireAuthenticatedUser } from '@/lib/auth/guards';
import { logoutAction } from './actions';

export const metadata: Metadata = { title: 'Secure account' };

export default async function AccountFoundationPage() {
  const actor = await requireAuthenticatedUser();
  return (
    <main className="min-h-screen py-12 sm:py-20">
      <Container className="max-w-3xl">
        <Link href="/" className="eyebrow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">Aurelia Private Clinic</Link>
        <section aria-labelledby="account-heading" className="mt-10 border border-border bg-surface p-6 sm:p-10">
          <p className="eyebrow">Protected route foundation</p>
          <h1 id="account-heading" className="mt-4 font-display text-4xl leading-tight sm:text-5xl">Secure account</h1>
          <p className="mt-5 text-muted">You are signed in as <span className="font-semibold text-ink">{actor.email}</span>.</p>
          <dl className="mt-8 border-y border-border py-5 text-sm">
            <div className="flex items-center justify-between gap-6">
              <dt className="text-muted">Access type</dt>
              <dd className="font-semibold">{actor.role.replace('_', ' ')}</dd>
            </div>
          </dl>
          <p className="mt-6 max-w-xl text-sm leading-6 text-muted">Role-specific workspaces will be introduced in a later phase. No patient, operational or clinical dashboard data is exposed here.</p>
          <form action={logoutAction} className="mt-8">
            <button type="submit" className="border border-ink px-5 py-3 text-sm font-semibold transition-colors hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">Sign out</button>
          </form>
        </section>
      </Container>
    </main>
  );
}
