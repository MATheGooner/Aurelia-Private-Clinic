import type { AuthenticatedUser, UserRole } from '@/lib/auth/types';
import { AuthorizationError } from '@/lib/auth/permissions';
export const canAccessClinicalWorkspace = (role: UserRole, practitionerId: string | null) => role === 'CLINICIAN' && Boolean(practitionerId);
export function assertClinicalAuthor(actor: AuthenticatedUser): asserts actor is AuthenticatedUser & { practitionerId: string } { if (!canAccessClinicalWorkspace(actor.role, actor.practitionerId)) throw new AuthorizationError('A linked clinician identity is required.'); }
