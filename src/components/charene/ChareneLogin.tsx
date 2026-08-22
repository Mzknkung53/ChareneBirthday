'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export function ChareneLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '/charene/reader';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError('Supabase auth is not configured — add your keys to .env.local and restart the server.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError('Email or password did not match — double-check and try again.');
        return;
      }

      router.push(next);
      router.refresh();
    } catch {
      setError('Something went wrong. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-md gap-6 px-4 py-16">
      <div className="grid gap-2 text-center">
        <h1 className="font-display text-3xl text-rose-600">Charene ♡</h1>
        <p className="text-sm leading-relaxed text-ink-300">
          Sign in to read every birthday wish — only you can see them.
        </p>
      </div>

      <form onSubmit={handleSignIn} className="glass grid gap-4 rounded-feature p-6 shadow-card">
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error ? (
          <p role="alert" className="rounded-field border border-rose-500/30 bg-pink-100/80 p-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" fullWidth loading={loading} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="text-center text-xs text-ink-300">After sign-in you&apos;ll go to your private inbox.</p>
    </div>
  );
}
