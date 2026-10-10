import { z } from 'zod';
export const waitlistSchema = z.object({
  email: z.string().trim().toLowerCase().email('Entre une adresse e-mail valide.').max(254),
  goal: z.enum(['Explorer Résonance', 'Confiance en soi', 'Organisation', 'Prise de parole', 'Projet personnel']),
  consent: z.literal(true),
  website: z.string().max(0),
});
