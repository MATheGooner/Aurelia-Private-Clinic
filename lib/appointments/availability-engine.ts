import type { AppointmentSlot, AvailabilityDataset } from './types';

const zone = 'Europe/London';
const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const;

type GenerateInput = AvailabilityDataset & {
  fromDate: string;
  toDate: string;
  now?: Date;
  minimumLeadMinutes?: number;
};

export function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function zonedDateTimeToUtc(date: string, time: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.slice(0, 5).split(':').map(Number);
  let guess = Date.UTC(year, month - 1, day, hour, minute);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date(guess));
    const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find(part => part.type === type)?.value);
    const represented = Date.UTC(value('year'), value('month') - 1, value('day'), value('hour'), value('minute'));
    const correction = Date.UTC(year, month - 1, day, hour, minute) - represented;
    if (correction === 0) break;
    guess += correction;
  }
  return new Date(guess);
}

export function generateAvailableSlots(input: GenerateInput): AppointmentSlot[] {
  const now = input.now ?? new Date();
  const earliest = now.getTime() + (input.minimumLeadMinutes ?? 60) * 60_000;
  const slots: AppointmentSlot[] = [];
  for (const date of datesBetween(input.fromDate, input.toDate)) {
    const noon = zonedDateTimeToUtc(date, '12:00');
    const localDay = dayNames[Number(new Intl.DateTimeFormat('en-US', { timeZone: zone, weekday: 'short' }).formatToParts(noon).find(part => part.type === 'weekday') ? noon.getUTCDay() : noon.getUTCDay())];
    for (const practitioner of input.practitioners) {
      if (!practitioner.eligible) continue;
      const rules = input.rules.filter(rule => rule.practitionerId === practitioner.id && rule.day === localDay
        && (!rule.effectiveFrom || date >= rule.effectiveFrom) && (!rule.effectiveTo || date <= rule.effectiveTo));
      for (const rule of rules) {
        const start = zonedDateTimeToUtc(date, rule.startTime);
        const finish = zonedDateTimeToUtc(date, rule.endTime);
        for (let cursor = start.getTime(); cursor + practitioner.durationMinutes * 60_000 <= finish.getTime(); cursor += 15 * 60_000) {
          const startsAt = new Date(cursor);
          const endsAt = new Date(cursor + practitioner.durationMinutes * 60_000);
          if (cursor < earliest) continue;
          const blocked = [...input.exceptions, ...input.appointments].some(period =>
            period.practitionerId === practitioner.id && overlaps(startsAt, endsAt, period.startsAt, period.endsAt));
          if (!blocked) slots.push({ practitionerId: practitioner.id, practitionerSlug: practitioner.slug, practitionerName: practitioner.name, startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString(), durationMinutes: practitioner.durationMinutes });
        }
      }
    }
  }
  return slots.sort((a, b) => a.startsAt.localeCompare(b.startsAt) || a.practitionerName.localeCompare(b.practitionerName));
}

export function earliestAvailableSlot(slots: readonly AppointmentSlot[]): AppointmentSlot {
  if (!slots.length) throw new Error('No appointment slots are available.');
  return [...slots].sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0];
}

function datesBetween(from: string, to: string): string[] {
  const result: string[] = [];
  const cursor = new Date(`${from}T12:00:00Z`);
  const end = new Date(`${to}T12:00:00Z`);
  while (cursor <= end) {
    result.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return result;
}
