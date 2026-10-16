import { createServerFn } from '@tanstack/react-start';
import { waitlistSchema, contactSchema, BETA_SPOTS } from './waitlist-schema';

// Public aggregate only: returns how many beta spots are taken, never any lead data.
export const getBetaSpots = createServerFn({ method: 'GET' }).handler(async () => {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { count } = await supabaseAdmin.from('beta_waitlist').select('id', { count: 'exact', head: true }).eq('kind', 'beta');
  const taken = Math.min(count ?? 0, BETA_SPOTS);
  return { taken, remaining: BETA_SPOTS - taken };
});

// Deliberately public, append-only registration. First 50 become beta members, then priority list.
export const joinWaitlist = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => waitlistSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { count } = await supabaseAdmin.from('beta_waitlist').select('id', { count: 'exact', head: true }).eq('kind', 'beta');
    const kind = (count ?? 0) < BETA_SPOTS ? 'beta' : 'priority';
    if (kind === 'beta' && !data.whatsapp) return { ok: false, message: 'Ajoute ton numéro WhatsApp pour rejoindre les 50.' };
    const { data: inserted, error } = await supabaseAdmin.from('beta_waitlist').upsert(
      { email: data.email, goal: data.goal, kind, whatsapp: data.whatsapp || null, obstacle: data.obstacle || null },
      { onConflict: 'email', ignoreDuplicates: true },
    ).select('id');
    if (error) return { ok: false, message: 'L’inscription n’a pas pu être enregistrée. Réessaie dans un instant.' };
    if (inserted && inserted.length > 0) {
      const { notifyOwnerOfSignup } = await import('./signup-notify.server');
      await notifyOwnerOfSignup({ email: data.email, whatsapp: data.whatsapp, goal: data.goal, obstacle: data.obstacle, kind, position: (count ?? 0) + 1 });
    }
    return { ok: true, message: 'Ton inscription est enregistrée.' };
  });

export const sendContact = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { error } = await supabaseAdmin.from('contact_messages').insert({ name: data.name, email: data.email, message: data.message });
    if (error) return { ok: false, message: 'Ton message n’a pas pu être envoyé. Réessaie dans un instant.' };
    const { notifyOwnerOfContact } = await import('./signup-notify.server');
    await notifyOwnerOfContact({ name: data.name, email: data.email, message: data.message });
    return { ok: true, message: 'Merci, ton message est bien arrivé.' };
  });
