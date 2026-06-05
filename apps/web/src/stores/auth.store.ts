import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, accessToken: string) => void;
  setToken: (accessToken: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,

      setAuth: (user, accessToken) => set({ user, accessToken }),

      setToken: (accessToken) => set({ accessToken }),

      logout: () => {
        localStorage.removeItem('refreshToken');
        set({ user: null, accessToken: null });
      },

      isAdmin: () => get().user?.role === 'ADMIN',
    }),
    {
      name: 'copa-will-auth',
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
