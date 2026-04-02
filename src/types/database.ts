export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          level: string | null
          daily_goal_minutes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          level?: string | null
          daily_goal_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          level?: string | null
          daily_goal_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      progress: {
        Row: {
          id: string
          user_id: string
          total_xp: number
          level: number
          current_streak: number
          longest_streak: number
          total_reviews: number
          total_study_minutes: number
          last_review_date: string | null
          unlocked_badges: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_xp?: number
          level?: number
          current_streak?: number
          longest_streak?: number
          total_reviews?: number
          total_study_minutes?: number
          last_review_date?: string | null
          unlocked_badges?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_xp?: number
          level?: number
          current_streak?: number
          longest_streak?: number
          total_reviews?: number
          total_study_minutes?: number
          last_review_date?: string | null
          unlocked_badges?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      srs_cards: {
        Row: {
          id: string
          user_id: string
          front: string
          back: string
          reading: string | null
          type: string
          interval: number
          ease_factor: number
          next_review: string
          repetitions: number
          last_review: string | null
          created_at: string
        }
        Insert: {
          id: string
          user_id: string
          front: string
          back: string
          reading?: string | null
          type: string
          interval?: number
          ease_factor?: number
          next_review?: string
          repetitions?: number
          last_review?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          front?: string
          back?: string
          reading?: string | null
          type?: string
          interval?: number
          ease_factor?: number
          next_review?: string
          repetitions?: number
          last_review?: string | null
          created_at?: string
        }
      }
      learning_progress: {
        Row: {
          id: string
          user_id: string
          learned_kana: string[]
          learned_vocab: string[]
          completed_grammar: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          learned_kana?: string[]
          learned_vocab?: string[]
          completed_grammar?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          learned_kana?: string[]
          learned_vocab?: string[]
          completed_grammar?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          experience_level: string
          theme: string
          srs_settings: Json
          ui_preferences: Json
          onboarding_completed: boolean
          introduced_features: string[]
          total_reviews_completed: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          experience_level?: string
          theme?: string
          srs_settings?: Json
          ui_preferences?: Json
          onboarding_completed?: boolean
          introduced_features?: string[]
          total_reviews_completed?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          experience_level?: string
          theme?: string
          srs_settings?: Json
          ui_preferences?: Json
          onboarding_completed?: boolean
          introduced_features?: string[]
          total_reviews_completed?: number
          created_at?: string
          updated_at?: string
        }
      }
      daily_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          xp_earned: number
          reviews_completed: number
          study_minutes: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          xp_earned?: number
          reviews_completed?: number
          study_minutes?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          xp_earned?: number
          reviews_completed?: number
          study_minutes?: number
          created_at?: string
        }
      }
      review_history: {
        Row: {
          id: string
          user_id: string
          date: string
          correct: number
          total: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          correct?: number
          total?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          correct?: number
          total?: number
          created_at?: string
        }
      }
    }
  }
}
