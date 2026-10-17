import { z } from 'zod';
export const BETA_SPOTS = 50;
export const OBSTACLES = ['J’ai du mal à rester régulier', 'J’ai du mal à avancer seul', 'Je ne sais pas quelles actions entreprendre', 'J’ai du mal à mesurer mes progrès', 'Je manque d’un entourage qui partage mes objectifs', 'Autre difficulté'] as const;
export const waitlistSchema = z.object({
  email: z.string().trim().toLowerCase().email('Entre une adresse e-mail valide.').max(254),
  whatsapp: z.string().trim().min(8, 'Entre un numéro WhatsApp valide.').max(25).refine(v=>/^\+?[0-9 ().-]{8,24}$/.test(v), 'Entre un numéro WhatsApp valide avec l’indicatif (ex. +229 01 23 45 67).'),
  goal: z.enum(['Confiance en soi', 'Organisation', 'Prise de parole', 'Projet personnel']),
  obstacle: z.enum(OBSTACLES),
  strengths: z.string().trim().min(2, 'Dis-nous ce que tu peux offrir ou partager.').max(200),
  consent: z.literal(true),
  website: z.string().max(0),
});
export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  message: z.string().trim().min(10).max(2000),
  website: z.string().max(0),
});
