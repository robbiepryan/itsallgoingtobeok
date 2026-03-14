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

// ── Multi-user types ──

/** User profile stored in the `profiles` table. */
export interface UserProfile {
  id: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  isPublic: boolean;
  createdAt: string;
}

/** Auth state for UI rendering. */
export type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

/** Authenticated user with optional profile. */
export interface AuthUser {
  id: string;
  email: string;
  profile: UserProfile | null;
}

/** Achievement data scoped to a specific user (for public profiles). */
export interface UserAchievementData extends AchievementData {
  userId: string;
  profile: UserProfile;
}

/** Route params for /u/[username] dynamic profile pages. */
export interface ProfileRouteParams {
  username: string;
}
