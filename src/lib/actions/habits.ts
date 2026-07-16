'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function createHabit(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const name = formData.get('name') as string;
  const color = formData.get('color') as string;

  if (!name?.trim()) return;

  const { error } = await supabase.from('habits').insert({
    user_id: user.id,
    name: name.trim(),
    color: color || '#6366f1',
  });

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard');
}

export async function toggleHabitLog(habitId: string, date: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: existing } = await supabase
    .from('habit_logs')
    .select('id')
    .eq('habit_id', habitId)
    .eq('date', date)
    .maybeSingle();

  if (existing) {
    await supabase.from('habit_logs').delete().eq('id', existing.id);
  } else {
    await supabase.from('habit_logs').insert({ habit_id: habitId, date });
  }

  revalidatePath('/dashboard');
}
