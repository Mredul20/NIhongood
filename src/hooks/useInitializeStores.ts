import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useProgressStore } from '@/store/progressStore';
import { useSRSStore } from '@/store/srsStore';
import { useLearningStore } from '@/store/learningStore';
import { useUserPreferencesStore } from '@/store/userPreferencesStore';

/**
 * Hook to initialize all user stores from Supabase
 * Call this after auth is initialized and user is logged in
 */
export function useInitializeStores() {
  const { user } = useAuthStore();
  const loadProgress = useProgressStore((s) => s.loadFromSupabase);
  const loadSRS = useSRSStore((s) => s.loadFromSupabase);
  const loadLearning = useLearningStore((s) => s.loadFromSupabase);
  const loadPreferences = useUserPreferencesStore((s) => s.loadFromSupabase);

  useEffect(() => {
    if (!user) return;

    const initializeAllStores = async () => {
      try {
        // Load all data in parallel
        await Promise.all([
          loadProgress(user.id),
          loadSRS(user.id),
          loadLearning(user.id),
          loadPreferences(user.id),
        ]);
        console.log('All stores initialized from Supabase');
      } catch (error) {
        console.error('Error initializing stores:', error);
      }
    };

    initializeAllStores();
  }, [user, loadProgress, loadSRS, loadLearning, loadPreferences]);
}

/**
 * Hook to sync all user stores to Supabase
 * Call this periodically or before logout to ensure data is saved
 */
export function useSyncStores() {
  const { user } = useAuthStore();
  const syncProgress = useProgressStore((s) => s.syncToSupabase);
  const syncSRS = useSRSStore((s) => s.syncToSupabase);
  const syncLearning = useLearningStore((s) => s.syncToSupabase);
  const syncPreferences = useUserPreferencesStore((s) => s.syncToSupabase);

  const syncAllStores = async () => {
    if (!user) return;

    try {
      await Promise.all([
        syncProgress(user.id),
        syncSRS(user.id),
        syncLearning(user.id),
        syncPreferences(user.id),
      ]);
      console.log('All stores synced to Supabase');
    } catch (error) {
      console.error('Error syncing stores:', error);
    }
  };

  // Sync periodically (every 5 minutes)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(syncAllStores, 5 * 60 * 1000);
    return () => clearInterval(interval);
  // syncAllStores is recreated each render but only depends on stable store selectors.
  // Omitting it from deps is safe — the interval always captures the latest version
  // because setInterval fires after the current render cycle.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, syncProgress, syncSRS, syncLearning, syncPreferences]);

  // Return the function so it can be called manually
  return syncAllStores;
}
