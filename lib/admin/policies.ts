import type { UserRole } from '@/lib/auth/types';
import { canAccessAdminWorkspace } from './access';

export const appointmentStatuses = ['REQUESTED', 'CONFIRMED', 'ARRIVED', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED', 'NO_SHOW'] as const;
export type OperationalAppointmentStatus = (typeof appointmentStatuses)[number];

const transitions: Record<OperationalAppointmentStatus, readonly OperationalAppointmentStatus[]> = {
  REQUESTED: ['CONFIRMED', 'CANCELLED'], CONFIRMED: ['ARRIVED', 'CANCELLED', 'NO_SHOW'],
  ARRIVED: ['IN_CONSULTATION', 'CANCELLED'], IN_CONSULTATION: ['COMPLETED'],
  COMPLETED: [], CANCELLED: [], NO_SHOW: [],
};

export function canTransitionAppointment(from: OperationalAppointmentStatus, to: OperationalAppointmentStatus) { return transitions[from].includes(to); }
export function canCheckIn(role: UserRole, status: OperationalAppointmentStatus, hasActiveCheckIn: boolean) { return canAccessAdminWorkspace(role) && !hasActiveCheckIn && (status === 'REQUESTED' || status === 'CONFIRMED'); }

export const administrativePatientFieldNames = [
  'id', 'patientNumber', 'firstName', 'lastName', 'dateOfBirth', 'email', 'phone', 'addressLine1',
  'addressLine2', 'city', 'postcode', 'country', 'emergencyContactName', 'emergencyContactPhone', 'status', 'portalLinked',
] as const;
