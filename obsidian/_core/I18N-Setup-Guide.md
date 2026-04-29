# I18N Setup Guide

**Date:** 2026-04-29
**Type:** Knowledge Note

---

## What This Is

Practical reference for how localization is implemented in DACMS using `next-intl`, including routing behavior, translation file organization, and how to add locales/pages safely.

---

## Details

DACMS uses locale-prefixed URLs and namespace-based translation files.

- Locales are defined in `src/config/i18n.ts` (`en`, `ar`)
- Translation loading is handled by `src/config/i18n-request.ts`
- Message files live in `src/messages/<namespace>/<locale>.json`
- Locale-aware routing is enforced in `src/middleware.ts`
- Execution plan direction: Arabic is primary and English is secondary for prototype UX/content flow

### Translation namespaces

Current namespaces include:
- `common`
- `home`

Each namespace has one file per locale (for example `en.json`, `ar.json`).

### Request flow

1. Middleware ensures requests include a locale prefix (`/en/...`, `/ar/...`)
2. `i18n-request.ts` resolves a valid locale (URL/header/default fallback)
3. Namespace JSON files are loaded and merged into a messages object
4. Components read translations with `getTranslations` (server) or `useTranslations` (client)

### Add a new page namespace

1. Create `src/messages/<new-page>/en.json` and `ar.json`
2. Add the namespace name to `pageDirectories` in `src/config/i18n-request.ts`
3. Consume with `getTranslations('<new-page>')` or `useTranslations('<new-page>')`

### Add a new locale

1. Add locale in `src/config/i18n.ts`
2. Add `<locale>.json` for every existing namespace in `src/messages/*`
3. Ensure layout direction logic covers RTL/LTR as needed

---

## Example

```ts
// src/config/i18n-request.ts
const pageDirectories = ['home', 'common'] as const;
```

---

## When to Use This

Use this note when:
- introducing a new language
- adding translated routes/pages
- debugging missing messages or locale fallback behavior

---

## Related Notes

- [[Project-Setup-Architecture]] - High-level architecture and runtime setup.
- [[Execution-Plan]] - Source plan for phased architecture and delivery order.
