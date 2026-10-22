import { and, asc, eq, gte } from 'drizzle-orm';
import type { AuthenticatedUser } from '@/lib/auth/types';
import { AuthorizationError, assertCapability, capabilities, hasCapability } from '@/lib/auth/permissions';
import { getDatabase } from '../client';
import { appointments } from '../schema';

// Deliberately excludes free-text reason and cancellation details from operational list responses.
const appointmentOperationalColumns = {
  id: appointments.id, referenceNumber: appointments.referenceNumber, patientId: appointments.patientId,
  departmentId: appointments.departmentId, treatmentId: appointments.treatmentId,
  practitionerId: appointments.practitionerId, startsAt: appointments.startsAt, endsAt: appointments.endsAt,
  durationMinutes: appointments.durationMinutes, patientType: appointments.patientType,
  status: appointments.status, createdAt: appointments.createdAt, updatedAt: appointments.updatedAt,
};

export async function listUpcomingAppointmentsForPatient(actor: AuthenticatedUser, patientId: string, from = new Date()) {
  const mayReadAll = hasCapability(actor.role, capabilities.appointmentRead);
  const mayReadOwn = hasCapability(actor.role, capabilities.appointmentReadOwn) && actor.patientId === patientId;
  if (!mayReadAll && !mayReadOwn) throw new AuthorizationError();
  return getDatabase().select(appointmentOperationalColumns).from(appointments)
    .where(and(eq(appointments.patientId, patientId), gte(appointments.startsAt, from))).orderBy(asc(appointments.startsAt));
}

export async function listPractitionerAppointments(actor: AuthenticatedUser, practitionerId: string, from: Date) {
  assertCapability(actor, capabilities.appointmentRead);
  return getDatabase().select(appointmentOperationalColumns).from(appointments)
    .where(and(eq(appointments.practitionerId, practitionerId), gte(appointments.startsAt, from))).orderBy(asc(appointments.startsAt));
}

export type NewAppointment = typeof appointments.$inferInsert;
export async function createAppointmentRecord(actor: AuthenticatedUser, appointment: NewAppointment) {
  assertCapability(actor, capabilities.appointmentWrite);
  const [created] = await getDatabase().insert(appointments)
    .values({ ...appointment, createdByUserId: actor.userId }).returning(appointmentOperationalColumns);
  return created;
}
