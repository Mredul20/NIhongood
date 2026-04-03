-- Migration: Add 'kanji' to srs_cards type constraint
-- Run this in your Supabase SQL Editor

ALTER TABLE public.srs_cards
  DROP CONSTRAINT IF EXISTS srs_cards_type_check;

ALTER TABLE public.srs_cards
  ADD CONSTRAINT srs_cards_type_check
  CHECK (type IN ('kana', 'vocab', 'grammar', 'kanji'));
