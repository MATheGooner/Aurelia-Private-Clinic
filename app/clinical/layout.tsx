import Image from 'next/image';
import Link from 'next/link';
import { requireClinicalWorkspace } from '@/lib/auth/guards';
import { logoutAction } from '@/app/account/actions';

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireClinicalWorkspace();
  return <div className="min-h-screen bg-canvas"><header className="border-b bg-surface"><div className="mx-auto flex max-w-site justify-between p-5"><Link href="/clinical" className="flex items-center gap-3 font-display text-2xl"><Image src="/brand/aurelia-icon.png" alt="Aurelia Private Clinic" width={40} height={40} className="h-10 w-10" />Aurelia Clinical</Link><form action={logoutAction}><button>Sign out</button></form></div><nav className="mx-auto flex max-w-site gap-6 px-5 pb-4"><Link href="/clinical">Schedule</Link><Link href="/clinical/patients">Patients</Link></nav></header><main className="mx-auto max-w-site p-5 py-10">{children}</main></div>;
}

