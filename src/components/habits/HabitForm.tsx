'use client';

import { useRef, useState } from 'react';
import { createHabit } from '@/lib/actions/habits';

const inputClass =
  'border-border bg-background text-foreground w-full rounded border px-3 py-2 text-sm';

export function HabitForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>(
    'daily',
  );

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createHabit(formData);
        formRef.current?.reset();
        setFrequency('daily');
      }}
      className="mb-8 space-y-3"
    >
      <div className="flex gap-2">
        <input
          name="name"
          placeholder="New habit (e.g. Read 20 min)"
          required
          className={`${inputClass} flex-1`}
        />
        <input
          name="color"
          type="color"
          defaultValue="#c9b59c"
          className="border-border h-10 w-10 shrink-0 rounded border"
          aria-label="Habit color"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-[auto_auto_1fr_auto] sm:items-center">
        <select
          name="frequency_type"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as typeof frequency)}
          className={`${inputClass} sm:w-auto`}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly (calendar week)</option>
          <option value="custom">Custom (rolling 7 days)</option>
        </select>

        {frequency !== 'daily' ? (
          <label className="flex items-center gap-1 text-sm">
            Target:
            <input
              name="target_count"
              type="number"
              min={1}
              max={7}
              defaultValue={3}
              className="border-border bg-background w-14 rounded border px-2 py-1"
            />
            x
          </label>
        ) : (
          <span className="hidden sm:block" aria-hidden />
        )}

        <label className="flex flex-wrap items-center gap-1 text-sm sm:col-span-1">
          Grace:
          <input
            name="grace_days"
            type="number"
            min={0}
            max={7}
            defaultValue={0}
            className="border-border bg-background w-14 rounded border px-2 py-1"
          />
          <span className="text-muted text-xs">
            {frequency === 'daily'
              ? '(misses/week allowed)'
              : '(lowers target)'}
          </span>
        </label>

        <button
          type="submit"
          className="bg-primary text-background hover:bg-primary/90 w-full rounded px-4 py-2 text-sm transition sm:w-auto"
        >
          Add
        </button>
      </div>
    </form>
  );
}
