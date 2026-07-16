'use client';

import { useRef } from 'react';
import { createHabit } from '@/lib/actions/habits';

export function HabitForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createHabit(formData);
        formRef.current?.reset();
      }}
      className="mb-8 flex gap-2"
    >
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
      <button type="submit" className="rounded bg-black px-4 py-2 text-white">
        Add
      </button>
    </form>
  );
}
