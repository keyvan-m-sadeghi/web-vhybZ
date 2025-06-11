import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface AuthState {
  // UI-only state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set) => ({
    // State
    isLoading: false,
    error: null,

    // Actions
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error, isLoading: false }),
    clearError: () => set({ error: null }),
    reset: () => set({ isLoading: false, error: null }),
  }))
);