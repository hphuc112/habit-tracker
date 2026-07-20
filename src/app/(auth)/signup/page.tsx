'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

const inputClass =
  'border-border bg-background text-foreground w-full rounded border px-3 py-2';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setCheckEmail(true);
    }
  }

  if (checkEmail) {
    return (
      <main className="relative mx-auto max-w-sm px-4 py-20">
        <div className="absolute top-6 right-4">
          <ThemeToggle />
        </div>
        <p className="text-muted">
          Check your email to confirm your account, then log in.
        </p>
        <p className="text-muted mt-4 text-sm">
          <Link href="/login" className="text-foreground underline">
            Go to log in
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="relative mx-auto max-w-sm px-4 py-20">
      <div className="absolute top-6 right-4">
        <ThemeToggle />
      </div>
      <h1 className="mb-6 text-2xl font-semibold">Sign up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClass}
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className={inputClass}
        />
        {error && <p className="text-danger text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-background hover:bg-primary/90 w-full rounded px-4 py-2 disabled:opacity-50"
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
      </form>
      <p className="text-muted mt-4 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-foreground underline">
          Log in
        </Link>
      </p>
      <p className="text-muted mt-2 text-sm">
        <Link href="/" className="underline">
          Back to home
        </Link>
      </p>
    </main>
  );
}
