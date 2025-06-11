import type { User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const fetchCurrentUser = async (): Promise<User | null> => {
  const response = await fetch(`${API_BASE_URL}/api/user`, {
    credentials: 'include', // Essential for cookie auth
  });
  
  if (response.status === 401) {
    return null; // Not authenticated
  }
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }
  
  return response.json();
};

export const logoutUser = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error(`Logout failed: ${response.statusText}`);
  }
};

// Web-specific OAuth redirect
export const initiateGoogleLogin = (): void => {
  if (typeof window !== 'undefined') {
    window.location.href = `${API_BASE_URL}/auth/google`;
  }
};