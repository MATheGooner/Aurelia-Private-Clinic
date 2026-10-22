export type BookingRequest = {
  department: string; treatment?: string; practitioner?: string; startsAt: string;
  firstName?: string; lastName?: string; email?: string; phone?: string;
  dateOfBirth?: string; patientType: 'NEW' | 'EXISTING'; reason?: string;
  patientId?: string;
};

export class RequestValidationError extends Error {
  readonly status = 400;
  constructor(message: string) { super(message); this.name = 'RequestValidationError'; }
}

export function validateAvailabilityQuery(input: Record<string, string | null>) {
  const department = requiredSlug(input.department, 'department');
  const treatment = optionalSlug(input.treatment, 'treatment');
  const practitioner = optionalSlug(input.practitioner, 'practitioner');
  const fromDate = validDate(input.from, 'from');
  const toDate = validDate(input.to, 'to');
  const span = (Date.parse(`${toDate}T00:00:00Z`) - Date.parse(`${fromDate}T00:00:00Z`)) / 86_400_000;
  if (span < 0 || span > 30) throw new RequestValidationError('Availability may be requested for a maximum 31-day range.');
  return { department, treatment, practitioner, fromDate, toDate };
}

export function validateBookingRequest(value: unknown): BookingRequest {
  if (!value || typeof value !== 'object') throw new RequestValidationError('A booking request is required.');
  const input = value as Record<string, unknown>;
  const patientType = input.patientType;
  if (patientType !== 'NEW' && patientType !== 'EXISTING') throw new RequestValidationError('Choose a valid patient type.');
  const startsAt = string(input.startsAt, 'startsAt');
  if (Number.isNaN(Date.parse(startsAt))) throw new RequestValidationError('Choose a valid appointment time.');
  const result: BookingRequest = {
    department: requiredSlug(asString(input.department), 'department'),
    treatment: optionalSlug(asString(input.treatment), 'treatment') ?? undefined,
    practitioner: optionalSlug(asString(input.practitioner), 'practitioner') ?? undefined,
    startsAt, patientType,
    firstName: optionalText(input.firstName, 100), lastName: optionalText(input.lastName, 100),
    email: optionalText(input.email, 320)?.toLowerCase(), phone: optionalText(input.phone, 40),
    dateOfBirth: optionalText(input.dateOfBirth, 10), reason: optionalText(input.reason, 500),
    patientId: optionalText(input.patientId, 64),
  };
  if (!result.practitioner) throw new RequestValidationError('Choose an available practitioner.');
  return result;
}

function asString(value: unknown): string | null { return typeof value === 'string' ? value : null; }
function string(value: unknown, name: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new RequestValidationError(`${name} is required.`);
  return value.trim();
}
function requiredSlug(value: string | null, name: string): string {
  const result = optionalSlug(value, name);
  if (!result) throw new RequestValidationError(`${name} is required.`);
  return result;
}
function optionalSlug(value: string | null, name: string): string | null {
  if (!value) return null;
  const result = value.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result)) throw new RequestValidationError(`${name} is invalid.`);
  return result;
}
function validDate(value: string | null, name: string): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) throw new RequestValidationError(`${name} must be a valid date.`);
  return value;
}
function optionalText(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  const result = value.trim();
  if (result.length > max) throw new RequestValidationError('A booking field is too long.');
  return result;
}
