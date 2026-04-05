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
async function toUser(supabaseUser: SupabaseUser, retries = 3): Promise<User | null> {
  let lastError: unknown;
  
  // Retry logic for profile creation (trigger may not have completed yet)
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const profile = await db.getProfile(supabaseUser.id);
      if (profile) {
        return {
          id: supabaseUser.id,
          email: supabaseUser.email || profile.email,
          name: profile.name,
          level: (profile.level as "N5" | "N4") || "N5",
          dailyGoalMinutes: profile.daily_goal_minutes || 15,
          createdAt: profile.created_at,
        };
      }
    } catch (error) {
      lastError = error;
    }
    
    // If this is not the last attempt, wait before retrying
    if (attempt < retries - 1) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  // If profile still doesn't exist after retries, create a minimal user object
  // from Supabase user data
  if (supabaseUser.email) {
    const name = (supabaseUser.user_metadata?.name as string) || supabaseUser.email.split('@')[0];
    console.warn(`Profile not found for user ${supabaseUser.id}, using default values`);
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: name,
      level: "N5",
      dailyGoalMinutes: 15,
      createdAt: new Date().toISOString(),
    };
  }
  
  console.error('Failed to create user object:', lastError);
  return null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      initialize: async () => {
        // Guard against multiple concurrent initializations (e.g. AuthGuard + LoginPage
        // both calling initialize()). Only the first call does real work.
        // NOTE: we only skip if already initialized AND a user is present (or we
        // finished and found no user). After logout isLoading is set back to false
        // with user=null, so we must still allow re-initialization on next mount.
        // Guard: skip if already initialized with a valid user.
        // Do NOT skip when user is null — that means either we haven't checked yet
        // or the user logged out. isLoading starts as true, so the condition below
        // only fires when initialize() already completed successfully.
        if (!get().isLoading && get().user !== null) return;

        try {
          const supabase = createClient();

          // Use getUser() rather than getSession() — getUser() validates the token
          // with the Supabase Auth server, which is required for production correctness.
          // getSession() only reads from the local cookie and can return stale data.
          const { data: { user: sbUser } } = await supabase.auth.getUser();

          if (sbUser) {
            const user = await toUser(sbUser);
            set({ user, isAuthenticated: !!user, isLoading: false });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }

          // Listen for auth state changes (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, etc.)
          // onAuthStateChange fires immediately with the current session, so we also
          // use it to handle the initial state when the token is refreshed by middleware.
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
              const user = await toUser(session.user);
              set({ user, isAuthenticated: !!user });
            } else {
              set({ user: null, isAuthenticated: false });
            }
          });

          // Store the unsubscribe function so we don't leak the listener.
          // Calling it immediately would defeat the purpose — we only want it
          // cleaned up when the app unmounts, so we attach it to window as a
          // best-effort teardown (or it will be GC'd with the tab).
          if (typeof window !== "undefined") {
            const prev = (window as unknown as Record<string, unknown>).__supabaseAuthUnsub;
            if (typeof prev === "function") (prev as () => void)();
            (window as unknown as Record<string, unknown>).__supabaseAuthUnsub = () => subscription.unsubscribe();
          }
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
            // Wait for the trigger to create the profile
            // toUser will retry multiple times with delays
            const user = await toUser(data.user, 5);
            
            if (!user) {
              set({ 
                error: "Failed to create user profile. Please try again.", 
                isLoading: false 
              });
              return false;
            }
            
            set({ user, isAuthenticated: true, isLoading: false });
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
      // Only persist the user object — never persist isAuthenticated.
      // Persisting isAuthenticated causes stale true values on page load before
      // the Supabase session is verified, which triggers redirect loops in production.
      // isAuthenticated is derived live from user !== null after initialize() runs.
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
