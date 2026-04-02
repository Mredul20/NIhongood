-- NIhongood Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/mkcimanpcghmzqwievsz/sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text not null,
  level text default 'N5' check (level in ('N5', 'N4')),
  daily_goal_minutes integer default 15,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- PROGRESS TABLE
-- ============================================
create table public.progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  total_xp integer default 0,
  level integer default 1,
  current_streak integer default 0,
  longest_streak integer default 0,
  total_reviews integer default 0,
  total_study_minutes integer default 0,
  last_review_date date,
  unlocked_badges text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- ============================================
-- DAILY LOGS TABLE
-- ============================================
create table public.daily_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  xp_earned integer default 0,
  reviews_completed integer default 0,
  study_minutes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

-- ============================================
-- SRS CARDS TABLE
-- ============================================
create table public.srs_cards (
  id text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  front text not null,
  back text not null,
  reading text,
  type text not null check (type in ('kana', 'vocab', 'grammar')),
  interval integer default 0,
  ease_factor numeric(4,2) default 2.5,
  next_review timestamp with time zone default timezone('utc'::text, now()),
  repetitions integer default 0,
  last_review timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id, user_id)
);

-- ============================================
-- REVIEW HISTORY TABLE
-- ============================================
create table public.review_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  correct integer default 0,
  total integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

-- ============================================
-- LEARNING PROGRESS TABLE
-- ============================================
create table public.learning_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  learned_kana text[] default '{}',
  learned_vocab text[] default '{}',
  completed_grammar text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- ============================================
-- USER PREFERENCES TABLE
-- ============================================
create table public.user_preferences (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  experience_level text default 'beginner' check (experience_level in ('beginner', 'intermediate', 'advanced')),
  theme text default 'dark' check (theme in ('dark', 'light', 'system')),
  srs_settings jsonb default '{"newCardsPerDay": 10, "maxReviewsPerDay": 0, "showIntervalPredictions": true, "showEaseFactor": false, "enableEasyButton": true, "autoAdvance": false, "autoAdvanceDelay": 1000}',
  ui_preferences jsonb default '{"showDetailedStats": false, "showAlgorithmExplanations": false, "showCardStatusBar": false, "showWhyThisCard": false, "compactMode": false, "animationLevel": "full"}',
  onboarding_completed boolean default false,
  introduced_features text[] default '{}',
  total_reviews_completed integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.daily_logs enable row level security;
alter table public.srs_cards enable row level security;
alter table public.review_history enable row level security;
alter table public.learning_progress enable row level security;
alter table public.user_preferences enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Progress policies
create policy "Users can view own progress" on public.progress
  for select using (auth.uid() = user_id);

create policy "Users can update own progress" on public.progress
  for update using (auth.uid() = user_id);

create policy "Users can insert own progress" on public.progress
  for insert with check (auth.uid() = user_id);

-- Daily logs policies
create policy "Users can view own daily logs" on public.daily_logs
  for select using (auth.uid() = user_id);

create policy "Users can manage own daily logs" on public.daily_logs
  for all using (auth.uid() = user_id);

-- SRS cards policies
create policy "Users can view own cards" on public.srs_cards
  for select using (auth.uid() = user_id);

create policy "Users can manage own cards" on public.srs_cards
  for all using (auth.uid() = user_id);

-- Review history policies
create policy "Users can view own review history" on public.review_history
  for select using (auth.uid() = user_id);

create policy "Users can manage own review history" on public.review_history
  for all using (auth.uid() = user_id);

-- Learning progress policies
create policy "Users can view own learning progress" on public.learning_progress
  for select using (auth.uid() = user_id);

create policy "Users can manage own learning progress" on public.learning_progress
  for all using (auth.uid() = user_id);

-- User preferences policies
create policy "Users can view own preferences" on public.user_preferences
  for select using (auth.uid() = user_id);

create policy "Users can manage own preferences" on public.user_preferences
  for all using (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to create user profile after signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  
  insert into public.progress (user_id) values (new.id);
  insert into public.learning_progress (user_id) values (new.id);
  insert into public.user_preferences (user_id) values (new.id);
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

create trigger update_progress_updated_at
  before update on public.progress
  for each row execute procedure public.update_updated_at_column();

create trigger update_learning_progress_updated_at
  before update on public.learning_progress
  for each row execute procedure public.update_updated_at_column();

create trigger update_user_preferences_updated_at
  before update on public.user_preferences
  for each row execute procedure public.update_updated_at_column();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
create index idx_srs_cards_user_next_review on public.srs_cards(user_id, next_review);
create index idx_daily_logs_user_date on public.daily_logs(user_id, date);
create index idx_review_history_user_date on public.review_history(user_id, date);
