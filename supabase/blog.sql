-- Blog: curated summaries of reviews published elsewhere on the web.
-- Run once in the Supabase SQL editor. Posts are readable by any signed-in user and
-- can only be added or changed by the project owner (SQL editor / service role):
-- there are deliberately no insert/update/delete policies for app users.
--
-- The seed rows below are SAMPLE posts (made-up restaurants, source_url is null).
-- Replace them with real posts: put the original review's link in source_url,
-- write the summary in your own words, and set is_sample to false.

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  restaurant_name text not null,
  cuisine text not null default '',
  city text not null default '',
  area text not null check (area in ('New Jersey', 'New York City')),
  halal_claim text not null default 'unsure'
    check (halal_claim in ('fully_halal', 'partially_halal', 'not_halal', 'unsure')),
  rating numeric(2, 1) check (rating between 0 and 5),
  rating_source text not null default '',
  source_name text not null,
  source_url text,
  summary text not null,
  -- JSON array of {"url": "https://...", "alt": "..."} from the source review page (credited in the UI)
  images jsonb not null default '[]'::jsonb check (jsonb_typeof(images) = 'array'),
  published_at date not null default current_date,
  is_sample boolean not null default false,
  created_at timestamptz not null default now()
);

create index blog_posts_published_at_idx on public.blog_posts (published_at desc);

alter table public.blog_posts enable row level security;

create policy "blog posts readable by signed-in users" on public.blog_posts
  for select to authenticated using (true);

insert into public.blog_posts
  (title, restaurant_name, cuisine, city, area, halal_claim, rating, rating_source, source_name, source_url, summary, images, published_at, is_sample)
values
  ('Smoke and spice arrive in Jersey City', 'Ember & Oak Smokehouse (sample)', 'BBQ', 'Jersey City, NJ', 'New Jersey', 'fully_halal', 4.7, '4.7 on Google (sample)', 'Sample Food Weekly', null, 'A new waterfront smokehouse smoking brisket, lamb ribs and chicken over oak, with the reviewer calling the lamb ribs the standout. Portions are generous and the sides lean Middle Eastern. Expect a line on weekends.', '[{"url": "https://images.pexels.com/photos/8250702/pexels-photo-8250702.jpeg?auto=compress&cs=tinysrgb&w=1200", "alt": "Stock photo of grilled meat", "stock": true, "credit": "Pexels", "credit_url": "https://www.pexels.com/photo/grilling-of-meat-8250702/"}]'::jsonb, '2026-10-09', true),
  ('A Lebanese bakery worth the queue in Paterson', 'Cedar & Thyme Bakery (sample)', 'Lebanese', 'Paterson, NJ', 'New Jersey', 'fully_halal', 4.8, '4.8 on Google (sample)', 'Sample Local Eats', null, 'Fresh manakish, za''atar flatbreads and sweet pastries baked through the morning. The reviewer recommends the cheese and thyme combination and arriving before 10am. Very reasonable prices.', '[{"url": "https://images.pexels.com/photos/30616452/pexels-photo-30616452.jpeg?auto=compress&cs=tinysrgb&w=1200", "alt": "Stock photo of Lebanese manakish baking in an oven", "stock": true, "credit": "Pexels", "credit_url": "https://www.pexels.com/photo/traditional-lebanese-manakish-baking-in-oven-30616452/"}]'::jsonb, '2026-10-06', true),
  ('Hand-pulled noodles, halal, in Edison', 'Lanzhou Noodle Co. (sample)', 'Chinese', 'Edison, NJ', 'New Jersey', 'fully_halal', 4.6, '4.6 on Yelp (sample)', 'Sample Dining Guide', null, 'Noodles are pulled to order and served in a clear beef broth with chilli oil on the side. The write-up praises the springy texture and the cumin lamb. Cash is faster at the counter.', '[{"url": "https://images.pexels.com/photos/29305560/pexels-photo-29305560.jpeg?auto=compress&cs=tinysrgb&w=1200", "alt": "Stock photo of a bowl of spicy beef noodle soup", "stock": true, "credit": "Pexels", "credit_url": "https://www.pexels.com/photo/spicy-beef-noodle-soup-with-herbs-in-a-bowl-29305560/"}]'::jsonb, '2026-10-02', true),
  ('Brooklyn''s new Yemeni mandi house', 'Sana''a Mandi House (sample)', 'Yemeni', 'Brooklyn, NY', 'New York City', 'fully_halal', 4.7, '4.7 on Google (sample)', 'Sample City Eats', null, 'Slow-cooked lamb and chicken mandi served on big shared platters, with fragrant rice and a spicy tomato sauce. A good pick for groups and families. Bring an appetite and reserve ahead on Fridays.', '[{"url": "https://images.pexels.com/photos/17650170/pexels-photo-17650170.jpeg?auto=compress&cs=tinysrgb&w=1200", "alt": "Stock photo of meat served with rice on a plate", "stock": true, "credit": "Pexels", "credit_url": "https://www.pexels.com/photo/meat-with-rice-on-plate-17650170/"}]'::jsonb, '2026-09-28', true),
  ('Astoria gets a halal tasting menu', 'Nile & Olive (sample)', 'Egyptian', 'Astoria, NY', 'New York City', 'partially_halal', 4.5, '4.5 on Google (sample)', 'Sample Food Weekly', null, 'A seven-course Egyptian-Mediterranean tasting menu with halal meats. The reviewer notes the kitchen also serves alcohol at the bar, so ask staff about how the halal dishes are prepared. Dessert was the highlight.', '[{"url": "https://images.pexels.com/photos/29978686/pexels-photo-29978686.jpeg?auto=compress&cs=tinysrgb&w=1200", "alt": "Stock photo of a plated gourmet dessert", "stock": true, "credit": "Pexels", "credit_url": "https://www.pexels.com/photo/gourmet-dessert-plating-with-sorbet-and-cream-cubes-29978686/"}]'::jsonb, '2026-09-24', true),
  ('Smash burgers that finally get halal right', 'Corner Smash (sample)', 'Burgers', 'Hoboken, NJ', 'New Jersey', 'fully_halal', 4.4, '4.4 on Google (sample)', 'Sample Local Eats', null, 'Crisp-edged smash burgers on halal beef with house sauce and fresh-cut fries. Short menu, fast service and a casual counter setup. The spicy chicken sandwich also gets a mention.', '[{"url": "https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=1200", "alt": "Stock photo of a hamburger and fries", "stock": true, "credit": "Pexels", "credit_url": "https://www.pexels.com/photo/hamburger-and-fries-photo-2983101/"}]'::jsonb, '2026-09-19', true),
  ('South Indian breakfast, all day, in Iselin', 'Idli Lane (sample)', 'South Indian', 'Iselin, NJ', 'New Jersey', 'fully_halal', 4.6, '4.6 on Yelp (sample)', 'Sample Dining Guide', null, 'A vegetarian menu built around dosas, idli and filter coffee, served from open to close. Light, affordable and good for a weekday lunch. The reviewer rates the ghee roast dosa highest.', '[{"url": "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=1200", "alt": "Stock photo of dosas on a wooden tray with a banana leaf", "stock": true, "credit": "Pexels", "credit_url": "https://www.pexels.com/photo/a-pair-of-tosei-on-a-wooden-tray-with-banana-leaf-5560763/"}]'::jsonb, '2026-09-15', true),
  ('Korean fried chicken, halal, in Fort Lee', 'Seoul Crunch (sample)', 'Korean', 'Fort Lee, NJ', 'New Jersey', 'fully_halal', 4.5, '4.5 on Google (sample)', 'Sample City Eats', null, 'Double-fried chicken in soy-garlic and gochujang glazes, made with halal chicken. The reviewer suggests half-and-half orders and the pickled radish on the side. Gets busy after 7pm.', '[{"url": "https://images.pexels.com/photos/10648394/pexels-photo-10648394.jpeg?auto=compress&cs=tinysrgb&w=1200", "alt": "Stock photo of fried chicken wings on a plate", "stock": true, "credit": "Pexels", "credit_url": "https://www.pexels.com/photo/fried-chicken-wings-on-a-plate-10648394/"}]'::jsonb, '2026-09-10', true);
