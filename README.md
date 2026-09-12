# family-law-study

אפליקציית ווב ללימוד דיני משפחה, בנויה ב-Next.js (App Router) עם TypeScript,
Tailwind CSS ו-Supabase.

A web app for studying family law, built with Next.js (App Router), TypeScript,
Tailwind CSS, and Supabase.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in your keys
npm run dev                         # http://localhost:3000
```

## Environment variables

Copy `.env.local.example` to `.env.local` and set:

| Variable                        | Description                          |
| ------------------------------- | ------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key             |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key (server)   |
| `ANTHROPIC_API_KEY`             | Anthropic API key (server)           |

## Supabase clients

Following the official `@supabase/ssr` pattern for the Next.js App Router:

- `lib/supabase/client.ts` — browser client (Client Components).
- `lib/supabase/server.ts` — server client (Server Components, Actions, Route
  Handlers), wired to Next.js cookies.

## Database (Supabase)

- `supabase/migrations/` — SQL migrations. The initial migration defines the
  schema (`topics`, `lessons`, `questions`, `attempts`, `review_cards`,
  `content_updates`), enables Row Level Security on every table, and adds
  policies: users read/write only their own `attempts` and `review_cards`;
  content tables are readable by any authenticated user and writable only via
  the `service_role` key.
- `supabase/seed.sql` — seeds the topic tree (8 parent topics and their
  sub-topics). Idempotent on the unique `slug`.

Apply locally with the Supabase CLI:

```bash
supabase db reset   # runs migrations, then seed.sql
```

## Scripts

| Script          | Description                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Start the dev server on port 3000 |
| `npm run build` | Production build                  |
| `npm run start` | Serve the production build        |
| `npm run lint`  | Run ESLint                        |

## Cloud Agent environment

Defined in [`.cursor/environment.json`](.cursor/environment.json): `npm ci`
installs dependencies and a `dev` terminal runs the Next.js dev server on port
3000.
