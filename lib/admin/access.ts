import type { AuthenticatedUser, UserRole } from '@/lib/auth/types';
import { AuthorizationError } from '@/lib/auth/permissions';

export function canAccessAdminWorkspace(role: UserRole): boolean {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

export function assertAdminWorkspace(actor: AuthenticatedUser): void {
  if (!canAccessAdminWorkspace(actor.role)) throw new AuthorizationError('The operational workspace is restricted to administrative staff.');
}
