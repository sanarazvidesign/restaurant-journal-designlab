import type { BlogPost } from './types'

/**
 * Placeholder posts. Restaurant names, ratings and sources are made up; they are
 * clearly marked as samples in the UI. The app shows these only when the
 * blog_posts table does not exist yet (see supabase/blog.sql). Keep in sync with
 * the seed rows in that file.
 */
export const SAMPLE_BLOG_POSTS: BlogPost[] = [
  {
    "id": "sample-1",
    "title": "Smoke and spice arrive in Jersey City",
    "restaurant_name": "Ember & Oak Smokehouse (sample)",
    "cuisine": "BBQ",
    "city": "Jersey City, NJ",
    "area": "New Jersey",
    "halal_claim": "fully_halal",
    "rating": 4.7,
    "rating_source": "4.7 on Google (sample)",
    "source_name": "Sample Food Weekly",
    "summary": "A new waterfront smokehouse smoking brisket, lamb ribs and chicken over oak, with the reviewer calling the lamb ribs the standout. Portions are generous and the sides lean Middle Eastern. Expect a line on weekends.",
    "images": [
      {
        "url": "https://images.pexels.com/photos/8250702/pexels-photo-8250702.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "alt": "Stock photo of grilled meat",
        "stock": true,
        "credit": "Pexels",
        "credit_url": "https://www.pexels.com/photo/grilling-of-meat-8250702/"
      }
    ],
    "published_at": "2026-10-09",
    "source_url": null,
    "is_sample": true
  },
  {
    "id": "sample-2",
    "title": "A Lebanese bakery worth the queue in Paterson",
    "restaurant_name": "Cedar & Thyme Bakery (sample)",
    "cuisine": "Lebanese",
    "city": "Paterson, NJ",
    "area": "New Jersey",
    "halal_claim": "fully_halal",
    "rating": 4.8,
    "rating_source": "4.8 on Google (sample)",
    "source_name": "Sample Local Eats",
    "summary": "Fresh manakish, za'atar flatbreads and sweet pastries baked through the morning. The reviewer recommends the cheese and thyme combination and arriving before 10am. Very reasonable prices.",
    "images": [
      {
        "url": "https://images.pexels.com/photos/30616452/pexels-photo-30616452.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "alt": "Stock photo of Lebanese manakish baking in an oven",
        "stock": true,
        "credit": "Pexels",
        "credit_url": "https://www.pexels.com/photo/traditional-lebanese-manakish-baking-in-oven-30616452/"
      }
    ],
    "published_at": "2026-10-06",
    "source_url": null,
    "is_sample": true
  },
  {
    "id": "sample-3",
    "title": "Hand-pulled noodles, halal, in Edison",
    "restaurant_name": "Lanzhou Noodle Co. (sample)",
    "cuisine": "Chinese",
    "city": "Edison, NJ",
    "area": "New Jersey",
    "halal_claim": "fully_halal",
    "rating": 4.6,
    "rating_source": "4.6 on Yelp (sample)",
    "source_name": "Sample Dining Guide",
    "summary": "Noodles are pulled to order and served in a clear beef broth with chilli oil on the side. The write-up praises the springy texture and the cumin lamb. Cash is faster at the counter.",
    "images": [
      {
        "url": "https://images.pexels.com/photos/29305560/pexels-photo-29305560.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "alt": "Stock photo of a bowl of spicy beef noodle soup",
        "stock": true,
        "credit": "Pexels",
        "credit_url": "https://www.pexels.com/photo/spicy-beef-noodle-soup-with-herbs-in-a-bowl-29305560/"
      }
    ],
    "published_at": "2026-10-02",
    "source_url": null,
    "is_sample": true
  },
  {
    "id": "sample-4",
    "title": "Brooklyn's new Yemeni mandi house",
    "restaurant_name": "Sana'a Mandi House (sample)",
    "cuisine": "Yemeni",
    "city": "Brooklyn, NY",
    "area": "New York City",
    "halal_claim": "fully_halal",
    "rating": 4.7,
    "rating_source": "4.7 on Google (sample)",
    "source_name": "Sample City Eats",
    "summary": "Slow-cooked lamb and chicken mandi served on big shared platters, with fragrant rice and a spicy tomato sauce. A good pick for groups and families. Bring an appetite and reserve ahead on Fridays.",
    "images": [
      {
        "url": "https://images.pexels.com/photos/17650170/pexels-photo-17650170.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "alt": "Stock photo of meat served with rice on a plate",
        "stock": true,
        "credit": "Pexels",
        "credit_url": "https://www.pexels.com/photo/meat-with-rice-on-plate-17650170/"
      }
    ],
    "published_at": "2026-09-28",
    "source_url": null,
    "is_sample": true
  },
  {
    "id": "sample-5",
    "title": "Astoria gets a halal tasting menu",
    "restaurant_name": "Nile & Olive (sample)",
    "cuisine": "Egyptian",
    "city": "Astoria, NY",
    "area": "New York City",
    "halal_claim": "partially_halal",
    "rating": 4.5,
    "rating_source": "4.5 on Google (sample)",
    "source_name": "Sample Food Weekly",
    "summary": "A seven-course Egyptian-Mediterranean tasting menu with halal meats. The reviewer notes the kitchen also serves alcohol at the bar, so ask staff about how the halal dishes are prepared. Dessert was the highlight.",
    "images": [
      {
        "url": "https://images.pexels.com/photos/29978686/pexels-photo-29978686.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "alt": "Stock photo of a plated gourmet dessert",
        "stock": true,
        "credit": "Pexels",
        "credit_url": "https://www.pexels.com/photo/gourmet-dessert-plating-with-sorbet-and-cream-cubes-29978686/"
      }
    ],
    "published_at": "2026-09-24",
    "source_url": null,
    "is_sample": true
  },
  {
    "id": "sample-6",
    "title": "Smash burgers that finally get halal right",
    "restaurant_name": "Corner Smash (sample)",
    "cuisine": "Burgers",
    "city": "Hoboken, NJ",
    "area": "New Jersey",
    "halal_claim": "fully_halal",
    "rating": 4.4,
    "rating_source": "4.4 on Google (sample)",
    "source_name": "Sample Local Eats",
    "summary": "Crisp-edged smash burgers on halal beef with house sauce and fresh-cut fries. Short menu, fast service and a casual counter setup. The spicy chicken sandwich also gets a mention.",
    "images": [
      {
        "url": "https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "alt": "Stock photo of a hamburger and fries",
        "stock": true,
        "credit": "Pexels",
        "credit_url": "https://www.pexels.com/photo/hamburger-and-fries-photo-2983101/"
      }
    ],
    "published_at": "2026-09-19",
    "source_url": null,
    "is_sample": true
  },
  {
    "id": "sample-7",
    "title": "South Indian breakfast, all day, in Iselin",
    "restaurant_name": "Idli Lane (sample)",
    "cuisine": "South Indian",
    "city": "Iselin, NJ",
    "area": "New Jersey",
    "halal_claim": "fully_halal",
    "rating": 4.6,
    "rating_source": "4.6 on Yelp (sample)",
    "source_name": "Sample Dining Guide",
    "summary": "A vegetarian menu built around dosas, idli and filter coffee, served from open to close. Light, affordable and good for a weekday lunch. The reviewer rates the ghee roast dosa highest.",
    "images": [
      {
        "url": "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "alt": "Stock photo of dosas on a wooden tray with a banana leaf",
        "stock": true,
        "credit": "Pexels",
        "credit_url": "https://www.pexels.com/photo/a-pair-of-tosei-on-a-wooden-tray-with-banana-leaf-5560763/"
      }
    ],
    "published_at": "2026-09-15",
    "source_url": null,
    "is_sample": true
  },
  {
    "id": "sample-8",
    "title": "Korean fried chicken, halal, in Fort Lee",
    "restaurant_name": "Seoul Crunch (sample)",
    "cuisine": "Korean",
    "city": "Fort Lee, NJ",
    "area": "New Jersey",
    "halal_claim": "fully_halal",
    "rating": 4.5,
    "rating_source": "4.5 on Google (sample)",
    "source_name": "Sample City Eats",
    "summary": "Double-fried chicken in soy-garlic and gochujang glazes, made with halal chicken. The reviewer suggests half-and-half orders and the pickled radish on the side. Gets busy after 7pm.",
    "images": [
      {
        "url": "https://images.pexels.com/photos/10648394/pexels-photo-10648394.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "alt": "Stock photo of fried chicken wings on a plate",
        "stock": true,
        "credit": "Pexels",
        "credit_url": "https://www.pexels.com/photo/fried-chicken-wings-on-a-plate-10648394/"
      }
    ],
    "published_at": "2026-09-10",
    "source_url": null,
    "is_sample": true
  }
]
