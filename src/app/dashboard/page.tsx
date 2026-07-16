import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { HabitForm } from '@/components/habits/HabitForm';
import { HabitList } from '@/components/habits/HabitList';
import { LogoutButton } from '@/components/layout/LogoutButton';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: habits } = await supabase
    .from('habits')
    .select('*, habit_logs(date)')
    .eq('user_id', user.id)
    .is('archived_at', null)
    .order('created_at', { ascending: false });

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Habits</h1>
        <LogoutButton />
      </div>
      <HabitForm />
      <HabitList habits={habits ?? []} />
    </main>
  );
}
