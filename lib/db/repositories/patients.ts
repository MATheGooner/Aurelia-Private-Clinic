import { desc, eq } from 'drizzle-orm';
import type { AuthenticatedUser } from '@/lib/auth/types';
import { AuthorizationError, assertCapability, canReadPatientAdministrativeData, capabilities } from '@/lib/auth/permissions';
import { getDatabase } from '../client';
import { patientProfiles } from '../schema';

const administrativePatientColumns = {
  id: patientProfiles.id, patientNumber: patientProfiles.patientNumber, userId: patientProfiles.userId,
  firstName: patientProfiles.firstName, lastName: patientProfiles.lastName, dateOfBirth: patientProfiles.dateOfBirth,
  email: patientProfiles.email, phone: patientProfiles.phone, addressLine1: patientProfiles.addressLine1,
  addressLine2: patientProfiles.addressLine2, city: patientProfiles.city, postcode: patientProfiles.postcode,
  country: patientProfiles.country, emergencyContactName: patientProfiles.emergencyContactName,
  emergencyContactPhone: patientProfiles.emergencyContactPhone, status: patientProfiles.status,
  createdAt: patientProfiles.createdAt, updatedAt: patientProfiles.updatedAt,
};

export async function findPatientByNumber(actor: AuthenticatedUser, patientNumber: string) {
  assertCapability(actor, capabilities.patientAdministrativeRead);
  const [patient] = await getDatabase().select(administrativePatientColumns).from(patientProfiles)
    .where(eq(patientProfiles.patientNumber, patientNumber)).limit(1);
  return patient;
}

export async function findPatientById(actor: AuthenticatedUser, patientId: string) {
  if (!canReadPatientAdministrativeData(actor, patientId)) throw new AuthorizationError();
  const [patient] = await getDatabase().select(administrativePatientColumns).from(patientProfiles)
    .where(eq(patientProfiles.id, patientId)).limit(1);
  return patient;
}

export async function findPatientsByEmail(actor: AuthenticatedUser, email: string) {
  assertCapability(actor, capabilities.patientAdministrativeRead);
  return getDatabase().select(administrativePatientColumns).from(patientProfiles)
    .where(eq(patientProfiles.email, email.trim().toLowerCase())).orderBy(desc(patientProfiles.updatedAt));
}

export type NewPatientProfile = typeof patientProfiles.$inferInsert;
export async function createPatientProfile(actor: AuthenticatedUser, profile: NewPatientProfile) {
  assertCapability(actor, capabilities.patientAdministrativeWrite);
  const [created] = await getDatabase().insert(patientProfiles).values(profile).returning(administrativePatientColumns);
  return created;
}
