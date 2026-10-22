import { loadAvailabilityDataset } from '@/lib/db/repositories/availability';
import { generateAvailableSlots } from './availability-engine';

export type AvailabilityRequest = { department: string; treatment?: string | null; practitioner?: string | null; fromDate: string; toDate: string };

export async function getAvailability(request: AvailabilityRequest) {
  const data = await loadAvailabilityDataset(request);
  return {
    department: data.department,
    treatment: data.treatment,
    slots: generateAvailableSlots({
      practitioners: data.practitioners, rules: data.rules, exceptions: data.exceptions,
      appointments: data.appointments, fromDate: request.fromDate, toDate: request.toDate,
    }),
  };
}
