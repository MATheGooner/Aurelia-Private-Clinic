import assert from 'node:assert/strict';
import { canAccessAdminWorkspace } from '../../lib/admin/access';
import { administrativePatientFieldNames, appointmentStatuses, canCheckIn, canTransitionAppointment } from '../../lib/admin/policies';

let passed = 0;
function test(name: string, run: () => void) { run(); passed += 1; console.log(`✓ ${name}`); }

test('only ADMIN and SUPER_ADMIN can access the operational workspace', () => {
  assert.equal(canAccessAdminWorkspace('ADMIN'), true); assert.equal(canAccessAdminWorkspace('SUPER_ADMIN'), true);
  assert.equal(canAccessAdminWorkspace('CLINICIAN'), false); assert.equal(canAccessAdminWorkspace('PATIENT'), false);
});

test('appointment transitions follow the operational lifecycle', () => {
  assert.equal(canTransitionAppointment('REQUESTED', 'CONFIRMED'), true);
  assert.equal(canTransitionAppointment('CONFIRMED', 'NO_SHOW'), true);
  assert.equal(canTransitionAppointment('ARRIVED', 'IN_CONSULTATION'), true);
  assert.equal(canTransitionAppointment('COMPLETED', 'CONFIRMED'), false);
  assert.equal(canTransitionAppointment('CANCELLED', 'ARRIVED'), false);
  assert.deepEqual(appointmentStatuses.length, 7);
});

test('check-in requires an operational role, eligible status and no active check-in', () => {
  assert.equal(canCheckIn('ADMIN', 'CONFIRMED', false), true);
  assert.equal(canCheckIn('SUPER_ADMIN', 'REQUESTED', false), true);
  assert.equal(canCheckIn('CLINICIAN', 'CONFIRMED', false), false);
  assert.equal(canCheckIn('ADMIN', 'CONFIRMED', true), false);
  assert.equal(canCheckIn('ADMIN', 'COMPLETED', false), false);
});

test('administrative patient projection does not expose clinical fields', () => {
  const prohibited = ['clinicalNotes', 'diagnoses', 'prescriptions', 'medications', 'allergies', 'consultationNotes'];
  for (const field of prohibited) assert.equal(administrativePatientFieldNames.includes(field as never), false);
  assert.equal(administrativePatientFieldNames.includes('email'), true);
  assert.equal(administrativePatientFieldNames.includes('emergencyContactPhone'), true);
});

console.log(`${passed} admin operations tests passed.`);
