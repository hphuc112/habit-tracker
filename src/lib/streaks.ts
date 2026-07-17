import {
  format,
  addDays,
  subDays,
  parseISO,
  differenceInCalendarDays,
  startOfWeek,
} from 'date-fns';

export function toLocalISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function todayISO(): string {
  return toLocalISODate(new Date());
}

export type HabitForStreak = {
  frequency_type: 'daily' | 'weekly' | 'custom';
  target_count: number;
  grace_days: number;
  created_at: string;
};

export type StreakResult = {
  current: number;
  longest: number;
  completionRate: number;
};

const DAILY_GRACE_WINDOW = 7; // "N misses per week" per the brief

function computeDaily(
  sortedDates: string[],
  graceDays: number,
  createdAt: string,
): StreakResult {
  const dateSet = new Set(sortedDates);
  const createdDate = parseISO(createdAt.split('T')[0]);
  const today = new Date();

  // Longest streak: scan forward from creation, allowing up to `graceDays`
  // misses per trailing 7-day window without breaking the run.
  let longest = 0;
  let run = 0;
  const forwardWindow: boolean[] = [];
  let cursor = createdDate;
  while (cursor <= today) {
    const done = dateSet.has(toLocalISODate(cursor));
    forwardWindow.push(done);
    if (forwardWindow.length > DAILY_GRACE_WINDOW) forwardWindow.shift();
    const misses = forwardWindow.filter((d) => !d).length;

    if (done) {
      run += 1;
    } else if (misses <= graceDays) {
      // forgiven miss — run neither grows nor resets
    } else {
      run = 0;
    }
    longest = Math.max(longest, run);
    cursor = addDays(cursor, 1);
  }

  // Current streak: walk backward from today (or yesterday if today isn't
  // logged yet — day isn't over, shouldn't zero an intact streak).
  const anchor = dateSet.has(toLocalISODate(today)) ? today : subDays(today, 1);
  let current = 0;
  const backWindow: boolean[] = [];
  let backCursor = anchor;
  while (backCursor >= createdDate) {
    const done = dateSet.has(toLocalISODate(backCursor));
    backWindow.unshift(done);
    if (backWindow.length > DAILY_GRACE_WINDOW) backWindow.pop();
    const misses = backWindow.filter((d) => !d).length;

    if (done) {
      current += 1;
    } else if (misses > graceDays) {
      break;
    }
    backCursor = subDays(backCursor, 1);
  }

  const daysSinceCreated = differenceInCalendarDays(today, createdDate) + 1;
  const completionRate = Math.min(
    1,
    sortedDates.length / Math.max(1, daysSinceCreated),
  );

  return { current, longest, completionRate };
}

function computeByPeriod(
  sortedDates: string[],
  targetCount: number,
  graceDays: number,
  createdAt: string,
  periodAnchor: 'monday' | 'creation',
): StreakResult {
  const threshold = Math.max(1, targetCount - graceDays);
  const createdDate = parseISO(createdAt.split('T')[0]);
  const today = new Date();

  // NOTE: for 'weekly', blocks align to the Monday of the habit's creation
  // week, not the exact creation day — a minor edge case for week one only.
  const blockStart =
    periodAnchor === 'monday'
      ? startOfWeek(createdDate, { weekStartsOn: 1 })
      : createdDate;

  const totalDays = differenceInCalendarDays(today, blockStart);
  const totalBlocks = Math.floor(totalDays / 7) + 1;

  const countsByBlock = new Map<number, number>();
  for (const d of sortedDates) {
    const offset = differenceInCalendarDays(parseISO(d), blockStart);
    if (offset < 0) continue;
    countsByBlock.set(
      Math.floor(offset / 7),
      (countsByBlock.get(Math.floor(offset / 7)) ?? 0) + 1,
    );
  }

  let longest = 0;
  let run = 0;
  let periodsMet = 0;
  for (let b = 0; b < totalBlocks; b++) {
    const met = (countsByBlock.get(b) ?? 0) >= threshold;
    if (met) periodsMet += 1;
    run = met ? run + 1 : 0;
    longest = Math.max(longest, run);
  }

  const lastBlockIdx = totalBlocks - 1;
  const lastBlockMet = (countsByBlock.get(lastBlockIdx) ?? 0) >= threshold;
  let current = 0;
  let idx = lastBlockMet ? lastBlockIdx : lastBlockIdx - 1;
  while (idx >= 0) {
    const met = (countsByBlock.get(idx) ?? 0) >= threshold;
    if (!met) break;
    current += 1;
    idx -= 1;
  }

  const completionRate = totalBlocks > 0 ? periodsMet / totalBlocks : 0;

  return { current, longest, completionRate };
}

export function calculateStreaks(
  logDates: string[],
  habit: HabitForStreak,
): StreakResult {
  const sortedDates = Array.from(new Set(logDates)).sort();
  if (sortedDates.length === 0) {
    return { current: 0, longest: 0, completionRate: 0 };
  }

  if (habit.frequency_type === 'daily') {
    return computeDaily(sortedDates, habit.grace_days, habit.created_at);
  }

  if (habit.frequency_type === 'weekly') {
    return computeByPeriod(
      sortedDates,
      habit.target_count,
      habit.grace_days,
      habit.created_at,
      'monday',
    );
  }

  return computeByPeriod(
    sortedDates,
    habit.target_count,
    habit.grace_days,
    habit.created_at,
    'creation',
  );
}
