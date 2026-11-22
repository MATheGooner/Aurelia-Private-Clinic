import { Container } from '@/components/container';
import { Section } from '@/components/section';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function Page() {
  return <><SiteHeader /><main><Section><Container className="grid gap-12 lg:grid-cols-2"><div><p className="eyebrow">Contact Aurelia</p><h1 className="mt-4 font-display text-6xl">How can we help?</h1><address className="mt-7 not-italic leading-8">24 Harley Street<br />London W1G 9PH<br />020 7946 0182<br />hello@aureliaclinic.co.uk</address></div><form className="grid gap-4 border bg-surface p-6"><p className="border-l-2 border-accent pl-4 text-sm text-muted">This is a demonstration. Do not enter real medical information.</p><input className="auth-field" placeholder="Name" /><input className="auth-field" type="email" placeholder="Email" /><textarea className="auth-field min-h-32" placeholder="How can we help?" /><button className="bg-accent px-5 py-3 text-white" type="button">Send enquiry</button></form></Container></Section></main><SiteFooter /></>;
}

