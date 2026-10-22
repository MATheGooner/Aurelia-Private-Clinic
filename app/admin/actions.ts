'use server';
import { revalidatePath } from 'next/cache';
import { requireAdminWorkspace } from '@/lib/auth/guards';
import { checkInAppointment, reverseCheckIn, transitionAppointment, updateAdministrativePatient } from '@/lib/admin/mutations';
import type { OperationalAppointmentStatus } from '@/lib/admin/policies';

export async function appointmentStatusAction(formData: FormData) {
  const actor = await requireAdminWorkspace(); const id = String(formData.get('appointmentId'));
  await transitionAppointment(actor, id, String(formData.get('status')) as OperationalAppointmentStatus, String(formData.get('reason') ?? '') || undefined);
  revalidatePath(`/admin/appointments/${id}`);
}
export async function checkInAction(formData: FormData) { const actor = await requireAdminWorkspace(); const id = String(formData.get('appointmentId')); await checkInAppointment(actor, id); revalidatePath(`/admin/appointments/${id}`); }
export async function reverseCheckInAction(formData: FormData) { const actor = await requireAdminWorkspace(); const id = String(formData.get('appointmentId')); await reverseCheckIn(actor, id, String(formData.get('note') ?? '')); revalidatePath(`/admin/appointments/${id}`); }
export async function updatePatientAction(formData: FormData) {
  const actor = await requireAdminWorkspace(); const id = String(formData.get('patientId'));
  const value = (name: string) => String(formData.get(name) ?? '').trim() || null;
  await updateAdministrativePatient(actor, id, { firstName: value('firstName') ?? undefined, lastName: value('lastName') ?? undefined, email: value('email'), phone: value('phone'), addressLine1: value('addressLine1'), addressLine2: value('addressLine2'), city: value('city'), postcode: value('postcode'), country: value('country'), emergencyContactName: value('emergencyContactName'), emergencyContactPhone: value('emergencyContactPhone') });
  revalidatePath(`/admin/patients/${id}`);
}
