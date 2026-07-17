'use client';

import { toggleHabitLog } from '@/lib/actions/habits';
import { calculateStreaks, todayISO } from '@/lib/streaks';

type Habit = {
  id: string;
  name: string;
  color: string;
  created_at: string;
  habit_logs: { date: string }[];
};

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
          habit.created_at,
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
              </span>
              <button
                onClick={() => toggleHabitLog(habit.id, today)}
                className={`rounded px-3 py-1 text-sm ${doneToday ? 'bg-green-600 text-white' : 'border'}`}
              >
                {doneToday ? 'Done ✓' : 'Mark done'}
              </button>
            </div>
            <div className="mt-2 flex gap-4 text-xs text-gray-500">
              <span>{current} day streak</span>
              <span>Best: {longest}</span>
              <span>{Math.round(completionRate * 100)}% completion</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
