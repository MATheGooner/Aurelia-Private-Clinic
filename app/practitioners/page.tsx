import type { Metadata } from 'next';
import { Container } from '@/components/container';
import { PractitionerDirectory } from '@/components/practitioner-directory';
import { Section } from '@/components/section';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { practitioners } from '@/lib/practitioner-data';

export const metadata: Metadata = { title: 'Practitioners', description: 'Meet the fictional multidisciplinary clinical team at Aurelia Private Clinic in Manchester.' };

export default function PractitionersPage() {
  return <><SiteHeader /><main><section className="border-b border-border bg-surface"><Container className="grid gap-10 py-20 sm:py-28 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="eyebrow">Our clinical team</p><h1 className="mt-5 font-display text-5xl leading-tight sm:text-7xl">People who take time to listen.</h1></div><p className="max-w-xl text-lg leading-8 text-muted">Meet Aurelia’s fictional multidisciplinary team of doctors, dentists, hygienists and physiotherapists. Every profile and availability preview is portfolio-demo content.</p></Container></section><Section><Container><PractitionerDirectory practitioners={practitioners} /></Container></Section></main><SiteFooter /></>;
}
