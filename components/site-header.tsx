'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from './button';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-40 border-b border-border/80 bg-canvas/95 backdrop-blur-sm">
    <div className="mx-auto flex max-w-site items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
      <Link href="/" className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label="Aurelia Private Clinic home">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent text-sm text-accent">A</span>
        <span className="font-display text-xl tracking-tight">Aurelia <span className="hidden sm:inline">Private Clinic</span></span>
      </Link>
      <button className="rounded-sm p-2 text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation"><span className="sr-only">Toggle navigation</span><span aria-hidden="true">{open ? '×' : '☰'}</span></button>
      <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
        <Link className="nav-link" href="/services">Services</Link><Link className="nav-link" href="/practitioners">Practitioners</Link><Link className="nav-link" href="/fees">Fees</Link><Link className="nav-link" href="/about">About</Link><Link className="nav-link" href="/contact">Contact</Link><Button href="/book">Book Appointment</Button>
      </nav>
    </div>
    {open && <nav id="mobile-navigation" className="border-t border-border bg-canvas px-5 py-5 lg:hidden" aria-label="Mobile navigation"><div className="flex flex-col gap-1"><Link className="mobile-nav-link" href="/services" onClick={() => setOpen(false)}>Services</Link><Link className="mobile-nav-link" href="/practitioners" onClick={() => setOpen(false)}>Practitioners</Link><Link className="mobile-nav-link" href="/fees" onClick={() => setOpen(false)}>Fees</Link><Link className="mobile-nav-link" href="/about" onClick={() => setOpen(false)}>About</Link><Link className="mobile-nav-link" href="/contact" onClick={() => setOpen(false)}>Contact</Link><Button href="/book" className="mt-3">Book Appointment</Button></div></nav>}
  </header>;
}
