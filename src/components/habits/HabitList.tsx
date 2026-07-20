'use client';

import { useState } from 'react';
import {
  archiveHabit,
  deleteHabit,
  toggleHabitLog,
} from '@/lib/actions/habits';
import { calculateStreaks, todayISO } from '@/lib/streaks';
import { HabitEditForm } from '@/components/habits/HabitEditForm';

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
  const [editingId, setEditingId] = useState<string | null>(null);

  if (habits.length === 0) {
    return (
      <p className="text-muted text-sm">
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
        const isEditing = editingId === habit.id;

        return (
          <li
            key={habit.id}
            className="border-border rounded border px-4 py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: habit.color }}
                />
                <span className="truncate">{habit.name}</span>
                <span className="bg-accent text-muted shrink-0 rounded px-2 py-0.5 text-xs">
                  {frequencyLabel(habit)}
                </span>
              </span>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <button
                  onClick={() => toggleHabitLog(habit.id, today)}
                  className={`rounded px-3 py-1 text-sm transition ${
                    doneToday
                      ? 'bg-success text-background'
                      : 'border-border hover:bg-accent border'
                  }`}
                >
                  {doneToday ? 'Done ✓' : 'Mark done'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setEditingId(isEditing ? null : habit.id)
                  }
                  className="text-muted hover:text-foreground text-xs underline transition"
                >
                  {isEditing ? 'Close' : 'Edit'}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (
                      !window.confirm(
                        `Archive "${habit.name}"? You can add a new habit anytime; archived habits are hidden from the dashboard.`,
                      )
                    ) {
                      return;
                    }
                    await archiveHabit(habit.id);
                  }}
                  className="text-muted hover:text-foreground text-xs underline transition"
                >
                  Archive
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (
                      !window.confirm(
                        `Permanently delete "${habit.name}" and all its logs? This cannot be undone.`,
                      )
                    ) {
                      return;
                    }
                    await deleteHabit(habit.id);
                  }}
                  className="text-danger text-xs underline transition hover:opacity-80"
                >
                  Delete
                </button>
              </div>
            </div>

            {!isEditing && (
              <div className="text-muted mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                <span>
                  {current}{' '}
                  {habit.frequency_type === 'daily' ? 'day' : 'period'} streak
                </span>
                <span>Best: {longest}</span>
                <span>{Math.round(completionRate * 100)}% completion</span>
              </div>
            )}

            {isEditing && (
              <HabitEditForm
                habit={habit}
                onCancel={() => setEditingId(null)}
                onSaved={() => setEditingId(null)}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
