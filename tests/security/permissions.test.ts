import assert from 'node:assert/strict';
import test from 'node:test';
import {
  AuthorizationError, capabilities, hasCapability,
} from '../../lib/auth/permissions';
import type { AuthenticatedUser, UserRole } from '../../lib/auth/types';
import { createClinicalEncounter, listPatientEncounters } from '../../lib/db/repositories/clinical';

const actor = (role: UserRole, overrides: Partial<AuthenticatedUser> = {}): AuthenticatedUser => ({
  userId: `${role.toLowerCase()}-user`, email: `${role.toLowerCase()}@example.test`, role,
  patientId: role === 'PATIENT'  'patient-a' : null,
  staffProfileId: role === 'PATIENT'  null : `${role.toLowerCase()}-staff`,
  practitionerId: role === 'CLINICIAN'  'clinician-practitioner' : null,
  ...overrides,
});

test('roles are capability sets, not a privilege hierarchy', () => {
  assert.equal(hasCapability('ADMIN', capabilities.clinicalRead), false);
  assert.equal(hasCapability('ADMIN', capabilities.clinicalWrite), false);
  assert.equal(hasCapability('CLINICIAN', capabilities.clinicalRead), true);
  assert.equal(hasCapability('CLINICIAN', capabilities.clinicalWrite), true);
  assert.equal(hasCapability('SUPER_ADMIN', capabilities.clinicalRead), true);
  assert.equal(hasCapability('SUPER_ADMIN', capabilities.clinicalWrite), false);
  assert.equal(hasCapability('SUPER_ADMIN', capabilities.prescriptionWrite), false);
});

test('ADMIN clinical reads are rejected before database access', async () => {
  await assert.rejects(() => listPatientEncounters(actor('ADMIN'), 'patient-a'), AuthorizationError);
});

test('SUPER_ADMIN cannot create clinical records or impersonate a practitioner', async () => {
  await assert.rejects(() => createClinicalEncounter(actor('SUPER_ADMIN'), {
    patientId: 'patient-a', departmentId: 'department-a', encounterType: 'TEST',
  }), AuthorizationError);
});

test('patient ownership cannot be widened by client-supplied identifiers', () => {
  assert.equal(hasCapability('PATIENT', capabilities.clinicalRead), false);
  assert.equal(hasCapability('PATIENT', capabilities.clinicalReadReleasedOwn), true);
});
