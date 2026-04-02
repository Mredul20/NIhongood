import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  level: "N5" | "N4";
  dailyGoalMinutes: number;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (email: string, name: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

// Simple in-memory user store for MVP
const USERS_KEY = "nihongood_users";

function getStoredUsers(): Record<string, { user: User; passwordHash: string }> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, { user: User; passwordHash: string }>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Simple hash for MVP (NOT secure - replace with bcrypt on backend)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email: string, password: string) => {
        const users = getStoredUsers();
        const entry = users[email];
        if (!entry) return false;
        if (entry.passwordHash !== simpleHash(password)) return false;
        set({ user: entry.user, isAuthenticated: true });
        return true;
      },

      register: (email: string, name: string, password: string) => {
        const users = getStoredUsers();
        if (users[email]) return false;

        const newUser: User = {
          id: crypto.randomUUID(),
          email,
          name,
          level: "N5",
          dailyGoalMinutes: 15,
          createdAt: new Date().toISOString(),
        };

        users[email] = { user: newUser, passwordHash: simpleHash(password) };
        saveUsers(users);
        set({ user: newUser, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updates) => {
        set((state) => {
          if (!state.user) return state;
          const updatedUser = { ...state.user, ...updates };

          // Also update in stored users
          const users = getStoredUsers();
          if (users[state.user.email]) {
            users[state.user.email].user = updatedUser;
            saveUsers(users);
          }

          return { user: updatedUser };
        });
      },
    }),
    {
      name: "nihongood-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
