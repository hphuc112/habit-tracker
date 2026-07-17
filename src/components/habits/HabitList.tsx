'use client';

import { toggleHabitLog } from '@/lib/actions/habits';
import { calculateStreaks, todayISO } from '@/lib/streaks';

type Habit = {
  id: string;
  name: string;
  color: string;
  created_at: string;
  frequency_type: 'daily' | 'weekly' | 'custom';
  target_count: number;
  grace_days: number;
  habit_logs: { date: string }[];
};

function frequencyLabel(habit: Habit) {
  if (habit.frequency_type === 'daily') return 'Daily';
  if (habit.frequency_type === 'weekly') return `${habit.target_count}x / week`;
  return `${habit.target_count}x / 7 days`;
}

export function HabitList({ habits }: { habits: Habit[] }) {
  const today = todayISO();

  if (habits.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No habits yet — add your first one above.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {habits.map((habit) => {
        const logDates = habit.habit_logs.map((log) => log.date);
        const { current, longest, completionRate } = calculateStreaks(
          logDates,
          habit,
        );
        const doneToday = logDates.includes(today);

        return (
          <li key={habit.id} className="rounded border px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: habit.color }}
                />
                {habit.name}
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800">
                  {frequencyLabel(habit)}
                </span>
              </span>
              <button
                onClick={() => toggleHabitLog(habit.id, today)}
                className={`rounded px-3 py-1 text-sm ${doneToday ? 'bg-green-600 text-white' : 'border'}`}
              >
                {doneToday ? 'Done ✓' : 'Mark done'}
              </button>
            </div>
            <div className="mt-2 flex gap-4 text-xs text-gray-500">
              <span>
                {current} {habit.frequency_type === 'daily' ? 'day' : 'period'}{' '}
                streak
              </span>
              <span>Best: {longest}</span>
              <span>{Math.round(completionRate * 100)}% completion</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
