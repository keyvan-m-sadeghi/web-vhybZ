import { useUser } from './use-auth';
import type { UserRole, RequiredRole } from '../lib/types';

export const useRole = () => {
  const user = useUser();

  const hasRole = (requiredRole: RequiredRole): boolean => {
    if (!user) return false;

    const userRole = user.role;
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    return roles.includes(userRole);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user?.permissions) return false;
    return user.permissions.includes(permission);
  };

  const isAdmin = (): boolean => {
    return hasRole(['admin', 'superadmin']);
  };

  const isSuperAdmin = (): boolean => {
    return hasRole('superadmin');
  };

  return {
    userRole: user?.role || null,
    hasRole,
    hasPermission,
    isAdmin,
    isSuperAdmin,
    canAccess: hasRole, // Alias for convenience
  };
};