'use client';

import { useCallback, useEffect, useState } from 'react';
import { listWishesForAdmin, setWishHidden, signInAdmin, signOutAdmin } from '@/app/actions/wishes';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { WishCard } from '@/components/wishes/WishCard';
import type { BirthdayWish, LoadState } from '@/types';

export function ChareneDashboard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [wishes, setWishes] = useState<BirthdayWish[]>([]);
  const [state, setState] = useState<LoadState>('idle');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setState('loading');
    const res = await listWishesForAdmin();
    if (res.error) {
      if (res.error === 'Please sign in.') {
        setSignedIn(false);
        setState('idle');
        return;
      }
      setError(res.error);
      setState('error');
      return;
    }
    setWishes(res.data ?? []);
    setSignedIn(true);
    setError(null);
    setState('ready');
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError(null);
    const res = await signInAdmin(email.trim(), password);
    if (res.error) {
      setAuthError(res.error);
      return;
    }
    setPassword('');
    await load();
  };

  const handleSignOut = async () => {
    await signOutAdmin();
    setSignedIn(false);
    setWishes([]);
    setState('idle');
  };

  const handleHide = async (id: string, hidden: boolean) => {
    setWishes((list) => list.map((w) => (w.id === id ? { ...w, isHidden: hidden } : w)));
    const res = await setWishHidden(id, hidden);
    if (res.error) void load();
  };

  if (!signedIn) {
    return (
      <div className="mx-auto grid max-w-md gap-6 px-4 py-16">
        <div className="grid gap-2 text-center">
          <h1 className="font-display text-3xl text-rose-600">Charene ♡</h1>
          <p className="text-sm text-ink-300">Sign in to read every birthday wish — only you can see them.</p>
        </div>
        <form onSubmit={handleSignIn} className="glass grid gap-4 rounded-feature p-6 shadow-card">
          <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {authError ? <p className="text-sm text-rose-700">{authError}</p> : null}
          <Button type="submit" size="lg" fullWidth>
            Sign in
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-container gap-8 px-4 py-10 sm:px-8 lg:px-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(28px,5vw,40px)] text-rose-600">Your wishes ♡</h1>
          <p className="text-sm text-ink-300">
            {state === 'ready' ? `${wishes.length} messages — only visible to you.` : 'Loading…'}
          </p>
        </div>
        <Button variant="secondary" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>

      {error ? <p className="text-sm text-rose-700">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wishes.map((wish, index) => (
          <WishCard key={wish.id} wish={wish} index={index} onHide={handleHide} />
        ))}
      </div>
    </div>
  );
}
