import { BookingWizard } from '@/components/booking-wizard';
import { Container } from '@/components/container';
import { Section } from '@/components/section';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function Page({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  return <><SiteHeader /><main><section className="border-b bg-surface"><Container className="py-14 sm:py-16"><p className="eyebrow">Appointments</p><h1 className="mt-4 font-display text-6xl">Request an appointment.</h1></Container></section><Section><Container className="max-w-3xl"><p className="mb-6 border-l-2 border-accent pl-4 text-sm text-muted">This is a demonstration. Do not enter real medical information.</p><BookingWizard initialDepartment={searchParams.department} initialTreatment={searchParams.treatment} initialPractitioner={searchParams.practitioner} /></Container></Section></main><SiteFooter /></>;
}

