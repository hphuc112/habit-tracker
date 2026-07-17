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
  const frequencyType = (formData.get('frequency_type') as string) || 'daily';
  const targetCount = Number(formData.get('target_count')) || 1;
  const graceDays = Number(formData.get('grace_days')) || 0;

  if (!name?.trim()) return;

  const { error } = await supabase.from('habits').insert({
    user_id: user.id,
    name: name.trim(),
    color: color || '#6366f1',
    frequency_type: frequencyType,
    target_count: targetCount,
    grace_days: graceDays,
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
