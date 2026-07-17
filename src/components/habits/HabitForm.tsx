'use client';

import { useRef, useState } from 'react';
import { createHabit } from '@/lib/actions/habits';

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
      className="mb-8 space-y-2"
    >
      <div className="flex gap-2">
        <input
          name="name"
          placeholder="New habit (e.g. Read 20 min)"
          required
          className="flex-1 rounded border px-3 py-2"
        />
        <input
          name="color"
          type="color"
          defaultValue="#6366f1"
          className="h-10 w-10 rounded border"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <select
          name="frequency_type"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as typeof frequency)}
          className="rounded border px-2 py-1"
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
              defaultValue={3}
              className="w-14 rounded border px-2 py-1"
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
            defaultValue={0}
            className="w-14 rounded border px-2 py-1"
          />
          <span className="text-xs text-gray-400">
            {frequency === 'daily'
              ? '(misses/week allowed)'
              : '(lowers target)'}
          </span>
        </label>

        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          Add
        </button>
      </div>
    </form>
  );
}
