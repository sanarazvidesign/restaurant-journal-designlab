# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev         # Vite dev server on http://localhost:5173 (add `-- --host` to test on a phone over the LAN)
npm run build       # tsc --noEmit, then vite build into dist/
npm run typecheck   # TypeScript check only
npm run preview     # Serve the production build
```

There is no linter and no test runner configured. `npm run typecheck` is the only automated check. Requires Node 24 (`engines` in package.json).

## Setup

The app needs a Supabase project. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Only the publishable key belongs in the client; never add a service-role key. Without the env vars, `App.tsx` renders a setup message instead of the routes.

The database is created by running `supabase/schema.sql` (tables, RLS policies, signup trigger that creates the profile) and optionally `supabase/blog.sql` (read-only `blog_posts` plus seed rows) in the Supabase SQL editor. There is no migration tooling; schema changes mean editing these files and applying the SQL by hand.

## Architecture

React 19 + React Router 7 + Tailwind 4 single-page app, backed directly by Supabase (Auth + Postgres). There is no custom server.

- **`src/data/api.ts` is the only module the UI may import data from.** It wraps all Supabase calls, throws `Error` on failure (via `unwrap`/`check`), and re-exports `isConfigured`. Pages never touch the Supabase client directly; add new queries here.
- **Security is enforced by row-level security, not client code.** `user_id` columns are filled by a column default of `auth.uid()`, so the client never sends it. Keep new tables consistent with this: add RLS policies in `schema.sql` and don't pass `user_id` from the client.
- **Routing and auth shell:** `App.tsx` defines all routes. Everything except `/login` and `/onboarding` renders inside `AppShell`, which loads the account and profile and provides them through `ProfileContext` (`hooks/useProfile.ts`). Pages read them with `useProfile()`.
- **Async data:** pages load through the `useAsync` hook rather than a data-fetching library.
- **Data model** (`src/data/types.ts`): a restaurant has a halal profile (status, alcohol and pork flags with an "unsure" option, verification method, date checked), visits, and dishes. Places not re-checked in 6 months are flagged stale.
- **Blog (Halal Finds):** `blog_posts` is read-only to app users. Until `blog.sql` is applied, the app falls back to the built-in `data/blogSample.ts`. `lib/blog.ts` `isSamplePost` decides the "sample" label: a post with a `source_url` is never treated as a sample. Blog posts must be short summaries in our own words that link to the source; never copy review text.
- **Deployment:** Vercel as a standard Vite project; `vercel.json` rewrites all paths to `/index.html` for client-side routing. The Supabase Site URL and redirect URLs must be set to the deployed address or confirmation emails link to the wrong place.

## Product constraints

- Halal details are the user's own notes (who said it, how, and when), not an official certification. Shared cards and UI copy must say so.
- Sample or placeholder content must stay clearly labelled as such, including stock images on blog posts.

## Known gaps

Place search is a demo lookup over a few sample places, the map view is a simple pin plot without tiles, photos are stored as small images inside database rows, and saving a visit and its first dish are two separate requests (not atomic).
