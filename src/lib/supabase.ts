/**
 * Supabase client — typed SDK client for auth, sessions, and data fetching.
 *
 * The anon key is intentionally public — Row Level Security on the Supabase
 * side controls data access.
 */

import { createClient } from '@supabase/supabase-js';
import type { AchievementData, JournalHighlight } from './types';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

/** Browser-side Supabase client (singleton). */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** Shape of the achievement_feed row from Supabase. */
interface AchievementFeedRow {
  id: string;
  lifetime_tasks_completed: number;
  shipped_projects: number;
  best_streak: number;
  current_streak: number;
  rival_career_wins: number;
  rival_career_losses: number;
  journal_highlights: JournalHighlight[];
  last_updated: string;
}

/** Fetch achievement data from the achievement_feed table. */
export async function fetchAchievements(): Promise<AchievementData> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return getEmptyData();
  }

  try {
    const { data, error } = await supabase
      .from('achievement_feed')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Comms jammed:', error.code, error.message);
      return getEmptyData();
    }

    if (!data) return getEmptyData();

    const row = data as AchievementFeedRow;
    return {
      lifetimeTasksCompleted: row.lifetime_tasks_completed,
      thingsShipped: row.shipped_projects,
      bestStreak: row.best_streak,
      currentStreak: row.current_streak,
      rivalRecord: {
        userWins: row.rival_career_wins,
        adhdWins: row.rival_career_losses,
      },
      journalHighlights: row.journal_highlights ?? [],
    };
  } catch (err) {
    console.error('ADHD cut the wire:', err);
    return getEmptyData();
  }
}

function getEmptyData(): AchievementData {
  return {
    lifetimeTasksCompleted: 0,
    thingsShipped: 0,
    bestStreak: 0,
    currentStreak: 0,
    rivalRecord: { userWins: 0, adhdWins: 0 },
    journalHighlights: [],
  };
}
