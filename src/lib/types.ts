export type UserRole = 'user' | 'admin' | 'superadmin';

export interface User {
  _id: string;
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthError {
  message: string;
  status?: number;
  code?: string;
}

// For role-based access control
export type RequiredRole = UserRole | UserRole[];