import type { ReactionEmoji, ServiceResult } from '@/types';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export const REACTIONS: ReactionEmoji[] = ['♡', '🌸', '🎂', '✨'];

/**
 * Toggling is optimistic in the UI; this call only persists the change.
 * TODO: Replace mock implementation with a Supabase upsert into wish_reactions
 * keyed by (wish_id, emoji, visitor_id) so a visitor can only react once.
 */
export async function toggleReaction(
  wishId: string,
  emoji: ReactionEmoji,
  on: boolean,
): Promise<ServiceResult<true>> {
  if (isSupabaseConfigured) {
    // TODO: persist to Supabase.
  }
  await new Promise<void>((r) => setTimeout(r, 120));
  void wishId;
  void emoji;
  void on;
  return { data: true, error: null };
}
