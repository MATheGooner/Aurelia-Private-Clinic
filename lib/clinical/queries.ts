import { and, asc, desc, eq, gte, inArray } from 'drizzle-orm';
import type { AuthenticatedUser } from '@/lib/auth/types';
import { assertClinicalAuthor } from './access';
import { getDatabase } from '@/lib/db/client';
import { appointments, clinicalEncounters, clinicalNotes, departments, patientAlerts, patientProfiles, prescriptions, prescriptionItems, testResults, treatments } from '@/lib/db/schema';

export async function clinicianAppointments(actor: AuthenticatedUser) {
  assertClinicalAuthor(actor);
  return getDatabase().select({
    id: appointments.id, patientId: appointments.patientId, startsAt: appointments.startsAt, status: appointments.status,
    reason: appointments.reason, firstName: patientProfiles.firstName, lastName: patientProfiles.lastName,
    department: departments.name, treatment: treatments.name,
  }).from(appointments).innerJoin(patientProfiles, eq(patientProfiles.id, appointments.patientId))
    .innerJoin(departments, eq(departments.id, appointments.departmentId))
    .leftJoin(treatments, eq(treatments.id, appointments.treatmentId))
    .where(and(eq(appointments.practitionerId, actor.practitionerId), gte(appointments.startsAt, new Date(Date.now() - 86_400_000))))
    .orderBy(asc(appointments.startsAt));
}

export async function clinicianPatients(actor: AuthenticatedUser) {
  assertClinicalAuthor(actor);
  const rows = await getDatabase().select({ id: patientProfiles.id, patientNumber: patientProfiles.patientNumber, firstName: patientProfiles.firstName, lastName: patientProfiles.lastName, dateOfBirth: patientProfiles.dateOfBirth })
    .from(appointments).innerJoin(patientProfiles, eq(patientProfiles.id, appointments.patientId))
    .where(eq(appointments.practitionerId, actor.practitionerId)).orderBy(asc(patientProfiles.lastName));
  return Array.from(new Map(rows.map(row => [row.id, row])).values());
}

export async function clinicalPatient(actor: AuthenticatedUser, patientId: string) {
  assertClinicalAuthor(actor);
  const db = getDatabase();
  const [patient] = await db.select().from(patientProfiles).where(eq(patientProfiles.id, patientId)).limit(1);
  if (!patient) return null;
  const [encounters, notes, alerts, results, prescriptionRows] = await Promise.all([
    db.select().from(clinicalEncounters).where(eq(clinicalEncounters.patientId, patientId)).orderBy(desc(clinicalEncounters.createdAt)),
    db.select().from(clinicalNotes).where(eq(clinicalNotes.patientId, patientId)).orderBy(desc(clinicalNotes.createdAt)),
    db.select().from(patientAlerts).where(eq(patientAlerts.patientId, patientId)).orderBy(desc(patientAlerts.createdAt)),
    db.select().from(testResults).where(eq(testResults.patientId, patientId)).orderBy(desc(testResults.createdAt)),
    db.select().from(prescriptions).where(eq(prescriptions.patientId, patientId)).orderBy(desc(prescriptions.createdAt)),
  ]);
  return { patient, encounters, notes, alerts, results, prescriptions: prescriptionRows };
}

export async function clinicalEncounter(actor: AuthenticatedUser, encounterId: string) {
  assertClinicalAuthor(actor);
  const db = getDatabase();
  const [encounter] = await db.select().from(clinicalEncounters).where(eq(clinicalEncounters.id, encounterId)).limit(1);
  if (!encounter) return null;
  const [notes, prescriptionsRows] = await Promise.all([
    db.select().from(clinicalNotes).where(eq(clinicalNotes.encounterId, encounterId)).orderBy(asc(clinicalNotes.createdAt)),
    db.select().from(prescriptions).where(eq(prescriptions.encounterId, encounterId)).orderBy(desc(prescriptions.createdAt)),
  ]);
  const ids = prescriptionsRows.map(row => row.id);
  const items = ids.length ? await db.select().from(prescriptionItems).where(inArray(prescriptionItems.prescriptionId, ids)) : [];
  return { encounter, notes, prescriptions: prescriptionsRows.map(row => ({ ...row, items: items.filter(item => item.prescriptionId === row.id) })) };
}
