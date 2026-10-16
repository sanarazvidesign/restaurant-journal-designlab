export type BlogPost = {
  slug: string
  title: string
  area: string
  cuisine: string
  rating: string
  summary: string
  body: string[]
  source: { label: string; url: string }[]
  published: string
}

/** Curated write-ups of well-reviewed halal restaurants in the NYC / NJ area, summarising public reviews. */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'gypsy-grill-jersey-city',
    title: 'Gypsy Grill, Jersey City: the platter that topped the local halal list',
    area: 'Jersey City, NJ',
    cuisine: 'Middle Eastern / Egyptian-style',
    rating: '4.0★ on Yelp (465 reviews, per 2019 Hoodline) · 4.9 on Zabihah (15 reviews)',
    summary: 'A small, fully halal counter-serve spot on the Newark Ave plaza known for big shawarma platters.',
    body: [
      'Hoodline\'s 2019 roundup named Gypsy Grill (187 Newark Ave.) the highest-rated halal restaurant in Jersey City, with four stars across 465 Yelp reviews. Zabihah lists it as fully halal with no alcohol and notes a halal certificate on file; its score there is 4.9 from 15 reviews.',
      'Reviewers single out the lamb and beef shawarma platter for tender meat, along with the falafel, chicken shawarma (with a housemade harissa-style hot sauce) and grilled lamb chops. Portions are described as large and the pricing reasonable, with the Gypsy Box (protein, rice, vegetables, pita and sauces) reported at roughly $10–$12 — a figure that may be dated.',
      'The setting is a cozy takeout counter with friendly service. One reviewer found the Hawashi good but pricey for its size. Zabihah lists hours of 10:30 AM–10 PM most days and 12–9 PM on Sundays; confirm before you go.',
    ],
    source: [
      { label: 'Hoodline: Jersey City\'s top 5 halal spots', url: 'https://hoodline.com/2019/11/here-are-jersey-city-s-top-5-halal-spots' },
      { label: 'Zabihah: Gypsy, Jersey City', url: 'https://app.zabihah.com/restaurants/caf6f847-7767-11ef-95ae-6045bdeb9f57/gypsy-jersey-city-nj' },
    ],
    published: '2026-10-16',
  },
  {
    slug: 'al-badawi-upper-east-side',
    title: 'Al Badawi: Palestinian hummus, fresh pita and lamb rice',
    area: 'Upper East Side & Brooklyn Heights, NYC',
    cuisine: 'Palestinian / Levantine',
    rating: '7.7 on The Infatuation ("Pretty Good")',
    summary: 'A sit-down Palestinian restaurant praised for hummus, freshly baked pita and mixed grill.',
    body: [
      'Al Badawi started in Brooklyn Heights (151 Atlantic Ave.) and opened a second location on the Upper East Side (1725 2nd Ave.). The Infatuation rates the Upper East Side branch 7.7, and Tasting Table includes it in its list of the best halal restaurants in NYC.',
      'Reviewers rave about the hummus, the freshly baked pita, and dishes like the lamb rice and mixed grill.',
      'Halal note: Zabihah lists the 2nd Ave location as fully halal with no alcohol, but says that status was confirmed verbally by staff. A Brooklyn Magazine piece describes the Brooklyn Heights branch as BYOB, and we found no halal claim specific to that branch — ask the restaurant directly.',
    ],
    source: [
      { label: 'The Infatuation: Al Badawi (UES)', url: 'https://www.theinfatuation.com/new-york/reviews/al-badawi-ues' },
      { label: 'Zabihah: Al Badawi', url: 'https://www.zabihah.com/restaurants/cbf09bb3-7767-11ef-95ae-6045bdeb9f57/al-badawi-new-york-ny' },
      { label: 'Tasting Table: 15 best halal restaurants in NYC', url: 'https://www.tastingtable.com/1581650/best-halal-restaurants-nyc/' },
    ],
    published: '2026-10-16',
  },
  {
    slug: 'the-halal-guys-53rd-and-6th',
    title: 'The Halal Guys at 53rd & 6th: is the white sauce still worth the line?',
    area: 'Midtown Manhattan, NYC',
    cuisine: 'Street food / Egyptian-style cart',
    rating: 'Widely praised; one Zabihah reviewer calls it overhyped',
    summary: 'The cart that popularised NYC halal street food: chicken or lamb over rice with white and red sauce.',
    body: [
      'Tasting Table credits The Halal Guys with popularising the halal cart. The original cart\'s menu centres on chicken or lamb over rice, and most reviews treat the creamy, tangy white sauce as the star — fans ask for plenty of it, and reviewers say the flavor is strongest with both white and red sauce.',
      'The Blind Cook (2017) called portions sizable at under $10; a 2024 listing shows regular chicken combos at $11. Prices and hours have likely changed, so check current information.',
      'Not everyone agrees: a 2017 Zabihah reviewer found the chicken and rice filling but short on flavor and said the sauces did the work. Most sources here are dated (2015–2017).',
    ],
    source: [
      { label: 'Tasting Table: 15 best halal restaurants in NYC', url: 'https://www.tastingtable.com/1581650/best-halal-restaurants-nyc/' },
      { label: 'The Blind Cook: chicken and lamb over rice', url: 'https://theblindcook.com/blog/2017/03/23/best-cheap-eats-in-new-york-the-chicken-and-lamb-over-rice-at-the-original-halal-guys-in-midtown' },
      { label: 'Zabihah: The Halal Guys', url: 'https://zabihah.com/restaurants/c9e5b4fe-7767-11ef-95ae-6045bdeb9f57/the-halal-guys-new-york-ny' },
    ],
    published: '2026-10-16',
  },
]
