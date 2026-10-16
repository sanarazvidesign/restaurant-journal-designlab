-- Halal Restaurant Journal schema. Every row belongs to one user and is protected by RLS.
-- Run this once in the Supabase SQL editor (or apply it as a migration).

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  home_area text not null default '',
  currency text not null default 'USD',
  onboarded boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  address text not null default '',
  lat double precision,
  lng double precision,
  place_id text,
  cuisine text not null default '',
  price_level smallint check (price_level between 1 and 4),
  halal_status text not null default 'unsure'
    check (halal_status in ('fully_halal', 'partially_halal', 'not_halal', 'unsure')),
  halal_type_note text not null default '',
  alcohol_served text not null default 'unsure' check (alcohol_served in ('yes', 'no', 'unsure')),
  pork_served text not null default 'unsure' check (pork_served in ('yes', 'no', 'unsure')),
  verification_method text not null default 'none'
    check (verification_method in ('certificate_seen', 'asked_staff', 'owner_said', 'website', 'none')),
  certifier text not null default '',
  last_verified_date date,
  status text not null default 'visited' check (status in ('visited', 'want_to_try')),
  notes text not null default '',
  photo text,
  created_at timestamptz not null default now()
);

create table public.visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  date date not null default current_date,
  companions text not null default 'family' check (companions in ('family', 'friends', 'partner', 'solo')),
  party_size integer not null default 1 check (party_size >= 1),
  total_cost numeric(10, 2) check (total_cost >= 0),
  overall_rating smallint check (overall_rating between 1 and 5),
  note text not null default '',
  created_at timestamptz not null default now()
);

create table public.dishes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  visit_id uuid references public.visits (id) on delete set null,
  name text not null,
  halal_status text not null default 'unsure'
    check (halal_status in ('fully_halal', 'partially_halal', 'not_halal', 'unsure')),
  price numeric(10, 2) check (price >= 0),
  rating smallint check (rating between 1 and 5),
  would_order_again boolean not null default true,
  healthy_tag boolean not null default false,
  note text not null default '',
  photo text,
  created_at timestamptz not null default now()
);

create table public.share_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  snapshot text not null,
  created_at timestamptz not null default now()
);

-- Indexes for foreign keys and per-user lookups
create index restaurants_user_id_idx on public.restaurants (user_id);
create index visits_user_id_idx on public.visits (user_id);
create index visits_restaurant_id_idx on public.visits (restaurant_id);
create index dishes_user_id_idx on public.dishes (user_id);
create index dishes_restaurant_id_idx on public.dishes (restaurant_id);
create index dishes_visit_id_idx on public.dishes (visit_id);
create index share_links_user_id_idx on public.share_links (user_id);
create index share_links_restaurant_id_idx on public.share_links (restaurant_id);

-- Row level security: a signed-in user can only touch their own rows
alter table public.profiles enable row level security;

create policy "profiles select own" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "profiles insert own" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles update own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

do $$
declare t text;
begin
  foreach t in array array['restaurants', 'visits', 'dishes', 'share_links'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "own rows select" on public.%I for select to authenticated using ((select auth.uid()) = user_id)', t);
    execute format('create policy "own rows insert" on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)', t);
    execute format('create policy "own rows update" on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', t);
    execute format('create policy "own rows delete" on public.%I for delete to authenticated using ((select auth.uid()) = user_id)', t);
  end loop;
end $$;

-- Create a profile row automatically when someone signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
