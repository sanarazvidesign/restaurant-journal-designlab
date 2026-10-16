export type HalalStatus = 'fully_halal' | 'partially_halal' | 'not_halal' | 'unsure'
export type YesNoUnsure = 'yes' | 'no' | 'unsure'
export type VerificationMethod =
  | 'certificate_seen'
  | 'asked_staff'
  | 'owner_said'
  | 'website'
  | 'none'
export type PlaceStatus = 'visited' | 'want_to_try'
export type Companions = 'family' | 'friends' | 'partner' | 'solo'
export type PriceLevel = 1 | 2 | 3 | 4

export interface Restaurant {
  id: string
  name: string
  address: string
  lat: number | null
  lng: number | null
  place_id: string | null
  cuisine: string
  price_level: PriceLevel | null
  halal_status: HalalStatus
  /** Free text for the kind of halal (zabiha, seafood only, ...) */
  halal_type_note: string
  alcohol_served: YesNoUnsure
  pork_served: YesNoUnsure
  verification_method: VerificationMethod
  certifier: string
  /** ISO date (yyyy-mm-dd) */
  last_verified_date: string | null
  status: PlaceStatus
  notes: string
  /** data URL */
  photo: string | null
  created_at: string
}

export interface Visit {
  id: string
  restaurant_id: string
  date: string
  companions: Companions
  party_size: number
  total_cost: number | null
  overall_rating: number | null
  note: string
}

export interface Dish {
  id: string
  restaurant_id: string
  visit_id: string | null
  name: string
  halal_status: HalalStatus
  price: number | null
  rating: number | null
  would_order_again: boolean
  healthy_tag: boolean
  note: string
  photo: string | null
}

export interface ShareLink {
  id: string
  restaurant_id: string
  snapshot: string
  created_at: string
}

export interface UserProfile {
  name: string
  home_area: string
  currency: string
  onboarded: boolean
}

export interface DB {
  restaurants: Restaurant[]
  visits: Visit[]
  dishes: Dish[]
  shareLinks: ShareLink[]
  profile: UserProfile
}

export type BlogArea = 'New Jersey' | 'New York City'

/** A curated summary of a review published elsewhere on the web. */
export interface BlogPost {
  id: string
  title: string
  restaurant_name: string
  cuisine: string
  city: string
  area: BlogArea
  /** What the original source claims; not verified by this app. */
  halal_claim: HalalStatus
  rating: number | null
  /** e.g. "4.7 on Google" */
  rating_source: string
  source_name: string
  /** Link to the original review, or null for sample posts. */
  source_url: string | null
  /** Short summary in our own words. */
  summary: string
  published_at: string
  is_sample: boolean
}
