import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InsightsView } from '@/components/charts/InsightsView';

export default async function InsightsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: habits } = await supabase
    .from('habits')
    .select('id, name, created_at, habit_logs(date)')
    .eq('user_id', user.id)
    .is('archived_at', null)
    .order('created_at', { ascending: true });

  if (!habits || habits.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-4 text-2xl font-semibold">Insights</h1>
        <p className="text-sm text-gray-500">
          Add a few habits and log some completions first — insights need data
          to work with.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Insights</h1>
      <InsightsView habits={habits} earliestDate={habits[0].created_at} />
    </main>
  );
}
