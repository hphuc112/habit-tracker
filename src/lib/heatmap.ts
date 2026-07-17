import { startOfWeek, addDays, format } from 'date-fns';

export type HeatmapDay = {
  date: string;
  count: number;
};

export function countsByDateFromHabits(
  habits: { habit_logs: { date: string }[] }[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const habit of habits) {
    for (const log of habit.habit_logs) {
      counts[log.date] = (counts[log.date] ?? 0) + 1;
    }
  }
  return counts;
}

export function buildHeatmapGrid(
  counts: Record<string, number>,
  weeksBack: number = 53,
): HeatmapDay[][] {
  const today = new Date();
  const gridStart = startOfWeek(addDays(today, -(weeksBack * 7 - 7)), {
    weekStartsOn: 0,
  });

  const weeks: HeatmapDay[][] = [];
  let cursor = gridStart;

  for (let w = 0; w < weeksBack; w++) {
    const week: HeatmapDay[] = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = format(cursor, 'yyyy-MM-dd');
      week.push({ date: dateStr, count: counts[dateStr] ?? 0 });
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  }

  return weeks;
}

export function intensityLevel(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (max <= 1) return 4;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}
