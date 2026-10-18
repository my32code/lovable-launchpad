import { describe, expect, it } from 'vitest';
import { waitlistSchema } from '@/lib/waitlist-schema';

const registration = { email: 'form-test@example.com', whatsapp: '+229 01 23 45 67', goal: 'Confiance & Expression', strengths: 'Discipline & Organisation', consent: true, website: '' };
const categories = ['Discipline & Organisation', 'Confiance & Expression', 'Clarté & Prise de décision', 'Habitudes de vie & Énergie', 'Mental & Dépassement'];

describe('Signup objective and contribution', () => {
  it('requires an objective from the five categories', () => {
    for (const goal of categories) expect(waitlistSchema.safeParse({ ...registration, goal }).success).toBe(true);
    for (const goal of ['', undefined, 'Organisation', 'Explorer Résonance']) expect(waitlistSchema.safeParse({ ...registration, goal }).success).toBe(false);
  });
  it('requires a contribution from the same five categories', () => {
    for (const strengths of categories) expect(waitlistSchema.safeParse({ ...registration, strengths }).success).toBe(true);
    for (const strengths of ['', undefined, 'Je suis orateur']) expect(waitlistSchema.safeParse({ ...registration, strengths }).success).toBe(false);
  });
  it('accepts an omitted or empty objective precision and preserves a supplied precision', () => {
    expect(waitlistSchema.safeParse(registration).success).toBe(true);
    expect(waitlistSchema.parse({ ...registration, goal_detail: '' }).goal_detail).toBe('');
    expect(waitlistSchema.parse({ ...registration, goal_detail: 'Je veux parler en public d’ici 1 mois.' }).goal_detail).toBe('Je veux parler en public d’ici 1 mois.');
  });
  it('accepts an omitted or empty talent and preserves a supplied talent', () => {
    expect(waitlistSchema.safeParse(registration).success).toBe(true);
    expect(waitlistSchema.parse({ ...registration, strengths_detail: '' }).strengths_detail).toBe('');
    expect(waitlistSchema.parse({ ...registration, strengths_detail: 'Je suis orateur/conférencier.' }).strengths_detail).toBe('Je suis orateur/conférencier.');
  });
  it('does not collect a frein', () => {
    expect(waitlistSchema.parse({ ...registration, obstacle: 'ancien frein' })).not.toHaveProperty('obstacle');
  });
  it.each(['email', 'whatsapp'])('still requires %s', (field) => {
    expect(waitlistSchema.safeParse({ ...registration, [field]: '' }).success).toBe(false);
  });
});