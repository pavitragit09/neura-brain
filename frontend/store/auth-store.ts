"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MockUser } from "@/types/auth";

type AuthState = {
  user: MockUser | null;
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
  updateProfile: (name: string, initials: string) => void;
};

const mockUser = {
  name: "Alex Morgan",
  email: "alex@neura.local",
  role: "admin",
  initials: "AM",
} satisfies MockUser;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      signIn: () => set({ user: mockUser, isAuthenticated: true }),
      signOut: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (name, initials) =>
        set((state) => ({
          user: state.user ? { ...state.user, name, initials } : null,
        })),
    }),
    {
      name: "neura-mock-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
