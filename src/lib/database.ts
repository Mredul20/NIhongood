import { createClient } from '@/lib/supabase-browser';
import { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Progress = Database['public']['Tables']['progress']['Row'];
type SRSCard = Database['public']['Tables']['srs_cards']['Row'];
type LearningProgress = Database['public']['Tables']['learning_progress']['Row'];
type UserPreferences = Database['public']['Tables']['user_preferences']['Row'];
type DailyLog = Database['public']['Tables']['daily_logs']['Row'];
type ReviewHistory = Database['public']['Tables']['review_history']['Row'];

// Database helper functions
export const db = {
  // ============================================
  // PROFILE
  // ============================================
  async getProfile(userId: string): Promise<Profile | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    // Don't log "PGRST116" errors (no rows found) - this is expected during profile creation
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    }
    return data || null;
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) console.error('Error updating profile:', error);
    return { data, error };
  },

  // ============================================
  // PROGRESS
  // ============================================
  async getProgress(userId: string): Promise<Progress | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) console.error('Error fetching progress:', error);
    return data;
  },

  async updateProgress(userId: string, updates: Partial<Progress>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('progress')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) console.error('Error updating progress:', error);
    return { data, error };
  },

  // ============================================
  // SRS CARDS
  // ============================================
  async getSRSCards(userId: string): Promise<SRSCard[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('srs_cards')
      .select('*')
      .eq('user_id', userId);
    
    if (error) console.error('Error fetching SRS cards:', error);
    return data || [];
  },

  async upsertSRSCard(userId: string, card: Partial<SRSCard> & { id: string }) {
    const supabase = createClient();
    // Normalise type: 'kanji' maps to 'vocab' for DB compat until migration runs
    const safeType = card.type === 'kanji' ? 'vocab' : card.type;
    const { data, error } = await supabase
      .from('srs_cards')
      .upsert({
        ...card,
        type: safeType,
        user_id: userId,
      })
      .select()
      .single();
    
    if (error) console.error('Error upserting SRS card:', error);
    return { data, error };
  },

  async deleteSRSCard(userId: string, cardId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('srs_cards')
      .delete()
      .eq('user_id', userId)
      .eq('id', cardId);
    
    if (error) console.error('Error deleting SRS card:', error);
    return { error };
  },

  async bulkUpsertSRSCards(userId: string, cards: Array<Partial<SRSCard> & { id: string }>) {
    const supabase = createClient();
    const cardsWithUserId = cards.map(card => ({
      ...card,
      // Normalise type: 'kanji' maps to 'vocab' for DB compat until migration runs
      type: card.type === 'kanji' ? 'vocab' : card.type,
      user_id: userId,
    }));
    
    const { data, error } = await supabase
      .from('srs_cards')
      .upsert(cardsWithUserId)
      .select();
    
    if (error) console.error('Error bulk upserting SRS cards:', error);
    return { data, error };
  },

  // ============================================
  // LEARNING PROGRESS
  // ============================================
  async getLearningProgress(userId: string): Promise<LearningProgress | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) console.error('Error fetching learning progress:', error);
    return data;
  },

  async updateLearningProgress(userId: string, updates: Partial<LearningProgress>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('learning_progress')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) console.error('Error updating learning progress:', error);
    return { data, error };
  },

  // ============================================
  // USER PREFERENCES
  // ============================================
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) console.error('Error fetching user preferences:', error);
    return data;
  },

  async updateUserPreferences(userId: string, updates: Partial<UserPreferences>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('user_preferences')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) console.error('Error updating user preferences:', error);
    return { data, error };
  },

  // ============================================
  // DAILY LOGS
  // ============================================
  async getDailyLogs(userId: string, limit = 30): Promise<DailyLog[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit);
    
    if (error) console.error('Error fetching daily logs:', error);
    return data || [];
  },

  async upsertDailyLog(userId: string, date: string, updates: Partial<DailyLog>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('daily_logs')
      .upsert(
        {
          user_id: userId,
          date,
          ...updates,
        },
        { onConflict: 'user_id,date' }
      )
      .select()
      .single();
    
    if (error) console.error('Error upserting daily log:', error);
    return { data, error };
  },

  // ============================================
  // REVIEW HISTORY
  // ============================================
  async getReviewHistory(userId: string, limit = 30): Promise<ReviewHistory[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('review_history')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit);
    
    if (error) console.error('Error fetching review history:', error);
    return data || [];
  },

  async upsertReviewHistory(userId: string, date: string, correct: number, total: number) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('review_history')
      .upsert(
        {
          user_id: userId,
          date,
          correct,
          total,
        },
        { onConflict: 'user_id,date' }
      )
      .select()
      .single();
    
    if (error) console.error('Error upserting review history:', error);
    return { data, error };
  },

  // ============================================
  // SYNC ALL DATA
  // ============================================
  async syncAllData(userId: string) {
    const [profile, progress, cards, learning, preferences, dailyLogs, reviewHistory] = await Promise.all([
      this.getProfile(userId),
      this.getProgress(userId),
      this.getSRSCards(userId),
      this.getLearningProgress(userId),
      this.getUserPreferences(userId),
      this.getDailyLogs(userId),
      this.getReviewHistory(userId),
    ]);

    return {
      profile,
      progress,
      cards,
      learning,
      preferences,
      dailyLogs,
      reviewHistory,
    };
  },
};
