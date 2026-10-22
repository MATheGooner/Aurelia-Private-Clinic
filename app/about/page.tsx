import { Container } from '@/components/container';
import { EditorialImage } from '@/components/editorial-image';
import { Section } from '@/components/section';
import { SectionHeading } from '@/components/section-heading';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export const metadata = { title: 'About Aurelia', description: 'A calm, connected approach to private healthcare in Manchester.' };
export default function AboutPage() {
  return <><SiteHeader /><main>
    <section className="border-b border-border bg-surface"><Container className="grid gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:items-end"><div><p className="eyebrow">About Aurelia</p><h1 className="mt-5 font-display text-5xl leading-tight sm:text-7xl">Private care with more time and clarity.</h1></div><p className="max-w-xl text-lg leading-8 text-muted">Aurelia brings primary care, dentistry and specialist services together in one considered Manchester clinic.</p></Container></section>
    <Section><Container className="grid gap-12 lg:grid-cols-2 lg:items-center"><div className="relative aspect-[4/3] overflow-hidden"><EditorialImage src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=85" alt="Calm private clinic interior" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" /></div><SectionHeading eyebrow="Our approach" title="Thoughtful care, connected around you." intro="We give clinicians room to listen, explain and coordinate appropriate next steps. The aim is a calmer experience without losing clinical rigour." /></Container></Section>
    <Section className="bg-surface"><Container><SectionHeading eyebrow="What matters to us" title="A clear standard of private care." /><div className="mt-12 grid gap-8 md:grid-cols-3">{[['Time','Appointments designed for careful listening and assessment.'],['Clarity','Straightforward explanations of findings, options and fees.'],['Continuity','Joined-up care and useful follow-up across departments.']].map(([title,copy]) => <div className="border-t border-accent pt-5" key={title}><h2 className="font-display text-3xl">{title}</h2><p className="mt-3 leading-7 text-muted">{copy}</p></div>)}</div></Container></Section>
  </main><SiteFooter /></>;
}
