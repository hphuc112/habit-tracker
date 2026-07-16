'use client';

import { toggleHabitLog } from '@/lib/actions/habits';

type Habit = {
  id: string;
  name: string;
  color: string;
  habit_logs: { date: string }[];
};

function todayISO() {
  return new Date().toISOString().split('T')[0];
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
        const doneToday = habit.habit_logs.some((log) => log.date === today);

        return (
          <li
            key={habit.id}
            className="flex items-center justify-between rounded border px-4 py-3"
          >
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
          </li>
        );
      })}
    </ul>
  );
}
