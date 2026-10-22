import { and, asc, desc, eq, gte, ilike, lte, or } from 'drizzle-orm';
import type { AuthenticatedUser } from '@/lib/auth/types';
import { assertAdminWorkspace } from './access';
import { getDatabase } from '@/lib/db/client';
import { appointments, checkIns, departments, patientProfiles, practitioners, staffProfiles, treatments } from '@/lib/db/schema';

export async function adminAppointments(actor: AuthenticatedUser, filters: { from?: string; to?: string; status?: string } = {}) {
  assertAdminWorkspace(actor);
  const conditions = [
    filters.from ? gte(appointments.startsAt, new Date(filters.from)) : undefined,
    filters.to ? lte(appointments.startsAt, new Date(filters.to)) : undefined,
    filters.status ? eq(appointments.status, filters.status as typeof appointments.status.enumValues[number]) : undefined,
  ];
  return getDatabase().select({
    id: appointments.id, referenceNumber: appointments.referenceNumber, startsAt: appointments.startsAt,
    endsAt: appointments.endsAt, status: appointments.status, patientId: appointments.patientId,
    patientFirstName: patientProfiles.firstName, patientLastName: patientProfiles.lastName,
    departmentName: departments.name, treatmentName: treatments.name,
    practitionerFirstName: staffProfiles.firstName, practitionerLastName: staffProfiles.lastName,
  }).from(appointments).innerJoin(patientProfiles, eq(patientProfiles.id, appointments.patientId))
    .innerJoin(departments, eq(departments.id, appointments.departmentId))
    .leftJoin(treatments, eq(treatments.id, appointments.treatmentId))
    .leftJoin(practitioners, eq(practitioners.id, appointments.practitionerId))
    .leftJoin(staffProfiles, eq(staffProfiles.id, practitioners.staffProfileId))
    .where(and(...conditions)).orderBy(asc(appointments.startsAt));
}

export async function adminAppointment(actor: AuthenticatedUser, id: string) {
  assertAdminWorkspace(actor);
  const [row] = await getDatabase().select().from(appointments).where(eq(appointments.id, id)).limit(1);
  return row;
}

export async function adminPatients(actor: AuthenticatedUser, query = '') {
  assertAdminWorkspace(actor);
  const term = query.trim();
  return getDatabase().select().from(patientProfiles).where(term ? or(
    ilike(patientProfiles.firstName, `%${term}%`), ilike(patientProfiles.lastName, `%${term}%`),
    ilike(patientProfiles.email, `%${term}%`), ilike(patientProfiles.patientNumber, `%${term}%`),
  ) : undefined).orderBy(desc(patientProfiles.updatedAt)).limit(100);
}

export async function adminPatient(actor: AuthenticatedUser, id: string) {
  assertAdminWorkspace(actor);
  const [patient] = await getDatabase().select().from(patientProfiles).where(eq(patientProfiles.id, id)).limit(1);
  return patient;
}

export async function activeCheckIn(appointmentId: string) {
  const [row] = await getDatabase().select().from(checkIns).where(and(eq(checkIns.appointmentId, appointmentId), eq(checkIns.reversedAt, null as never))).limit(1);
  return row;
}
