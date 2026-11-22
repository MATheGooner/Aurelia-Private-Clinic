import { Container } from '@/components/container';
import { Section } from '@/components/section';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const items = [
  ['Do I need a referral?', 'Most Aurelia appointments can be booked directly.'],
  ['How are fees confirmed?', 'Your clinician will explain costs before further care is agreed.'],
];

export default function Page() {
  return <><SiteHeader /><main><Section><Container className="max-w-4xl"><h1 className="font-display text-6xl">Frequently asked questions</h1><div className="mt-10 divide-y border-y">{items.map(([question, answer]) => <details className="py-5" key={question}><summary className="font-medium">{question}</summary><p className="pt-3 text-muted">{answer}</p></details>)}</div></Container></Section></main><SiteFooter /></>;
}

