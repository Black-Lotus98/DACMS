# Project Setup Architecture

**Date:** 2026-04-29
**Type:** Knowledge Note

---

## What This Is

Canonical setup reference for DACMS: architecture layers, folder layout, runtime setup, and local environment requirements.

---

## Details

DACMS is a single Next.js 16 App Router application using TypeScript strict mode and React 19.

- **UI stack:** Tailwind CSS v4, Sass, shadcn/ui, Radix UI, `next-themes`
- **i18n stack:** `next-intl` with locale-prefixed routes (`/en`, `/ar`)
- **Routing:** App routes are organized under `src/app/[local]` and grouped by access scope:
  - `(auth)`
  - `(private)`
  - `(public)`

### Technical strategies

#### Stack strategy

- **State management:** Redux Toolkit + `react-redux`
- **Forms/validation:** React Hook Form + Zod
- **API simulation:** MSW (network-level interception, zero refactor to real backend)
- **Tables:** `@tanstack/react-table`
- **Charts:** `recharts`
- **Barcodes:** `bwip-js`
- **Drag/drop:** `@dnd-kit/core` + `@dnd-kit/sortable`
- **Dates:** `date-fns`

#### Folder strategy

- **Thin routes:** `src/app/[local]/*` — pages that compose and render only
- **Feature modules:** `src/features/mX-*` — types, schemas, data, store, hooks, components per module
- **Module isolation:** each module keeps its own types, schemas, data, store, hooks, and components

#### Shared infrastructure placement

| File | Role |
|---|---|
| `src/types/index.ts` | Global shared types (`User`, `AuthSession`, `NavItem`) |
| `src/config/roles.ts` | `RoleType` + `ClearanceLevel` enums, role labels, clearance mapping |
| `src/config/navigation.ts` | 16 nav items with role-based filtering via `getNavForRole()` |
| `src/store/store.ts` | Root Redux store (auth slice + placeholder for module slices) |
| `src/store/authSlice.ts` | Mock session: `role`, `user`, `clearanceLevel` + `setRole`, `logout` |
| `src/store/hooks.ts` | Typed `useAppDispatch` + `useAppSelector` |
| `src/store/provider.tsx` | `ReduxProvider` client wrapper |
| `src/mocks/browser.ts` | MSW `setupWorker` |
| `src/mocks/handlers/index.ts` | Aggregated handler array (module handlers are registered here) |
| `src/mocks/handlers/auth.ts` | `POST /api/auth/login` + `POST /api/auth/logout` |
| `src/components/msw-provider.tsx` | `MSWProvider` — dev-only MSW bootstrap |
| `src/components/layout/Sidebar.tsx` | Role-filtered sidebar from `navigationConfig` |
| `src/components/layout/Header.tsx` | App header with notification bell + `RoleBadge` |
| `src/components/layout/RoleBadge.tsx` | Active role badge + quick-switch popover |
| `src/app/[local]/(auth)/login/page.tsx` | Mock login — 5 role cards → `dispatch(setRole)` → redirect |
| `src/app/[local]/(private)/layout.tsx` | Auth guard + responsive shell (sidebar + header) |
| `src/app/[local]/layout.tsx` | Root layout — now wraps `ReduxProvider` + `MSWProvider` |

### Core architecture layers

1. **App Layer**
   - Route entrypoint and layouts under `src/app/[local]`.

2. **Middleware Layer**
   - `src/middleware.ts` enforces locale prefixes and handles auth-aware redirects.
   - Locale detection sources: cookie + `accept-language`.
   - Access token cookie is used for protected vs auth route behavior.

3. **Internationalization Layer**
   - `src/config/i18n.ts`: locale definitions (`en`, `ar`) and default locale.
   - `src/config/i18n-request.ts`: loads translation namespaces.
   - `src/messages/*`: namespace-based translations (`common`, `home`, etc.).

4. **API/Utility Layer**
   - `src/lib/axios/*`: API client and auth callback wiring.
   - `src/lib/env.ts`: runtime env validation with `zod`.

5. **Component Layer**
   - Reusable primitives in `src/components/ui`.
   - Theme provider/switcher in `src/components`.

### Runtime setup

- Scripts:
  - `npm run dev`
  - `npm run dev:webpack`
  - `npm run build`
  - `npm run start`
  - `npm run lint`
- Required env vars:
  - `NEXT_PUBLIC_API_URL`
  - `JWT_SECRET`
  - `JWT_ALGORITHM`
  - `ENCRYPTION_KEY`
- TypeScript aliases from `tsconfig.json`:
  - `@/* -> src/*`
  - `@/styles/* -> src/styles/*`
  - `@/lib/* -> src/lib/*`

---

## Example

```ts
// src/config/i18n.ts
export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
```

---

## When to Use This

Use this note when:
- onboarding a teammate to the project structure
- aligning feature work with existing architecture boundaries
- verifying local setup and required environment variables

---

## Related Notes

- [[I18N-Setup-Guide]] - Deep i18n routing and translation workflow.
- [[Execution-Plan]] - Detailed module execution blueprint.
