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
