"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MockUser } from "@/types/auth";

type AuthState = {
  user: MockUser | null;
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
};

const mockUser = {
  name: "Alex Morgan",
  email: "alex@neura.local",
  role: "admin",
} satisfies MockUser;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      signIn: () => set({ user: mockUser, isAuthenticated: true }),
      signOut: () => set({ user: null, isAuthenticated: false }),
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
