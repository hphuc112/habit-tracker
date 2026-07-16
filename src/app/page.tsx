import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-16 text-white">
      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur md:p-12">
        <p className="mb-4 text-sm font-semibold tracking-[0.3em] text-cyan-300 uppercase">
          Habit Tracker
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Build consistency with insight-rich habits.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Track daily routines, review streaks, and explore correlations between
          habits through a visual contribution-style dashboard.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="rounded-full bg-cyan-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-300"
          >
            Open dashboard
          </Link>
          <Link
            href="/insights"
            className="rounded-full border border-white/20 px-5 py-3 font-medium text-white transition hover:bg-white/10"
          >
            View insights
          </Link>
        </div>
      </div>
    </main>
  );
}
