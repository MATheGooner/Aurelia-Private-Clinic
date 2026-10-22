import assert from 'node:assert/strict';
import test from 'node:test';
import { bookAppointment } from '../../lib/appointments/booking';
import type { AuthenticatedUser } from '../../lib/auth/types';
import { AppointmentConflictError, type PersistBookingInput } from '../../lib/db/repositories/booking';

const slot = { practitionerId: 'practitioner-a', practitionerSlug: 'doctor-a', practitionerName: 'Doctor A', startsAt: '2026-11-02T09:00:00.000Z', endsAt: '2026-11-02T09:30:00.000Z', durationMinutes: 30 };
const availability = async () => ({ department: { id: 'department-a', slug: 'general-practice', name: 'General Practice' }, treatment: { id: 'treatment-a', slug: 'consultation', name: 'Consultation', durationMinutes: 30 }, slots: [slot] });
const payload = { department: 'general-practice', treatment: 'consultation', practitioner: 'doctor-a', startsAt: slot.startsAt, firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.test', phone: '+44 7700 900111', dateOfBirth: '1990-01-02', patientType: 'NEW' as const, reason: 'Brief appointment request' };
const persisted = { id: 'appointment-a', referenceNumber: 'AUR-TEST', startsAt: new Date(slot.startsAt), endsAt: new Date(slot.endsAt), status: 'REQUESTED' as const };

test('successful booking passes a validated concrete slot to persistence', async () => {
  let received: PersistBookingInput | undefined;
  const result = await bookAppointment(payload, null, { availability, persist: async (input) => { received = input; return persisted; }, reference: () => 'AUR-TEST', patientNumber: () => 'AUR-PATIENT' });
  assert.equal(result.reference, 'AUR-TEST');
  assert.equal(received.practitionerId, slot.practitionerId);
  assert.equal(received.publicPatient.patientNumber, 'AUR-PATIENT');
  assert.equal(received.creatorUserId, null);
});

test('authenticated PATIENT ownership is derived from the session, never request data', async () => {
  const actor: AuthenticatedUser = { userId: 'user-a', email: 'patient@example.test', role: 'PATIENT', patientId: 'patient-owned', staffProfileId: null, practitionerId: null };
  let received: PersistBookingInput | undefined;
  await bookAppointment({ ...payload, patientId: 'patient-other' }, actor, { availability, persist: async (input) => { received = input; return persisted; }, reference: () => 'AUR-TEST' });
  assert.equal(received.patientId, 'patient-owned');
  assert.equal(received.publicPatient, undefined);
  assert.equal(received.patientType, 'EXISTING');
});

test('a PATIENT without a linked profile fails safely', async () => {
  const actor: AuthenticatedUser = { userId: 'user-a', email: 'patient@example.test', role: 'PATIENT', patientId: null, staffProfileId: null, practitionerId: null };
  await assert.rejects(() => bookAppointment(payload, actor, { availability }), /not linked to a patient profile/);
});

test('stale selections are rejected before persistence', async () => {
  let persistedCalled = false;
  await assert.rejects(() => bookAppointment(payload, null, { availability: async () => ({ department: { id: 'department-a', slug: 'general-practice', name: 'General Practice' }, treatment: null, slots: [] }), persist: async () => { persistedCalled = true; return persisted; } }), AppointmentConflictError);
  assert.equal(persistedCalled, false);
});

test('concurrent persistence protection allows only one winner', async () => {
  let claimed = false;
  const serializedPersist = async () => {
    await new Promise((resolve) => setTimeout(resolve, 5));
    if (claimed) throw new AppointmentConflictError();
    claimed = true;
    return persisted;
  };
  const outcomes = await Promise.allSettled([
    bookAppointment(payload, null, { availability, persist: serializedPersist }),
    bookAppointment(payload, null, { availability, persist: serializedPersist }),
  ]);
  assert.equal(outcomes.filter((item) => item.status === 'fulfilled').length, 1);
  assert.equal(outcomes.filter((item) => item.status === 'rejected').length, 1);
});
