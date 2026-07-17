import {
  parseISO,
  differenceInCalendarDays,
  format,
  startOfWeek,
} from 'date-fns';

export type HabitLogInput = {
  habit_id: string;
  habit_name: string;
  date: string;
};

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MIN_CORRELATION_SAMPLE = 5;

export type WeekdayStat = {
  day: string;
  avgCompletions: number;
};

export function bestDayOfWeek(
  logs: HabitLogInput[],
  earliestDate: string,
): { stats: WeekdayStat[]; bestDay: string | null } {
  if (logs.length === 0) return { stats: [], bestDay: null };

  const countsByWeekday = new Array(7).fill(0);
  for (const log of logs) {
    countsByWeekday[parseISO(log.date).getDay()] += 1;
  }

  const start = parseISO(earliestDate);
  const today = new Date();
  const totalDays = differenceInCalendarDays(today, start) + 1;

  const occurrencesByWeekday = new Array(7).fill(0);
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    occurrencesByWeekday[d.getDay()] += 1;
  }

  const stats: WeekdayStat[] = countsByWeekday.map((count, i) => ({
    day: WEEKDAY_LABELS[i],
    avgCompletions:
      occurrencesByWeekday[i] > 0 ? count / occurrencesByWeekday[i] : 0,
  }));

  // reorder Sun..Sat -> Mon..Sun for display
  const monFirst = [...stats.slice(1), stats[0]];
  const best = monFirst.reduce(
    (max, s) => (s.avgCompletions > max.avgCompletions ? s : max),
    monFirst[0],
  );

  return {
    stats: monFirst,
    bestDay: best.avgCompletions > 0 ? best.day : null,
  };
}

export type CorrelationResult = {
  habitAName: string;
  habitBName: string;
  score: number;
  sampleSize: number;
};

export function habitCorrelations(
  habitsWithLogs: { id: string; name: string; logs: string[] }[],
): CorrelationResult[] {
  const results: CorrelationResult[] = [];

  for (let i = 0; i < habitsWithLogs.length; i++) {
    for (let j = i + 1; j < habitsWithLogs.length; j++) {
      const a = habitsWithLogs[i];
      const b = habitsWithLogs[j];
      const setA = new Set(a.logs);
      const setB = new Set(b.logs);
      const union = new Set([...setA, ...setB]);
      if (union.size < MIN_CORRELATION_SAMPLE) continue;

      let intersection = 0;
      for (const d of setA) if (setB.has(d)) intersection += 1;

      results.push({
        habitAName: a.name,
        habitBName: b.name,
        score: intersection / union.size,
        sampleSize: union.size,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

export type WeekPoint = {
  weekLabel: string;
  completions: number;
};

export function weeklyTrend(
  logs: HabitLogInput[],
  weeksBack: number = 12,
): WeekPoint[] {
  const today = new Date();
  const buckets = new Map<string, number>();

  for (const log of logs) {
    const weekStart = startOfWeek(parseISO(log.date), { weekStartsOn: 1 });
    buckets.set(
      format(weekStart, 'yyyy-MM-dd'),
      (buckets.get(format(weekStart, 'yyyy-MM-dd')) ?? 0) + 1,
    );
  }

  const result: WeekPoint[] = [];
  for (let i = weeksBack - 1; i >= 0; i--) {
    const weekStart = startOfWeek(
      new Date(today.getTime() - i * 7 * 24 * 60 * 60 * 1000),
      { weekStartsOn: 1 },
    );
    const key = format(weekStart, 'yyyy-MM-dd');
    result.push({
      weekLabel: format(weekStart, 'MMM d'),
      completions: buckets.get(key) ?? 0,
    });
  }

  return result;
}
