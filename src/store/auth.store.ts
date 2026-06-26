import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  _id: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin' | 'researcher';
  is_verified: boolean;
  is_onboarded: boolean;
  full_name?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  role: 'patient' | 'doctor' | 'admin' | 'researcher' | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isOnboarded: false,
      role: null,
      
      setAuth: (user, token) => set({
        user,
        accessToken: token,
        isAuthenticated: true,
        isOnboarded: user.is_onboarded,
        role: user.role
      }),
      
      clearAuth: () => set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isOnboarded: false,
        role: null
      })
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
    }
  )
);
