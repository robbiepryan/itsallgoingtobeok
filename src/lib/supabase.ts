/**
 * Supabase client — fetches achievement data via PostgREST REST API.
 *
 * Uses raw fetch instead of @supabase/supabase-js to keep the
 * bundle tiny (~0KB overhead vs ~50KB for the SDK). The anon key
 * is intentionally public — Row Level Security on the Supabase
 * side controls data access (public_read policy).
 */

import type { AchievementData, JournalHighlight } from './types';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';

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
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/achievement_feed?select=*&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Comms jammed:', response.status, response.statusText);
      return getEmptyData();
    }

    const rows: AchievementFeedRow[] = await response.json();
    if (rows.length === 0) return getEmptyData();

    const row = rows[0];
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
