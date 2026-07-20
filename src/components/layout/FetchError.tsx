'use client';

export function FetchError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="border-danger/30 bg-danger/5 rounded-lg border px-4 py-6 text-center"
    >
      <p className="text-foreground font-medium">Could not load data</p>
      <p className="text-muted mt-1 text-sm">{message}</p>
      <button
        type="button"
        onClick={onRetry ?? (() => window.location.reload())}
        className="bg-primary text-background hover:bg-primary/90 mt-4 rounded px-4 py-2 text-sm transition"
      >
        Try again
      </button>
    </div>
  );
}
