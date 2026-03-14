/** Achievement data fetched from Supabase — positive metrics only. */
export interface AchievementData {
  lifetimeTasksCompleted: number;
  thingsShipped: number;
  bestStreak: number;
  currentStreak: number;
  rivalRecord: {
    userWins: number;
    adhdWins: number;
  };
  journalHighlights: JournalHighlight[];
}

export interface JournalHighlight {
  id: string;
  quote: string;
  date: string;
}
