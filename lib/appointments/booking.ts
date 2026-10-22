import { randomBytes } from 'node:crypto';
import type { AuthenticatedUser } from '@/lib/auth/types';
import { persistBooking, AppointmentConflictError, type PersistBookingInput } from '@/lib/db/repositories/booking';
import { getAvailability } from './availability';
import { validateBookingRequest, type BookingRequest } from './validation';

type AvailabilityResult = Awaited<ReturnType<typeof getAvailability>>;
type Persisted = Awaited<ReturnType<typeof persistBooking>>;
type Dependencies = {
  availability?: (request: { department: string; treatment?: string; practitioner?: string; fromDate: string; toDate: string }) => Promise<AvailabilityResult>;
  persist?: (input: PersistBookingInput) => Promise<Persisted>;
  reference?: () => string;
  patientNumber?: () => string;
};

export async function bookAppointment(raw: unknown, actor: AuthenticatedUser | null, dependencies: Dependencies = {}) {
  const request = validateBookingRequest(raw);
  if (actor && actor.role !== 'PATIENT') throw new Error('Staff accounts cannot use the patient booking journey.');
  if (actor?.role === 'PATIENT' && !actor.patientId) throw new Error('Your account is not linked to a patient profile.');
  const selected = new Date(request.startsAt);
  const date = selected.toLocaleDateString('en-CA', { timeZone: 'Europe/London' });
  const availability = await (dependencies.availability ?? getAvailability)({
    department: request.department, treatment: request.treatment, practitioner: request.practitioner,
    fromDate: date, toDate: date,
  });
  const slot = availability.slots.find(item => item.practitionerSlug === request.practitioner && item.startsAt === selected.toISOString());
  if (!slot) throw new AppointmentConflictError('That appointment is no longer available.');
  const reference = (dependencies.reference ?? createReference)();
  const input: PersistBookingInput = {
    referenceNumber: reference, patientId: actor?.patientId ?? undefined,
    publicPatient: actor?.patientId ? undefined : publicPatient(request, dependencies.patientNumber),
    departmentId: availability.department.id, treatmentId: availability.treatment?.id ?? null,
    practitionerId: slot.practitionerId, startsAt: new Date(slot.startsAt), endsAt: new Date(slot.endsAt),
    durationMinutes: slot.durationMinutes, reason: request.reason ?? null,
    patientType: actor?.patientId ? 'EXISTING' : request.patientType, creatorUserId: actor?.userId ?? null,
  };
  const persisted = await (dependencies.persist ?? persistBooking)(input);
  return { id: persisted.id, reference: persisted.referenceNumber, startsAt: persisted.startsAt.toISOString(), endsAt: persisted.endsAt.toISOString(), status: persisted.status };
}

function publicPatient(request: BookingRequest, factory: (() => string) | undefined) {
  if (!request.firstName || !request.lastName || !request.email || !request.phone || !request.dateOfBirth) throw new Error('Contact and identity details are required for a new patient.');
  return { patientNumber: (factory ?? createPatientNumber)(), firstName: request.firstName, lastName: request.lastName, email: request.email, phone: request.phone, dateOfBirth: request.dateOfBirth };
}
function createReference() { return `AUR-${Date.now().toString(36).toUpperCase()}-${randomBytes(3).toString('hex').toUpperCase()}`; }
function createPatientNumber() { return `AUR-${Date.now().toString().slice(-8)}-${randomBytes(2).toString('hex').toUpperCase()}`; }
