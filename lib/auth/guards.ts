import { notFound, redirect } from 'next/navigation';
import { assertCapability, capabilities, hasCapability, type Capability } from './permissions';
import { getCurrentUser } from './session';
import type { AuthenticatedUser, UserRole } from './types';
import { canAccessAdminWorkspace } from '@/lib/admin/access';
import { canAccessClinicalWorkspace } from '@/lib/clinical/access';

export async function requireAuthenticatedUser(): Promise<AuthenticatedUser> {
  const actor = await getCurrentUser();
  if (!actor) redirect('/login');
  return actor;
}

export async function requireCapability(capability: Capability): Promise<AuthenticatedUser> {
  const actor = await requireAuthenticatedUser();
  if (!hasCapability(actor.role, capability)) notFound();
  return actor;
}

export async function requireRole(role: UserRole): Promise<AuthenticatedUser> {
  const actor = await requireAuthenticatedUser();
  if (actor.role !== role) notFound();
  return actor;
}

export const requirePatient = () => requireRole('PATIENT');
export async function requirePatientPortal(): Promise<AuthenticatedUser> { const actor=await requireAuthenticatedUser(); if(actor.role!=='PATIENT')notFound(); return actor; }
export const requireClinician = () => requireRole('CLINICIAN');
export const requireSuperAdmin = () => requireRole('SUPER_ADMIN');
export const requireManagement = requireSuperAdmin;
export const requireOperationalAccess = () => requireCapability(capabilities.patientAdministrativeRead);

export async function requireAdminWorkspace(): Promise<AuthenticatedUser> {
  const actor = await requireAuthenticatedUser();
  if (!canAccessAdminWorkspace(actor.role)) notFound();
  return actor;
}

export async function requireClinicalAuthor(): Promise<AuthenticatedUser & { practitionerId: string }> {
  const actor = await requireAuthenticatedUser();
  assertCapability(actor, capabilities.clinicalWrite);
  if (!actor.practitionerId) notFound();
  return actor as AuthenticatedUser & { practitionerId: string };
}

export async function requireClinicalWorkspace(): Promise<AuthenticatedUser & { practitionerId: string }> {
  const actor = await requireAuthenticatedUser();
  if (!canAccessClinicalWorkspace(actor.role, actor.practitionerId)) notFound();
  return actor as AuthenticatedUser & { practitionerId: string };
}
