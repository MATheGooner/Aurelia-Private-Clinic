import { and, desc, eq, isNotNull } from 'drizzle-orm';
import type { AuthenticatedUser } from '@/lib/auth/types';
import { AuthorizationError, assertCapability, assertOwnPatient, capabilities } from '@/lib/auth/permissions';
import { getDatabase } from '../client';
import { clinicalEncounters, clinicalNoteRevisions, clinicalNotes, prescriptions, testResults } from '../schema';

// Privileged reads reject ADMIN before a database handle or query is created.
export async function listPatientEncounters(actor: AuthenticatedUser, patientId: string) {
  assertCapability(actor, capabilities.clinicalRead);
  return getDatabase().select().from(clinicalEncounters)
    .where(eq(clinicalEncounters.patientId, patientId)).orderBy(desc(clinicalEncounters.createdAt));
}

export async function listEncounterNotes(actor: AuthenticatedUser, encounterId: string) {
  assertCapability(actor, capabilities.clinicalRead);
  return getDatabase().select().from(clinicalNotes)
    .where(eq(clinicalNotes.encounterId, encounterId)).orderBy(desc(clinicalNotes.createdAt));
}

export async function listPatientResults(actor: AuthenticatedUser, patientId: string) {
  assertCapability(actor, capabilities.clinicalRead);
  return getDatabase().select().from(testResults)
    .where(eq(testResults.patientId, patientId)).orderBy(desc(testResults.createdAt));
}

export async function listPatientPrescriptions(actor: AuthenticatedUser, patientId: string) {
  assertCapability(actor, capabilities.prescriptionRead);
  return getDatabase().select().from(prescriptions)
    .where(eq(prescriptions.patientId, patientId)).orderBy(desc(prescriptions.createdAt));
}

export async function listOwnReleasedNotes(actor: AuthenticatedUser, patientId: string) {
  assertOwnPatient(actor, patientId);
  assertCapability(actor, capabilities.clinicalReadReleasedOwn);
  return getDatabase().select({
    id: clinicalNotes.id, encounterId: clinicalNotes.encounterId, type: clinicalNotes.type,
    content: clinicalNotes.content, createdAt: clinicalNotes.createdAt, updatedAt: clinicalNotes.updatedAt,
  }).from(clinicalNotes).where(and(
    eq(clinicalNotes.patientId, patientId), eq(clinicalNotes.patientVisible, true), eq(clinicalNotes.status, 'ACTIVE'),
  )).orderBy(desc(clinicalNotes.createdAt));
}

export async function listOwnReleasedResults(actor: AuthenticatedUser, patientId: string) {
  assertOwnPatient(actor, patientId);
  assertCapability(actor, capabilities.clinicalReadReleasedOwn);
  return getDatabase().select({
    id: testResults.id, type: testResults.type, summary: testResults.summary,
    structuredValue: testResults.structuredValue, status: testResults.status,
    resultDate: testResults.resultDate, releasedAt: testResults.releasedAt,
  }).from(testResults).where(and(
    eq(testResults.patientId, patientId), eq(testResults.patientVisible, true), isNotNull(testResults.releasedAt),
  )).orderBy(desc(testResults.createdAt));
}

export async function listOwnReleasedPrescriptions(actor: AuthenticatedUser, patientId: string) {
  assertOwnPatient(actor, patientId);
  assertCapability(actor, capabilities.prescriptionReadReleasedOwn);
  return getDatabase().select({
    id: prescriptions.id, encounterId: prescriptions.encounterId, status: prescriptions.status,
    prescribedAt: prescriptions.prescribedAt, instructions: prescriptions.instructions,
  }).from(prescriptions).where(and(
    eq(prescriptions.patientId, patientId), eq(prescriptions.patientVisible, true),
  )).orderBy(desc(prescriptions.createdAt));
}

export type NewClinicalEncounter = Omit<typeof clinicalEncounters.$inferInsert, 'practitionerId'>;
export async function createClinicalEncounter(actor: AuthenticatedUser, encounter: NewClinicalEncounter) {
  const practitionerId = requireClinicalAuthor(actor);
  const [created] = await getDatabase().insert(clinicalEncounters).values({ ...encounter, practitionerId }).returning();
  return created;
}

export type NewClinicalNote = Omit<typeof clinicalNotes.$inferInsert, 'authorPractitionerId' | 'currentRevision'>;
export async function createClinicalNote(actor: AuthenticatedUser, note: NewClinicalNote) {
  const practitionerId = requireClinicalAuthor(actor);
  return getDatabase().transaction(async (tx) => {
    const [created] = await tx.insert(clinicalNotes).values({ ...note, authorPractitionerId: practitionerId }).returning();
    await tx.insert(clinicalNoteRevisions).values({
      clinicalNoteId: created.id, revisionNumber: 1, contentSnapshot: created.content,
      amendedByPractitionerId: practitionerId, amendmentReason: 'Initial immutable snapshot',
    });
    return created;
  });
}

export type NewPrescription = Omit<typeof prescriptions.$inferInsert, 'prescribingPractitionerId'>;
export async function createPrescription(actor: AuthenticatedUser, prescription: NewPrescription) {
  assertCapability(actor, capabilities.prescriptionWrite);
  if (!actor.practitionerId) throw new AuthorizationError('Clinical authorship requires an active practitioner identity.');
  const [created] = await getDatabase().insert(prescriptions)
    .values({ ...prescription, prescribingPractitionerId: actor.practitionerId }).returning();
  return created;
}

function requireClinicalAuthor(actor: AuthenticatedUser): string {
  assertCapability(actor, capabilities.clinicalWrite);
  if (!actor.practitionerId) throw new AuthorizationError('Clinical authorship requires an active practitioner identity.');
  return actor.practitionerId;
}
