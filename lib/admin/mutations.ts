import { and, eq } from 'drizzle-orm';
import type { AuthenticatedUser } from '@/lib/auth/types';
import { getDatabase } from '@/lib/db/client';
import { appointments, appointmentStatusHistory, auditLogs, checkIns, patientProfiles } from '@/lib/db/schema';
import { assertAdminWorkspace } from './access';
import { canCheckIn, canTransitionAppointment, type OperationalAppointmentStatus } from './policies';

export async function transitionAppointment(actor: AuthenticatedUser, id: string, next: OperationalAppointmentStatus, reason?: string) {
  assertAdminWorkspace(actor);
  return getDatabase().transaction(async tx => {
    const [current] = await tx.select().from(appointments).where(eq(appointments.id, id)).limit(1);
    if (!current || !canTransitionAppointment(current.status, next)) throw new Error('This appointment status transition is not permitted.');
    await tx.update(appointments).set({ status: next, cancellationReason: next === 'CANCELLED' ? reason : current.cancellationReason, updatedAt: new Date() }).where(eq(appointments.id, id));
    await tx.insert(appointmentStatusHistory).values({ appointmentId: id, previousStatus: current.status, newStatus: next, changedByUserId: actor.userId, reason });
    await tx.insert(auditLogs).values({ actorUserId: actor.userId, actorRoleSnapshot: actor.role, action: 'APPOINTMENT_STATUS_CHANGED', resourceType: 'APPOINTMENT', resourceId: id, patientId: current.patientId, metadata: { from: current.status, to: next } });
  });
}

export async function checkInAppointment(actor: AuthenticatedUser, id: string) {
  assertAdminWorkspace(actor);
  return getDatabase().transaction(async tx => {
    const [appointment] = await tx.select().from(appointments).where(eq(appointments.id, id)).limit(1);
    const [existing] = await tx.select().from(checkIns).where(and(eq(checkIns.appointmentId, id), eq(checkIns.reversedAt, null as never))).limit(1);
    if (!appointment || !canCheckIn(actor.role, appointment.status, Boolean(existing))) throw new Error('This appointment cannot be checked in.');
    await tx.insert(checkIns).values({ appointmentId: id, checkedInByUserId: actor.userId });
    if (appointment.status !== 'ARRIVED') {
      await tx.update(appointments).set({ status: 'ARRIVED', updatedAt: new Date() }).where(eq(appointments.id, id));
      await tx.insert(appointmentStatusHistory).values({ appointmentId: id, previousStatus: appointment.status, newStatus: 'ARRIVED', changedByUserId: actor.userId });
    }
  });
}

export async function reverseCheckIn(actor: AuthenticatedUser, id: string, note?: string) {
  assertAdminWorkspace(actor);
  await getDatabase().update(checkIns).set({ reversedAt: new Date(), reversedByUserId: actor.userId, note }).where(and(eq(checkIns.appointmentId, id), eq(checkIns.reversedAt, null as never)));
}

export async function updateAdministrativePatient(actor: AuthenticatedUser, id: string, values: Partial<typeof patientProfiles.$inferInsert>) {
  assertAdminWorkspace(actor);
  const allowed = { firstName: values.firstName, lastName: values.lastName, email: values.email, phone: values.phone, addressLine1: values.addressLine1, addressLine2: values.addressLine2, city: values.city, postcode: values.postcode, country: values.country, emergencyContactName: values.emergencyContactName, emergencyContactPhone: values.emergencyContactPhone, status: values.status, updatedAt: new Date() };
  await getDatabase().update(patientProfiles).set(allowed).where(eq(patientProfiles.id, id));
}
