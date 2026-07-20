import Link from 'next/link';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export default function Home() {
  return (
    <main className="bg-background relative flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="border-border bg-accent w-full max-w-4xl rounded-3xl border p-8 md:p-12">
        <p className="text-secondary mb-4 text-sm font-semibold tracking-[0.3em] uppercase">
          Habit Tracker
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Build consistency with insight-rich habits.
        </h1>
        <p className="text-muted mt-4 max-w-2xl text-lg">
          Track daily routines, review streaks, and explore correlations between
          habits through a visual contribution-style dashboard.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="bg-primary text-background hover:bg-primary/90 rounded-full px-5 py-3 font-medium transition"
          >
            Open dashboard
          </Link>
          <Link
            href="/login"
            className="border-border hover:bg-background rounded-full border px-5 py-3 font-medium transition"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
