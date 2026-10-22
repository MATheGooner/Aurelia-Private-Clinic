export const userRoles = ['PATIENT', 'ADMIN', 'CLINICIAN', 'SUPER_ADMIN'] as const;
export type UserRole = (typeof userRoles)[number];

export type AuthenticatedUser = {
  userId: string;
  email: string;
  role: UserRole;
  patientId: string | null;
  staffProfileId: string | null;
  practitionerId: string | null;
};

export function isUserRole(value: string): value is UserRole {
  return userRoles.includes(value as UserRole);
}
