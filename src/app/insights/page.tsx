import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InsightsView } from '@/components/charts/InsightsView';
import { AppShell } from '@/components/layout/AppShell';
import { FetchError } from '@/components/layout/FetchError';

export default async function InsightsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: habits, error } = await supabase
    .from('habits')
    .select('id, name, created_at, habit_logs(date)')
    .eq('user_id', user.id)
    .is('archived_at', null)
    .order('created_at', { ascending: true });

  if (error) {
    return (
      <AppShell title="Insights">
        <FetchError message="We couldn't load insights. Check your connection and try again." />
      </AppShell>
    );
  }

  if (!habits || habits.length === 0) {
    return (
      <AppShell title="Insights">
        <p className="text-muted text-sm">
          Add a few habits and log some completions first — insights need data
          to work with.
        </p>
      </AppShell>
    );
  }

  return (
    <AppShell title="Insights">
      <InsightsView habits={habits} earliestDate={habits[0].created_at} />
    </AppShell>
  );
}
