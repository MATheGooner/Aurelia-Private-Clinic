import Link from 'next/link';
import { Container } from '@/components/container';
import { EditorialImage } from '@/components/editorial-image';
import { Section } from '@/components/section';
import { SectionHeading } from '@/components/section-heading';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { departmentPages } from '@/lib/department-data';

export const metadata = { title: 'Services', description: 'Explore Aurelia Private Clinic departments and private healthcare services.' };
export default function ServicesPage() {
  return <><SiteHeader /><main>
    <section className="border-b border-border bg-surface"><Container className="py-16 sm:py-24"><p className="eyebrow">Our clinical departments</p><h1 className="mt-5 max-w-4xl font-display text-5xl leading-tight sm:text-7xl">Connected private care, thoughtfully organised.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted">Explore Aurelia’s multidisciplinary services and find an appropriate starting point for your care.</p></Container></section>
    <Section><Container><SectionHeading eyebrow="Care at Aurelia" title="Our departments" /><div className="mt-12 grid gap-8 md:grid-cols-2">{departmentPages.map(department => <Link className="group" href={`/services/${department.slug}`} key={department.slug}><div className="relative aspect-[16/10] overflow-hidden"><EditorialImage src={department.heroImage} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 768px) 50vw, 100vw" /></div><h2 className="mt-5 font-display text-3xl">{department.name}</h2><p className="mt-2 leading-7 text-muted">{department.shortDescription}</p><span className="mt-4 inline-block text-accent group-hover:underline">Explore department →</span></Link>)}</div></Container></Section>
  </main><SiteFooter /></>;
}
