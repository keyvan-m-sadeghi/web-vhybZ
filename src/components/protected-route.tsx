import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../hooks/use-auth';
import { useRole } from '../hooks/use-role';
import type { RequiredRole } from '../lib/types';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: RequiredRole;
  permissions?: string[];
  fallback?: ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  roles,
  permissions,
  fallback,
  requireAuth = true
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasRole, hasPermission } = useRole();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return fallback ? <>{fallback}</> : <Navigate to="/login" replace />;
  }

  // Check role requirement
  if (roles && !hasRole(roles)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground mt-2">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  // Check permission requirement
  if (permissions && !permissions.every(permission => hasPermission(permission))) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground mt-2">
            You don't have the required permissions to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}