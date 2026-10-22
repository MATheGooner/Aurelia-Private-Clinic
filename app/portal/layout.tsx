import Image from 'next/image';
import Link from 'next/link';
import { requirePatientPortal } from '@/lib/auth/guards';
import { logoutAction } from '@/app/account/actions';

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requirePatientPortal();
  return <div className="min-h-screen bg-canvas"><header className="border-b bg-surface"><div className="mx-auto flex max-w-site items-center justify-between px-4 py-5"><Link href="/portal" className="flex items-center gap-3 font-display text-2xl"><Image src="/brand/aurelia-icon.png" alt="Aurelia Private Clinic" width={40} height={40} className="h-10 w-10" />Aurelia</Link><form action={logoutAction}><button>Sign out</button></form></div><nav className="mx-auto flex max-w-site gap-5 overflow-x-auto px-4 pb-4 text-sm"><Link href="/portal">Overview</Link><Link href="/portal/appointments">Appointments</Link><Link href="/portal/records">Records</Link><Link href="/portal/prescriptions">Prescriptions</Link><Link href="/portal/documents">Documents</Link><Link href="/portal/profile">Profile</Link></nav></header><main className="mx-auto max-w-site p-4 py-8 sm:p-8">{children}</main></div>;
}

