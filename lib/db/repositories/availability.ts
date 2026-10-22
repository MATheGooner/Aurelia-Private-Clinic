import { and, eq, gt, gte, inArray, lt, lte, or } from 'drizzle-orm';
import { getDatabase } from '../client';
import { appointments, departments, practitionerDepartments, practitionerScheduleExceptions, practitionerScheduleRules, practitioners, practitionerTreatments, staffProfiles, treatments } from '../schema';
import type { AvailabilityDataset } from '@/lib/appointments/types';

type Request = { department: string; treatment?: string | null; practitioner?: string | null; fromDate: string; toDate: string };

export async function loadAvailabilityDataset(request: Request): Promise<AvailabilityDataset & {
  department: { id: string; slug: string; name: string };
  treatment: { id: string; slug: string; name: string; durationMinutes: number | null } | null;
}> {
  const db = getDatabase();
  const [department] = await db.select({ id: departments.id, slug: departments.slug, name: departments.name }).from(departments)
    .where(and(eq(departments.slug, request.department), eq(departments.active, true))).limit(1);
  if (!department) throw new Error('Department not found.');
  const [treatment] = request.treatment ? await db.select({ id: treatments.id, slug: treatments.slug, name: treatments.name, durationMinutes: treatments.defaultDurationMinutes }).from(treatments)
    .where(and(eq(treatments.slug, request.treatment), eq(treatments.departmentId, department.id), eq(treatments.active, true))).limit(1) : [];
  if (request.treatment && !treatment) throw new Error('Treatment not found in this department.');

  const rows = await db.select({
    id: practitioners.id, slug: practitioners.publicSlug, firstName: staffProfiles.firstName,
    lastName: staffProfiles.lastName, defaultDuration: practitioners.defaultAppointmentDurationMinutes,
    treatmentId: practitionerTreatments.treatmentId,
  }).from(practitioners)
    .innerJoin(staffProfiles, eq(staffProfiles.id, practitioners.staffProfileId))
    .innerJoin(practitionerDepartments, and(eq(practitionerDepartments.practitionerId, practitioners.id), eq(practitionerDepartments.departmentId, department.id)))
    .leftJoin(practitionerTreatments, eq(practitionerTreatments.practitionerId, practitioners.id))
    .where(and(eq(practitioners.active, true), eq(staffProfiles.active, true), request.practitioner ? eq(practitioners.publicSlug, request.practitioner) : undefined));
  const eligibleRows = rows.filter(row => !treatment || row.treatmentId === treatment.id);
  const unique = new Map(eligibleRows.map(row => [row.id, row]));
  const practitionerRows = Array.from(unique.values());
  const ids = practitionerRows.map(row => row.id);
  const rangeStart = new Date(`${request.fromDate}T00:00:00Z`);
  const rangeEnd = new Date(`${request.toDate}T23:59:59.999Z`);
  if (!ids.length) return { department, treatment: treatment ?? null, practitioners: [], rules: [], exceptions: [], appointments: [] };

  const [rules, exceptions, busy] = await Promise.all([
    db.select().from(practitionerScheduleRules).where(and(inArray(practitionerScheduleRules.practitionerId, ids), eq(practitionerScheduleRules.active, true), or(eq(practitionerScheduleRules.effectiveFrom, null as never), lte(practitionerScheduleRules.effectiveFrom, request.toDate)), or(eq(practitionerScheduleRules.effectiveTo, null as never), gte(practitionerScheduleRules.effectiveTo, request.fromDate)))),
    db.select({ practitionerId: practitionerScheduleExceptions.practitionerId, startsAt: practitionerScheduleExceptions.startsAt, endsAt: practitionerScheduleExceptions.endsAt }).from(practitionerScheduleExceptions).where(and(inArray(practitionerScheduleExceptions.practitionerId, ids), eq(practitionerScheduleExceptions.active, true), lt(practitionerScheduleExceptions.startsAt, rangeEnd), gt(practitionerScheduleExceptions.endsAt, rangeStart))),
    db.select({ practitionerId: appointments.practitionerId, startsAt: appointments.startsAt, endsAt: appointments.endsAt }).from(appointments).where(and(inArray(appointments.practitionerId, ids), inArray(appointments.status, ['REQUESTED', 'CONFIRMED', 'ARRIVED', 'IN_CONSULTATION']), lt(appointments.startsAt, rangeEnd), gt(appointments.endsAt, rangeStart))),
  ]);
  return {
    department, treatment: treatment ?? null,
    practitioners: practitionerRows.map(row => ({ id: row.id, slug: row.slug, name: `${row.firstName} ${row.lastName}`, durationMinutes: treatment?.durationMinutes ?? row.defaultDuration, eligible: true })),
    rules: rules.map(rule => ({ practitionerId: rule.practitionerId, day: rule.day, startTime: rule.startTime, endTime: rule.endTime, effectiveFrom: rule.effectiveFrom, effectiveTo: rule.effectiveTo })),
    exceptions,
    appointments: busy.filter((row): row is typeof row & { practitionerId: string } => Boolean(row.practitionerId)),
  };
}
