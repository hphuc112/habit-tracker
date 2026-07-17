import { format, subDays, differenceInCalendarDays, parseISO } from 'date-fns';

export function toLocalISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function todayISO(): string {
  return toLocalISODate(new Date());
}

export type StreakResult = {
  current: number;
  longest: number;
  completionRate: number;
};

export function calculateStreaks(
  logDates: string[],
  habitCreatedAt: string,
): StreakResult {
  if (logDates.length === 0) {
    return { current: 0, longest: 0, completionRate: 0 };
  }

  const dates = Array.from(new Set(logDates)).sort();
  const dateSet = new Set(dates);

  let longest = 1;
  let run = 1;
  for (let i = 1; i < dates.length; i++) {
    const gap = differenceInCalendarDays(
      parseISO(dates[i]),
      parseISO(dates[i - 1]),
    );
    run = gap === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const today = new Date();
  let cursor = dateSet.has(toLocalISODate(today)) ? today : subDays(today, 1);
  let current = 0;
  while (dateSet.has(toLocalISODate(cursor))) {
    current += 1;
    cursor = subDays(cursor, 1);
  }

  // Completion rate: logged days / calendar days since the habit was created
  const daysSinceCreated =
    differenceInCalendarDays(
      new Date(),
      parseISO(habitCreatedAt.split('T')[0]),
    ) + 1;
  const completionRate = Math.min(
    1,
    dates.length / Math.max(1, daysSinceCreated),
  );

  return { current, longest, completionRate };
}
