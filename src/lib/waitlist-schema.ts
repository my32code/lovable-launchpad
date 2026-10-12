import { z } from 'zod';
export const BETA_SPOTS = 50;
export const waitlistSchema = z.object({
  email: z.string().trim().toLowerCase().email('Entre une adresse e-mail valide.').max(254),
  whatsapp: z.string().trim().max(25).refine(v=>v===''||/^\+?[0-9 ().-]{8,24}$/.test(v)).optional().default(''),
  goal: z.enum(['Explorer Résonance', 'Confiance en soi', 'Organisation', 'Prise de parole', 'Projet personnel']),
  consent: z.literal(true),
  website: z.string().max(0),
});
export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  message: z.string().trim().min(10).max(2000),
  website: z.string().max(0),
});
