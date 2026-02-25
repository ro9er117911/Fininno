import { create } from "zustand";
import type { Role } from "@fininno/shared";

interface AuthState {
    role: Role | null;
    userName: string | null;
    login: (role: Role, userName: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    role: "Ops", // Default to Ops for demo
    userName: "Alice (Ops)",
    login: (role, userName) => set({ role, userName }),
    logout: () => set({ role: null, userName: null }),
}));
