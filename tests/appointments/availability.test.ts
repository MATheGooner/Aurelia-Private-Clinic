import assert from 'node:assert/strict';
import test from 'node:test';
import { earliestAvailableSlot, generateAvailableSlots, overlaps, zonedDateTimeToUtc } from '../../lib/appointments/availability-engine';
import type { AvailabilityDataset } from '../../lib/appointments/types';

const practitioner = { id: 'practitioner-a', slug: 'doctor-a', name: 'Doctor A', durationMinutes: 30, eligible: true };
const mondayRule = { practitionerId: practitioner.id, day: 'MONDAY' as const, startTime: '09:00', endTime: '10:00', effectiveFrom: null, effectiveTo: null };
const base: AvailabilityDataset = { practitioners: [practitioner], rules: [mondayRule], exceptions: [], appointments: [] };
const options = { fromDate: '2026-11-02', toDate: '2026-11-02', now: new Date('2026-10-21T00:00:00Z'), minimumLeadMinutes: 0 };

test('generates duration-correct slots only inside schedule periods', () => {
  const slots = generateAvailableSlots({ ...base, ...options });
  assert.deepEqual(slots.map((slot) => slot.startsAt), ['2026-11-02T09:00:00.000Z', '2026-11-02T09:15:00.000Z', '2026-11-02T09:30:00.000Z']);
  assert.ok(slots.every((slot) => new Date(slot.endsAt).getTime() - new Date(slot.startsAt).getTime() === 30 * 60_000));
});

test('schedule exceptions remove overlapping slots', () => {
  const slots = generateAvailableSlots({ ...base, ...options, exceptions: [{ practitionerId: practitioner.id, startsAt: new Date('2026-11-02T09:10:00Z'), endsAt: new Date('2026-11-02T09:40:00Z') }] });
  assert.equal(slots.length, 0);
});

test('active appointments remove overlapping availability', () => {
  const slots = generateAvailableSlots({ ...base, ...options, appointments: [{ practitionerId: practitioner.id, startsAt: new Date('2026-11-02T09:30:00Z'), endsAt: new Date('2026-11-02T10:00:00Z') }] });
  assert.deepEqual(slots.map((slot) => slot.startsAt), ['2026-11-02T09:00:00.000Z']);
});

test('incompatible practitioners and past slots are excluded', () => {
  assert.equal(generateAvailableSlots({ ...base, practitioners: [{ ...practitioner, eligible: false }], ...options }).length, 0);
  assert.equal(generateAvailableSlots({ ...base, ...options, now: new Date('2026-11-03T00:00:00Z'), minimumLeadMinutes: 0 }).length, 0);
});

test('no-preference selection returns the earliest concrete practitioner slot', () => {
  const later = { ...practitioner, id: 'practitioner-b', slug: 'doctor-b', name: 'Doctor B' };
  const slots = generateAvailableSlots({ ...base, practitioners: [practitioner, later], rules: [mondayRule, { ...mondayRule, practitionerId: later.id, startTime: '08:30', endTime: '09:30' }], ...options });
  assert.equal(earliestAvailableSlot(slots).practitionerId, later.id);
  assert.equal(earliestAvailableSlot(slots).startsAt, '2026-11-02T08:30:00.000Z');
});

test('London local schedules preserve DST conversion and half-open overlap semantics', () => {
  assert.equal(zonedDateTimeToUtc('2026-07-06', '09:00').toISOString(), '2026-07-06T08:00:00.000Z');
  assert.equal(overlaps(new Date('2026-01-01T09:00Z'), new Date('2026-01-01T09:30Z'), new Date('2026-01-01T09:30Z'), new Date('2026-01-01T10:00Z')), false);
});
