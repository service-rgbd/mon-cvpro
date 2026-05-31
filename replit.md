# CVPro

Application web premium de création de CV professionnel en français, avec aperçu temps réel, 4 templates, et mur de paiement avant téléchargement PDF.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/cv-builder run dev` — run the frontend (port 22723)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — session secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4 + shadcn/ui (wouter routing, @tanstack/react-query)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (tables: `cvs`, `payments`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema/cvs.ts` — DB schema (source of truth for data model)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contract)
- `lib/api-client-react/` — generated React Query hooks + Zod schemas (do not edit manually)
- `artifacts/api-server/src/routes/` — Express route handlers (cvs.ts, templates.ts, payments.ts)
- `artifacts/cv-builder/src/pages/` — Frontend pages (landing, builder, templates, payment, download)
- `artifacts/cv-builder/src/components/cv-preview.tsx` — 4 CV template renderers
- `artifacts/cv-builder/src/types/cv.ts` — CV data types

## Architecture decisions

- CV data stored in PostgreSQL; `personalInfo`, `experiences`, etc. stored as JSONB columns
- Local state (cvId, isPaid, paymentId) stored in `localStorage`; auto-save via debounced `useUpdateCv` (800ms)
- PDF download uses `window.print()` with print-specific CSS (`@media print`) — no external PDF library needed
- Payment flow: simulated (create → confirm in-app); designed so a real payment gateway can replace `confirmPayment` route
- 4 templates (modern, creative, classic, executive) all rendered purely in React — no canvas/puppeteer

## Product

- Landing page with live CV preview mockup and feature highlights
- Template gallery with 4 premium templates (Modern, Créatif, Classique, Exécutif)
- Split-layout CV builder: 10 form sections (personal, summary, experience, education, skills, languages, certifications, projects, interests, style) + live preview
- Payment wall at 500 FCFA (Paystack — XOF)
- Download page with PDF export via browser print

## User preferences

- Language: French (all UI text)
- Premium indigo theme (#4F46E5 primary)
- No emojis in UI

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after any OpenAPI spec change before editing routes or hooks
- The `lib/api-client-react` package is auto-generated — never edit files in `dist/generated/` manually
- `Link` from Wouter v3 renders as `<a>` — do NOT nest `<a>` children inside it
- Print CSS in `index.css` hides everything except `#cv-print-area` during print

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
