import { z } from 'zod';
export const BETA_SPOTS = 50;
export const OBSTACLES = ['J’ai du mal à rester régulier', 'J’ai du mal à avancer seul', 'Je ne sais pas quelles actions entreprendre', 'J’ai du mal à mesurer mes progrès', 'Je manque d’un entourage qui partage mes objectifs', 'Autre difficulté'] as const;
export const waitlistSchema = z.object({
  email: z.string().trim().toLowerCase().email('Entre une adresse e-mail valide.').max(254),
  whatsapp: z.string().trim().max(25).refine(v=>v===''||/^\+?[0-9 ().-]{8,24}$/.test(v)).optional().default(''),
  goal: z.enum(['Explorer Résonance', 'Confiance en soi', 'Organisation', 'Prise de parole', 'Projet personnel']),
  obstacle: z.union([z.enum(OBSTACLES), z.literal('')]).optional().default(''),
  strengths: z.string().trim().max(200).optional().default(''),
  consent: z.literal(true),
  website: z.string().max(0),
});
export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  message: z.string().trim().min(10).max(2000),
  website: z.string().max(0),
});
