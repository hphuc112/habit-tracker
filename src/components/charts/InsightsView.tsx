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
        <p className="mb-3 text-sm text-gray-500">
          {bestDay ? (
            <>
              You complete the most habits on{' '}
              <span className="font-semibold">{bestDay}s</span>.
            </>
          ) : (
            'Not enough data yet.'
          )}
        </p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weekdayStats}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              formatter={(value) =>
                typeof value === 'number' ? value.toFixed(2) : value
              }
            />
            <Bar
              dataKey="avgCompletions"
              radius={[4, 4, 0, 0]}
              fill="#6366f1"
            />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">Habit correlations</h2>
        {correlations.length === 0 ? (
          <p className="text-sm text-gray-500">
            Need at least two habits with some overlapping history to compare.
          </p>
        ) : (
          <ul className="space-y-2">
            {correlations.slice(0, 5).map((c) => (
              <li
                key={`${c.habitAName}-${c.habitBName}`}
                className="flex items-center justify-between rounded border px-4 py-2 text-sm"
              >
                <span>
                  {c.habitAName} <span className="text-gray-400">+</span>{' '}
                  {c.habitBName}
                </span>
                <span className="text-gray-500">
                  {Math.round(c.score * 100)}% co-occurrence
                  <span className="ml-2 text-xs text-gray-400">
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
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="weekLabel" tick={{ fontSize: 11 }} interval={1} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="completions"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
