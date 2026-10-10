import { createServerFn } from '@tanstack/react-start';
import { waitlistSchema } from './waitlist-schema';

// Deliberately public, append-only registration. Never exposes leads or duplicate status.
export const joinWaitlist = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => waitlistSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { error } = await supabaseAdmin.from('beta_waitlist').upsert(
      { email: data.email, goal: data.goal },
      { onConflict: 'email', ignoreDuplicates: true },
    );
    if (error) return { ok: false, message: 'L’inscription n’a pas pu être enregistrée. Réessaie dans un instant.' };
    return { ok: true, message: 'Ton inscription est enregistrée.' };
  });
