'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  bestDayOfWeek,
  habitCorrelations,
  weeklyTrend,
  type HabitLogInput,
} from '@/lib/insights';

type Habit = {
  id: string;
  name: string;
  created_at: string;
  habit_logs: { date: string }[];
};

const chartColors = {
  primary: 'var(--chart-primary)',
  grid: 'var(--chart-grid)',
  axis: 'var(--chart-axis)',
};

const axisTick = { fontSize: 12, fill: chartColors.axis };

export function InsightsView({
  habits,
  earliestDate,
}: {
  habits: Habit[];
  earliestDate: string;
}) {
  const allLogs: HabitLogInput[] = habits.flatMap((h) =>
    h.habit_logs.map((log) => ({
      habit_id: h.id,
      habit_name: h.name,
      date: log.date,
    })),
  );

  const { stats: weekdayStats, bestDay } = bestDayOfWeek(
    allLogs,
    earliestDate.split('T')[0],
  );
  const correlations = habitCorrelations(
    habits.map((h) => ({
      id: h.id,
      name: h.name,
      logs: h.habit_logs.map((l) => l.date),
    })),
  );
  const trend = weeklyTrend(allLogs);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-3 text-lg font-medium">Best day of the week</h2>
        <p className="text-muted mb-3 text-sm">
          {bestDay ? (
            <>
              You complete the most habits on{' '}
              <span className="text-foreground font-semibold">{bestDay}s</span>.
            </>
          ) : (
            'Not enough data yet.'
          )}
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weekdayStats}>
            <CartesianGrid
              stroke={chartColors.grid}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis dataKey="day" tick={axisTick} />
            <YAxis tick={axisTick} allowDecimals={false} width={32} />
            <Tooltip
              formatter={(value) =>
                typeof value === 'number' ? value.toFixed(2) : value
              }
            />
            <Bar
              dataKey="avgCompletions"
              radius={[4, 4, 0, 0]}
              fill={chartColors.primary}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">Habit correlations</h2>
        {correlations.length === 0 ? (
          <p className="text-muted text-sm">
            Need at least two habits with some overlapping history to compare.
          </p>
        ) : (
          <ul className="space-y-2">
            {correlations.slice(0, 5).map((c) => (
              <li
                key={`${c.habitAName}-${c.habitBName}`}
                className="border-border flex flex-wrap items-center justify-between gap-2 rounded border px-4 py-2 text-sm"
              >
                <span className="min-w-0">
                  {c.habitAName}{' '}
                  <span className="text-muted">+</span> {c.habitBName}
                </span>
                <span className="text-muted shrink-0">
                  {Math.round(c.score * 100)}% co-occurrence
                  <span className="text-muted/70 ml-2 text-xs">
                    (n={c.sampleSize})
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">12-week trend</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trend}>
            <CartesianGrid
              stroke={chartColors.grid}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="weekLabel"
              tick={{ fontSize: 11, fill: chartColors.axis }}
              interval="preserveStartEnd"
            />
            <YAxis tick={axisTick} allowDecimals={false} width={32} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="completions"
              stroke={chartColors.primary}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
