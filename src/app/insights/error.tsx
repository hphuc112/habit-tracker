'use client';

export default function InsightsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Insights</h1>
      <div
        role="alert"
        className="border-danger/30 bg-danger/5 mt-6 rounded-lg border px-4 py-6 text-center"
      >
        <p className="text-foreground font-medium">Something went wrong</p>
        <p className="text-muted mt-1 text-sm">{error.message}</p>
        <button
          type="button"
          onClick={reset}
          className="bg-primary text-background hover:bg-primary/90 mt-4 rounded px-4 py-2 text-sm transition"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
