import { and, eq, gt, inArray, lt, sql } from 'drizzle-orm';
import { getDatabase } from '../client';
import { appointments, appointmentStatusHistory, patientProfiles } from '../schema';

export class AppointmentConflictError extends Error {
  readonly status = 409;
  constructor(message = 'That appointment is no longer available.') { super(message); this.name = 'AppointmentConflictError'; }
}

export type PersistBookingInput = {
  referenceNumber: string; patientId?: string; publicPatient?: {
    patientNumber: string; firstName: string; lastName: string; email: string; phone: string; dateOfBirth: string;
  };
  departmentId: string; treatmentId: string | null; practitionerId: string;
  startsAt: Date; endsAt: Date; durationMinutes: number; reason: string | null;
  patientType: 'NEW' | 'EXISTING'; creatorUserId: string | null;
};

export async function persistBooking(input: PersistBookingInput) {
  try {
    return await getDatabase().transaction(async tx => {
      await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${input.practitionerId}))`);
      const [collision] = await tx.select({ id: appointments.id }).from(appointments).where(and(
        eq(appointments.practitionerId, input.practitionerId),
        inArray(appointments.status, ['REQUESTED', 'CONFIRMED', 'ARRIVED', 'IN_CONSULTATION']),
        lt(appointments.startsAt, input.endsAt), gt(appointments.endsAt, input.startsAt),
      )).limit(1);
      if (collision) throw new AppointmentConflictError();
      let patientId = input.patientId;
      if (!patientId && input.publicPatient) {
        const [patient] = await tx.insert(patientProfiles).values(input.publicPatient).returning({ id: patientProfiles.id });
        patientId = patient.id;
      }
      if (!patientId) throw new Error('A patient profile is required.');
      const [appointment] = await tx.insert(appointments).values({
        referenceNumber: input.referenceNumber, patientId, departmentId: input.departmentId,
        treatmentId: input.treatmentId, practitionerId: input.practitionerId, startsAt: input.startsAt,
        endsAt: input.endsAt, durationMinutes: input.durationMinutes, reason: input.reason,
        patientType: input.patientType, createdByUserId: input.creatorUserId,
      }).returning({ id: appointments.id, referenceNumber: appointments.referenceNumber, startsAt: appointments.startsAt, endsAt: appointments.endsAt, status: appointments.status });
      await tx.insert(appointmentStatusHistory).values({ appointmentId: appointment.id, newStatus: 'REQUESTED', changedByUserId: input.creatorUserId });
      return appointment;
    });
  } catch (error) {
    if (error instanceof AppointmentConflictError || (isPgError(error) && error.code === '23P01')) throw new AppointmentConflictError();
    throw error;
  }
}
function isPgError(error: unknown): error is { code: string } { return Boolean(error && typeof error === 'object' && 'code' in error); }
