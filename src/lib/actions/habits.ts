'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

function revalidateHabitPaths() {
  revalidatePath('/dashboard');
  revalidatePath('/insights');
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return { supabase, user };
}

export async function createHabit(formData: FormData) {
  const { supabase, user } = await requireUser();

  const name = formData.get('name') as string;
  const color = formData.get('color') as string;
  const frequencyType = (formData.get('frequency_type') as string) || 'daily';
  const targetCount = Number(formData.get('target_count')) || 1;
  const graceDays = Number(formData.get('grace_days')) || 0;

  if (!name?.trim()) return;

  const { error } = await supabase.from('habits').insert({
    user_id: user.id,
    name: name.trim(),
    color: color || '#c9b59c',
    frequency_type: frequencyType,
    target_count: targetCount,
    grace_days: graceDays,
  });

  if (error) throw new Error(error.message);

  revalidateHabitPaths();
}

export async function updateHabit(habitId: string, formData: FormData) {
  const { supabase, user } = await requireUser();

  const name = formData.get('name') as string;
  const color = formData.get('color') as string;
  const frequencyType = (formData.get('frequency_type') as string) || 'daily';
  const targetCount = Number(formData.get('target_count')) || 1;
  const graceDays = Number(formData.get('grace_days')) || 0;

  if (!name?.trim()) return;

  const { error } = await supabase
    .from('habits')
    .update({
      name: name.trim(),
      color: color || '#c9b59c',
      frequency_type: frequencyType,
      target_count: targetCount,
      grace_days: graceDays,
    })
    .eq('id', habitId)
    .eq('user_id', user.id)
    .is('archived_at', null);

  if (error) throw new Error(error.message);

  revalidateHabitPaths();
}

export async function archiveHabit(habitId: string) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from('habits')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', habitId)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);

  revalidateHabitPaths();
}

export async function deleteHabit(habitId: string) {
  const { supabase, user } = await requireUser();

  const { error: logsError } = await supabase
    .from('habit_logs')
    .delete()
    .eq('habit_id', habitId);

  if (logsError) throw new Error(logsError.message);

  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);

  revalidateHabitPaths();
}

export async function toggleHabitLog(habitId: string, date: string) {
  const { supabase } = await requireUser();

  const { data: existing } = await supabase
    .from('habit_logs')
    .select('id')
    .eq('habit_id', habitId)
    .eq('date', date)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('habit_logs')
      .delete()
      .eq('id', existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from('habit_logs')
      .insert({ habit_id: habitId, date });
    if (error) throw new Error(error.message);
  }

  revalidateHabitPaths();
}
