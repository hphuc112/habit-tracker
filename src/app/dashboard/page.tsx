import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { HabitForm } from '@/components/habits/HabitForm';
import { HabitList } from '@/components/habits/HabitList';
import { LogoutButton } from '@/components/layout/LogoutButton';
import { ContributionHeatmap } from '@/components/heatmap/ContributionHeatmap';
import { countsByDateFromHabits } from '@/lib/heatmap';
import Link from 'next/link';

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

  const counts = countsByDateFromHabits(habits ?? []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Habits</h1>
        <LogoutButton />
      </div>
      <div className="mb-8">
        <ContributionHeatmap counts={counts} />
      </div>
      <HabitForm />
      <HabitList habits={habits ?? []} />
    </main>
  );
}
<div className="mb-6 flex items-center justify-between">
  <h1 className="text-2xl font-semibold">Your Habits</h1>
  <div className="flex items-center gap-4">
    <Link href="/insights" className="text-sm underline">
      Insights
    </Link>
    <LogoutButton />
  </div>
</div>;
