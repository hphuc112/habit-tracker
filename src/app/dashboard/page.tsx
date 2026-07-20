import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { HabitForm } from '@/components/habits/HabitForm';
import { HabitList } from '@/components/habits/HabitList';
import { AppShell } from '@/components/layout/AppShell';
import { FetchError } from '@/components/layout/FetchError';
import { ContributionHeatmap } from '@/components/heatmap/ContributionHeatmap';
import { countsByDateFromHabits } from '@/lib/heatmap';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: habits, error } = await supabase
    .from('habits')
    .select('*, habit_logs(date)')
    .eq('user_id', user.id)
    .is('archived_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <AppShell title="Your Habits">
        <FetchError message="We couldn't load your habits. Check your connection and try again." />
      </AppShell>
    );
  }

  const counts = countsByDateFromHabits(habits ?? []);

  return (
    <AppShell title="Your Habits">
      <div className="mb-8">
        <ContributionHeatmap counts={counts} />
      </div>
      <HabitForm />
      <HabitList habits={habits ?? []} />
    </AppShell>
  );
}
