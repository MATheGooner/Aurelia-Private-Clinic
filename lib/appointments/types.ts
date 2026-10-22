export type AvailabilityPractitioner = {
  id: string;
  slug: string;
  name: string;
  durationMinutes: number;
  eligible: boolean;
};

export type AvailabilityRule = {
  practitionerId: string;
  day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  startTime: string;
  endTime: string;
  effectiveFrom: string | null;
  effectiveTo: string | null;
};

export type BusyPeriod = { practitionerId: string; startsAt: Date; endsAt: Date };

export type AppointmentSlot = {
  practitionerId: string;
  practitionerSlug: string;
  practitionerName: string;
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
};

export type AvailabilityDataset = {
  practitioners: AvailabilityPractitioner[];
  rules: AvailabilityRule[];
  exceptions: BusyPeriod[];
  appointments: BusyPeriod[];
};
