import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Aurelia Private Clinic', template: '%s | Aurelia Private Clinic' },
  description: 'Private healthcare in Manchester, with time, expertise and attention devoted to you.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB"><body>{children}</body></html>;
}
