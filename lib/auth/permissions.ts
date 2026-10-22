import type { AuthenticatedUser, UserRole } from './types';

export const capabilities = {
  accountReadOwn: 'account:read-own',
  patientAdministrativeReadOwn: 'patient-administrative:read-own',
  patientAdministrativeRead: 'patient-administrative:read',
  patientAdministrativeWrite: 'patient-administrative:write',
  appointmentReadOwn: 'appointment:read-own',
  appointmentRead: 'appointment:read',
  appointmentWrite: 'appointment:write',
  scheduleRead: 'schedule:read',
  scheduleWrite: 'schedule:write',
  clinicalReadReleasedOwn: 'clinical:read-released-own',
  clinicalRead: 'clinical:read',
  clinicalWrite: 'clinical:write',
  prescriptionReadReleasedOwn: 'prescription:read-released-own',
  prescriptionRead: 'prescription:read',
  prescriptionWrite: 'prescription:write',
  auditRead: 'audit:read',
} as const;

export type Capability = (typeof capabilities)[keyof typeof capabilities];

const roleCapabilities: Record<UserRole, ReadonlySet<Capability>> = {
  PATIENT: new Set([
    capabilities.accountReadOwn,
    capabilities.patientAdministrativeReadOwn,
    capabilities.appointmentReadOwn,
    capabilities.clinicalReadReleasedOwn,
    capabilities.prescriptionReadReleasedOwn,
  ]),
  ADMIN: new Set([
    capabilities.accountReadOwn,
    capabilities.patientAdministrativeRead,
    capabilities.patientAdministrativeWrite,
    capabilities.appointmentRead,
    capabilities.appointmentWrite,
    capabilities.scheduleRead,
    capabilities.scheduleWrite,
  ]),
  CLINICIAN: new Set([
    capabilities.accountReadOwn,
    capabilities.patientAdministrativeRead,
    capabilities.appointmentRead,
    capabilities.scheduleRead,
    capabilities.clinicalRead,
    capabilities.clinicalWrite,
    capabilities.prescriptionRead,
    capabilities.prescriptionWrite,
  ]),
  SUPER_ADMIN: new Set([
    capabilities.accountReadOwn,
    capabilities.patientAdministrativeRead,
    capabilities.patientAdministrativeWrite,
    capabilities.appointmentRead,
    capabilities.appointmentWrite,
    capabilities.scheduleRead,
    capabilities.scheduleWrite,
    capabilities.clinicalRead,
    capabilities.prescriptionRead,
    capabilities.auditRead,
  ]),
};

export class AuthorizationError extends Error {
  readonly code = 'FORBIDDEN';

  constructor(message = 'You do not have permission to perform this action.') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export function hasCapability(role: UserRole, capability: Capability): boolean {
  return roleCapabilities[role].has(capability);
}

export function assertCapability(actor: AuthenticatedUser, capability: Capability): void {
  if (!hasCapability(actor.role, capability)) throw new AuthorizationError();
}

export function assertOwnPatient(actor: AuthenticatedUser, patientId: string): void {
  if (actor.role !== 'PATIENT' || !actor.patientId || actor.patientId !== patientId) {
    throw new AuthorizationError('Patients may access only their own records.');
  }
}

export function canReadPatientAdministrativeData(actor: AuthenticatedUser, patientId: string): boolean {
  return hasCapability(actor.role, capabilities.patientAdministrativeRead)
    || (hasCapability(actor.role, capabilities.patientAdministrativeReadOwn) && actor.patientId === patientId);
}

export function canReadClinicalData(actor: AuthenticatedUser): boolean {
  return hasCapability(actor.role, capabilities.clinicalRead);
}

export function canMutateClinicalData(actor: AuthenticatedUser): boolean {
  return hasCapability(actor.role, capabilities.clinicalWrite) && actor.practitionerId !== null;
}

export function canReadPrescriptions(actor: AuthenticatedUser): boolean {
  return hasCapability(actor.role, capabilities.prescriptionRead);
}

export function canMutatePrescriptions(actor: AuthenticatedUser): boolean {
  return hasCapability(actor.role, capabilities.prescriptionWrite) && actor.practitionerId !== null;
}
