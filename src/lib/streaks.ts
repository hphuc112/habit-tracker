export type StreakSummary = {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
};

export function calculateStreakSummary(completions: boolean[]): StreakSummary {
  const completed = completions.filter(Boolean).length;
  const total = completions.length || 1;

  let currentStreak = 0;
  for (let i = completions.length - 1; i >= 0; i -= 1) {
    if (!completions[i]) break;
    currentStreak += 1;
  }

  let longestStreak = 0;
  let running = 0;

  for (const completedToday of completions) {
    if (completedToday) {
      running += 1;
      longestStreak = Math.max(longestStreak, running);
    } else {
      running = 0;
    }
  }

  return {
    currentStreak,
    longestStreak,
    completionRate: Math.round((completed / total) * 100),
  };
}
