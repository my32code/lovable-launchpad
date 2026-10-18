import { z } from 'zod';
export const BETA_SPOTS = 50;
export const FOCUS_CATEGORIES = ['Discipline & Organisation', 'Confiance & Expression', 'Clarté & Prise de décision', 'Habitudes de vie & Énergie', 'Mental & Dépassement'] as const;
export const FOCUS_OPTIONS = [
  { value: FOCUS_CATEGORIES[0], label: '🌱 Discipline & Organisation', example: 'vaincre la procrastination, structurer mes journées' },
  { value: FOCUS_CATEGORIES[1], label: '🗣️ Confiance & Expression', example: 'oser parler en public, m’affirmer face aux autres' },
  { value: FOCUS_CATEGORIES[2], label: '🧠 Clarté & Prise de décision', example: 'définir mes priorités, arrêter de trop réfléchir' },
  { value: FOCUS_CATEGORIES[3], label: '✨ Habitudes de vie & Énergie', example: 'ancrer une routine, trouver mon équilibre' },
  { value: FOCUS_CATEGORIES[4], label: '🔥 Mental & Dépassement', example: 'dompter le syndrome de l’imposteur, oser me lancer' },
] as const;
export const waitlistSchema = z.object({
  email: z.string().trim().toLowerCase().email('Entre une adresse e-mail valide.').max(254),
  whatsapp: z.string().trim().min(8, 'Entre un numéro WhatsApp valide.').max(25).refine(v=>/^\+?[0-9 ().-]{8,24}$/.test(v), 'Entre un numéro WhatsApp valide avec l’indicatif (ex. +229 01 23 45 67).'),
  goal: z.enum(FOCUS_CATEGORIES, { message: 'Choisis ton focus général.' }),
  goal_detail: z.string().trim().max(500, 'Ta précision doit tenir en 500 caractères.').optional(),
  strengths: z.enum(FOCUS_CATEGORIES, { message: 'Choisis ton domaine de force.' }),
  strengths_detail: z.string().trim().max(500, 'Ton talent concret doit tenir en 500 caractères.').optional(),
  consent: z.literal(true),
  website: z.string().max(0),
});
export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  message: z.string().trim().min(10).max(2000),
  website: z.string().max(0),
});
