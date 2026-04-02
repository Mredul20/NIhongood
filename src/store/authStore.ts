import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/lib/supabase-browser";
import { db } from "@/lib/database";
import type { User as SupabaseUser } from "@supabase/supabase-js";

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
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
  
  // OAuth
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
}

// Convert Supabase user + profile to our User type
async function toUser(supabaseUser: SupabaseUser): Promise<User | null> {
  const profile = await db.getProfile(supabaseUser.id);
  if (!profile) return null;
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || profile.email,
    name: profile.name,
    level: (profile.level as "N5" | "N4") || "N5",
    dailyGoalMinutes: profile.daily_goal_minutes || 15,
    createdAt: profile.created_at,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      initialize: async () => {
        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            const user = await toUser(session.user);
            set({ user, isAuthenticated: !!user, isLoading: false });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
          
          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
              const user = await toUser(session.user);
              set({ user, isAuthenticated: !!user });
            } else if (event === "SIGNED_OUT") {
              set({ user: null, isAuthenticated: false });
            }
          });
        } catch (error) {
          console.error("Auth initialization error:", error);
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) {
            set({ error: error.message, isLoading: false });
            return false;
          }
          
          if (data.user) {
            const user = await toUser(data.user);
            set({ user, isAuthenticated: !!user, isLoading: false });
            return true;
          }
          
          set({ isLoading: false });
          return false;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Login failed";
          set({ error: message, isLoading: false });
          return false;
        }
      },

      register: async (email: string, name: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { name },
            },
          });
          
          if (error) {
            set({ error: error.message, isLoading: false });
            return false;
          }
          
          if (data.user) {
            // Wait a bit for the trigger to create the profile
            await new Promise(resolve => setTimeout(resolve, 500));
            const user = await toUser(data.user);
            set({ user, isAuthenticated: !!user, isLoading: false });
            return true;
          }
          
          set({ isLoading: false });
          return false;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Registration failed";
          set({ error: message, isLoading: false });
          return false;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
          set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          console.error("Logout error:", error);
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      updateProfile: async (updates) => {
        const { user } = get();
        if (!user) return;
        
        try {
          const dbUpdates: Record<string, unknown> = {};
          if (updates.name !== undefined) dbUpdates.name = updates.name;
          if (updates.level !== undefined) dbUpdates.level = updates.level;
          if (updates.dailyGoalMinutes !== undefined) dbUpdates.daily_goal_minutes = updates.dailyGoalMinutes;
          
          await db.updateProfile(user.id, dbUpdates);
          set({ user: { ...user, ...updates } });
        } catch (error) {
          console.error("Update profile error:", error);
        }
      },

      clearError: () => set({ error: null }),

      loginWithGoogle: async () => {
        try {
          const supabase = createClient();
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Google login failed";
          set({ error: message });
        }
      },

      loginWithGithub: async () => {
        try {
          const supabase = createClient();
          await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "GitHub login failed";
          set({ error: message });
        }
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
