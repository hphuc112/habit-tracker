'use client';

import { useState } from 'react';
import { updateHabit } from '@/lib/actions/habits';

const inputClass =
  'border-border bg-background text-foreground rounded border px-2 py-1 text-sm';

type Habit = {
  id: string;
  name: string;
  color: string;
  frequency_type: 'daily' | 'weekly' | 'custom';
  target_count: number;
  grace_days: number;
};

export function HabitEditForm({
  habit,
  onCancel,
  onSaved,
}: {
  habit: Habit;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [frequency, setFrequency] = useState(habit.frequency_type);

  return (
    <form
      action={async (formData) => {
        await updateHabit(habit.id, formData);
        onSaved();
      }}
      className="border-border bg-accent/50 mt-3 space-y-3 rounded border p-3"
    >
      <div className="flex gap-2">
        <input
          name="name"
          defaultValue={habit.name}
          required
          className={`${inputClass} flex-1`}
        />
        <input
          name="color"
          type="color"
          defaultValue={habit.color}
          className="border-border h-9 w-9 shrink-0 rounded border"
          aria-label="Habit color"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <select
          name="frequency_type"
          value={frequency}
          onChange={(e) =>
            setFrequency(e.target.value as typeof frequency)
          }
          className={inputClass}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly (calendar week)</option>
          <option value="custom">Custom (rolling 7 days)</option>
        </select>

        {frequency !== 'daily' && (
          <label className="flex items-center gap-1">
            Target:
            <input
              name="target_count"
              type="number"
              min={1}
              max={7}
              defaultValue={habit.target_count}
              className="border-border bg-background w-14 rounded border px-2 py-1"
            />
            x
          </label>
        )}

        <label className="flex items-center gap-1">
          Grace:
          <input
            name="grace_days"
            type="number"
            min={0}
            max={7}
            defaultValue={habit.grace_days}
            className="border-border bg-background w-14 rounded border px-2 py-1"
          />
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-primary text-background hover:bg-primary/90 rounded px-3 py-1 text-sm transition"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border-border hover:bg-background rounded border px-3 py-1 text-sm transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
