import Link from 'next/link';
import { Container } from '@/components/container';
import { Section } from '@/components/section';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { departmentPages } from '@/lib/department-data';
import { treatmentsByDepartment } from '@/lib/treatment-data';

export const metadata = { title: 'Treatments', description: 'Browse private treatments available through Aurelia Private Clinic.' };
export default function TreatmentsPage() {
  return <><SiteHeader /><main>
    <section className="border-b border-border bg-surface"><Container className="py-16 sm:py-24"><p className="eyebrow">Treatments and consultations</p><h1 className="mt-5 max-w-4xl font-display text-5xl leading-tight sm:text-7xl">Find the care that fits your needs.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted">Browse by department. A clinician will always confirm suitability following an individual assessment.</p></Container></section>
    {departmentPages.map(department => <Section id={department.slug} key={department.slug}><Container><div className="grid gap-8 lg:grid-cols-[.35fr_.65fr]"><div><p className="eyebrow">{department.name}</p><h2 className="mt-4 font-display text-4xl">{department.shortDescription}</h2></div><div className="divide-y divide-border border-y border-border">{(treatmentsByDepartment[department.slug] ?? []).map(treatment => <Link className="group grid gap-3 py-5 sm:grid-cols-[1fr_auto] sm:items-center" href={`/treatments/${treatment.slug}`} key={treatment.slug}><span><strong className="font-medium">{treatment.name}</strong><span className="mt-1 block text-muted">{treatment.shortDescription}</span></span><span className="text-accent">{treatment.price} →</span></Link>)}</div></div></Container></Section>)}
  </main><SiteFooter /></>;
}
