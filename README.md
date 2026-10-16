# Halal Restaurant Journal

A private, mobile-first journal for halal food. For every restaurant you save, you record what is halal, whether alcohol or pork is served, how you verified it, what you ate, and what it cost. When you're choosing where to eat, you can filter your own list, and you can share a place with family and friends as a clean text card.

It works on phone, tablet and desktop.

> Halal details in this app are your own notes: who said it, how, and when. They are **not** an official halal certification, and shared cards say so.

## Features

- **Save a restaurant** by search (a demo lookup for now) or manually: name, address, cuisine, price level, photo, and *visited* or *want to try*.
- **Halal profile** per restaurant: halal status, alcohol and pork flags (each with an "unsure" option), how it was verified, certifier, and date checked. Places not re-checked in 6 months are flagged.
- **Visits and dishes:** log a date, who you went with, party size, total bill and rating, plus dishes with halal status, price, rating, "would order again" and a healthy tag.
- **My Places:** list or map view, search, and filters for fully halal, no alcohol, no pork, want to try, price, cuisine and rating.
- **Share card:** choose what to include and send it through the system share sheet, or copy it as text.
- **Accounts:** email and password sign-in. Each user only ever sees their own data.

## Tech stack

- [React](https://react.dev) 19, TypeScript and [Vite](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com) 4
- [React Router](https://reactrouter.com) 7
- [Supabase](https://supabase.com) (Auth and Postgres, with row-level security)

## Getting started

You need Node.js 24 and a Supabase project.

```bash
git clone https://github.com/sanarazvidesign/restaurant-journal-designlab.git
cd restaurant-journal-designlab
npm install
```

### 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run [`supabase/schema.sql`](supabase/schema.sql). It creates the tables, row-level security policies and a signup trigger that creates each user's profile.
3. Under **Authentication → Providers → Email**, decide whether to require email confirmation. It's on by default. Turn it off while testing if you don't want to click confirmation links.

### 2. Add environment variables

```bash
cp .env.example .env.local
```

Fill in the values from **Project Settings → API**:

| Variable | What it is |
|---|---|
| `VITE_SUPABASE_URL` | Your project URL, `https://<project-ref>.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your publishable (anon) key |

Only the publishable key belongs in this app. It's safe in the browser because row-level security protects the data. Never add a service-role or secret key.

### 3. Run it

```bash
npm run dev
```

Open the URL Vite prints (http://localhost:5173). To open it on your phone, run `npm run dev -- --host` and use the Network address on the same Wi-Fi.

Create an account on the sign-in screen. When you finish onboarding, a few clearly labelled sample restaurants are added so the app isn't empty. You can delete them from **Profile**.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Typecheck, then build for production into `dist/` |
| `npm run typecheck` | TypeScript check only |
| `npm run preview` | Serve the production build locally |

## Project structure

```
src/
  data/        api.ts is the only file the UI imports data from (Supabase),
               plus types, sample data and the Supabase client
  pages/       One file per screen
  components/  App shell, shared UI, restaurant card, map view, photo input
  hooks/       useAsync and the profile/account context
  lib/         Formatting helpers and image resizing
supabase/
  schema.sql   Database schema and row-level security policies
```

## Deploying

The repo includes a `vercel.json` with a single-page-app rewrite, so it deploys to [Vercel](https://vercel.com) as a standard Vite project: framework preset **Vite**, build command `npm run build`, output directory `dist`.

1. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as environment variables.
2. After the first deploy, open Supabase → **Authentication → URL Configuration** and set the **Site URL** to your deployed address. Add it, with `/**` on the end, to the redirect URLs. Otherwise confirmation emails link to the wrong place.

## Known limitations

- Place search is a demo lookup over a few sample places. Real Google Places or Apple Maps lookup is planned.
- The map view is a simple pin plot with no map tiles.
- Photos are stored as small images inside database rows. A Supabase Storage bucket would suit heavy photo use better.
- Saving a visit and its first dish are separate requests, so a network failure between them could save the visit without the dish.

## Roadmap

Spend insights, shared family lists, nearby halal discovery, community halal reports, and recommendations.
