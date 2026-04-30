import { describe, it, expect } from 'vitest';
import { detectLocale, matchesPath, stripLocale } from '../middleware-utils';
import type { Locale } from '@/config/i18n';

const VALID_LOCALES: readonly Locale[] = ['en', 'ar'];
const DEFAULT_LOCALE: Locale = 'en';

describe('detectLocale', () => {
  it('returns cookie locale when valid', () => {
    expect(detectLocale('ar', '', VALID_LOCALES, DEFAULT_LOCALE)).toBe('ar');
    expect(detectLocale('en', '', VALID_LOCALES, DEFAULT_LOCALE)).toBe('en');
  });

  it('ignores invalid cookie locale and falls back to Accept-Language', () => {
    expect(detectLocale('fr', 'en-US,en;q=0.9', VALID_LOCALES, DEFAULT_LOCALE)).toBe('en');
  });

  it('returns "en" when Accept-Language starts with en', () => {
    expect(detectLocale(undefined, 'en-US,en;q=0.9', VALID_LOCALES, DEFAULT_LOCALE)).toBe('en');
  });

  it('returns "ar" when Accept-Language starts with ar', () => {
    expect(detectLocale(undefined, 'ar-SA,ar;q=0.9', VALID_LOCALES, DEFAULT_LOCALE)).toBe('ar');
  });

  it('returns defaultLocale when neither cookie nor Accept-Language matches', () => {
    expect(detectLocale(undefined, 'fr-FR,fr;q=0.9', VALID_LOCALES, DEFAULT_LOCALE)).toBe('en');
  });

  it('returns defaultLocale when Accept-Language is empty', () => {
    expect(detectLocale(undefined, '', VALID_LOCALES, DEFAULT_LOCALE)).toBe('en');
  });

  it('cookie wins over Accept-Language', () => {
    expect(detectLocale('ar', 'en-US', VALID_LOCALES, DEFAULT_LOCALE)).toBe('ar');
  });
});

describe('matchesPath', () => {
  it('matches exact path', () => {
    expect(matchesPath('/dashboard', ['/dashboard'])).toBe(true);
  });

  it('matches sub-path', () => {
    expect(matchesPath('/dashboard/settings', ['/dashboard'])).toBe(true);
  });

  it('does not match partial segment', () => {
    expect(matchesPath('/dashboardextra', ['/dashboard'])).toBe(false);
  });

  it('does not match unrelated path', () => {
    expect(matchesPath('/home', ['/dashboard'])).toBe(false);
  });

  it('matches against multiple paths', () => {
    expect(matchesPath('/auth/login', ['/dashboard', '/auth'])).toBe(true);
  });

  it('returns false for empty paths array', () => {
    expect(matchesPath('/dashboard', [])).toBe(false);
  });
});

describe('stripLocale', () => {
  it('returns locale and path when valid locale prefix present', () => {
    expect(stripLocale('/en/dashboard', VALID_LOCALES)).toEqual({
      locale: 'en',
      pathWithoutLocale: '/dashboard',
    });
  });

  it('handles Arabic locale', () => {
    expect(stripLocale('/ar/dashboard', VALID_LOCALES)).toEqual({
      locale: 'ar',
      pathWithoutLocale: '/dashboard',
    });
  });

  it('returns null when no valid locale prefix', () => {
    expect(stripLocale('/dashboard', VALID_LOCALES)).toBeNull();
    expect(stripLocale('/fr/dashboard', VALID_LOCALES)).toBeNull();
  });

  it('handles root locale path', () => {
    expect(stripLocale('/en', VALID_LOCALES)).toEqual({
      locale: 'en',
      pathWithoutLocale: '/',
    });
  });

  it('returns null for empty path', () => {
    expect(stripLocale('/', VALID_LOCALES)).toBeNull();
  });
});
