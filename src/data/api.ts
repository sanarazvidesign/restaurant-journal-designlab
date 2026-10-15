/**
 * The ONLY file the UI imports data from. Backed by Supabase (Postgres + Auth).
 * Every table is protected by row level security, so a signed-in user can only
 * ever read or write their own rows; user_id is filled in by a column default
 * (auth.uid()), so it is never sent from the client.
 */
import { SAMPLE_DB } from './sample'
import { supabase } from './supabase'
import type {
  Dish,
  PlaceStatus,
  Restaurant,
  ShareLink,
  UserProfile,
  Visit,
} from './types'

export { isConfigured } from './supabase'

type Result<T> = { data: T | null; error: { message: string } | null }

function unwrap<T>(res: Result<T>): T {
  if (res.error) throw new Error(res.error.message)
  return res.data as T
}

function check(res: { error: { message: string } | null }): void {
  if (res.error) throw new Error(res.error.message)
}

/** crypto.randomUUID only exists on https/localhost; getRandomValues works on a LAN http address too. */
function uuid(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  const b = crypto.getRandomValues(new Uint8Array(16))
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

// ---------- Auth ----------

export interface Account {
  id: string
  email: string
}

export async function getAccount(): Promise<Account | null> {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw new Error(error.message)
  const user = data.session?.user
  return user ? { id: user.id, email: user.email ?? '' } : null
}

async function requireUserId(): Promise<string> {
  const account = await getAccount()
  if (!account) throw new Error('You are signed out. Please sign in again.')
  return account.id
}

/** Returns needsConfirmation=true when the project requires email confirmation first. */
export async function signUp(email: string, password: string): Promise<{ needsConfirmation: boolean }> {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw new Error(error.message)
  return { needsConfirmation: !data.session }
}

export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

// ---------- Derived stats ----------

export interface RestaurantStats {
  visitCount: number
  dishCount: number
  avgRating: number | null
  avgSpendPerPerson: number | null
  lastVisit: string | null
}
export type RestaurantWithStats = Restaurant & RestaurantStats

function avg(nums: number[]): number | null {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null
}

function withStats(r: Restaurant, allVisits: Visit[], allDishes: Dish[]): RestaurantWithStats {
  const visits = allVisits.filter((v) => v.restaurant_id === r.id)
  const dishes = allDishes.filter((d) => d.restaurant_id === r.id)
  const visitRatings = visits.flatMap((v) => (v.overall_rating != null ? [v.overall_rating] : []))
  const dishRatings = dishes.flatMap((d) => (d.rating != null ? [d.rating] : []))
  const costed = visits.filter((v) => v.total_cost != null && v.party_size > 0)
  const totalCost = costed.reduce((s, v) => s + Number(v.total_cost ?? 0), 0)
  const totalPeople = costed.reduce((s, v) => s + v.party_size, 0)
  return {
    ...r,
    visitCount: visits.length,
    dishCount: dishes.length,
    avgRating: avg(visitRatings) ?? avg(dishRatings),
    avgSpendPerPerson: totalPeople > 0 ? totalCost / totalPeople : null,
    lastVisit: visits.map((v) => v.date).sort().at(-1) ?? null,
  }
}

async function loadAll() {
  const [r, v, d] = await Promise.all([
    supabase.from('restaurants').select('*'),
    supabase.from('visits').select('*'),
    supabase.from('dishes').select('*'),
  ])
  return {
    restaurants: unwrap(r) as Restaurant[],
    visits: unwrap(v) as Visit[],
    dishes: unwrap(d) as Dish[],
  }
}

// ---------- Restaurants ----------

export interface Filters {
  search: string
  fullyHalal: boolean
  noAlcohol: boolean
  noPork: boolean
  wantToTry: boolean
  cuisine: string
  /** 0 = any */
  price: number
  minRating: number
}

export const EMPTY_FILTERS: Filters = {
  search: '',
  fullyHalal: false,
  noAlcohol: false,
  noPork: false,
  wantToTry: false,
  cuisine: '',
  price: 0,
  minRating: 0,
}

export async function listRestaurants(f: Filters = EMPTY_FILTERS): Promise<RestaurantWithStats[]> {
  const { restaurants, visits, dishes } = await loadAll()
  const q = f.search.trim().toLowerCase()
  return restaurants
    .map((r) => withStats(r, visits, dishes))
    .filter((r) => {
      if (q && !`${r.name} ${r.cuisine} ${r.address}`.toLowerCase().includes(q)) return false
      if (f.fullyHalal && r.halal_status !== 'fully_halal') return false
      if (f.noAlcohol && r.alcohol_served !== 'no') return false
      if (f.noPork && r.pork_served !== 'no') return false
      if (f.wantToTry && r.status !== 'want_to_try') return false
      if (f.cuisine && r.cuisine !== f.cuisine) return false
      if (f.price && r.price_level !== f.price) return false
      if (f.minRating && (r.avgRating ?? 0) < f.minRating) return false
      return true
    })
    .sort((a, b) => b.created_at.localeCompare(a.created_at) || a.name.localeCompare(b.name))
}

export async function listCuisines(): Promise<string[]> {
  const rows = unwrap(await supabase.from('restaurants').select('cuisine')) as { cuisine: string }[]
  return [...new Set(rows.map((r) => r.cuisine).filter(Boolean))].sort()
}

export interface RestaurantDetail {
  restaurant: RestaurantWithStats
  visits: Visit[]
  dishes: Dish[]
}

export async function getRestaurantDetail(id: string): Promise<RestaurantDetail | null> {
  const [r, v, d] = await Promise.all([
    supabase.from('restaurants').select('*').eq('id', id).maybeSingle(),
    supabase.from('visits').select('*').eq('restaurant_id', id),
    supabase.from('dishes').select('*').eq('restaurant_id', id),
  ])
  const restaurant = unwrap(r) as Restaurant | null
  if (!restaurant) return null
  const visits = (unwrap(v) as Visit[]).sort((a, b) => b.date.localeCompare(a.date))
  const dishes = (unwrap(d) as Dish[]).sort(
    (a, b) => (b.rating ?? 0) - (a.rating ?? 0) || a.name.localeCompare(b.name),
  )
  return { restaurant: withStats(restaurant, visits, dishes), visits, dishes }
}

export type NewRestaurant = Pick<Restaurant, 'name' | 'status'> &
  Partial<Omit<Restaurant, 'id' | 'created_at' | 'name' | 'status'>>

export async function createRestaurant(input: NewRestaurant): Promise<Restaurant> {
  return unwrap(await supabase.from('restaurants').insert(input).select().single()) as Restaurant
}

export async function updateRestaurant(
  id: string,
  patch: Partial<Omit<Restaurant, 'id' | 'created_at'>>,
): Promise<void> {
  check(await supabase.from('restaurants').update(patch).eq('id', id))
}

export async function setRestaurantStatus(id: string, status: PlaceStatus): Promise<void> {
  await updateRestaurant(id, { status })
}

/** Visits, dishes and share links are removed automatically (ON DELETE CASCADE). */
export async function deleteRestaurant(id: string): Promise<void> {
  check(await supabase.from('restaurants').delete().eq('id', id))
}

// ---------- Visits ----------

export type NewVisit = Omit<Visit, 'id'>

/** Saves a visit (and an optional first dish) and marks the place as visited. */
export async function addVisit(
  visit: NewVisit,
  firstDish?: Omit<Dish, 'id' | 'visit_id' | 'restaurant_id'>,
): Promise<Visit> {
  const saved = unwrap(await supabase.from('visits').insert(visit).select().single()) as Visit
  if (firstDish) {
    check(
      await supabase
        .from('dishes')
        .insert({ ...firstDish, restaurant_id: visit.restaurant_id, visit_id: saved.id }),
    )
  }
  await updateRestaurant(visit.restaurant_id, { status: 'visited' })
  return saved
}

/** Dishes stay on the restaurant; their visit_id is set to null by the database. */
export async function deleteVisit(id: string): Promise<void> {
  check(await supabase.from('visits').delete().eq('id', id))
}

// ---------- Dishes ----------

export type DishInput = Omit<Dish, 'id'> & { id?: string }

export async function getDish(id: string): Promise<Dish | null> {
  return unwrap(await supabase.from('dishes').select('*').eq('id', id).maybeSingle()) as Dish | null
}

export async function saveDish(input: DishInput): Promise<Dish> {
  const { id, ...fields } = input
  const query = id
    ? supabase.from('dishes').update(fields).eq('id', id)
    : supabase.from('dishes').insert(fields)
  return unwrap(await query.select().single()) as Dish
}

export async function deleteDish(id: string): Promise<void> {
  check(await supabase.from('dishes').delete().eq('id', id))
}

// ---------- Sharing ----------

export async function createShareLink(restaurant_id: string, snapshot: string): Promise<ShareLink> {
  return unwrap(
    await supabase.from('share_links').insert({ restaurant_id, snapshot }).select().single(),
  ) as ShareLink
}

// ---------- Profile & data ----------

const PROFILE_COLUMNS = 'name, home_area, currency, onboarded'

export async function getProfile(): Promise<UserProfile> {
  const id = await requireUserId()
  const existing = unwrap(
    await supabase.from('profiles').select(PROFILE_COLUMNS).eq('id', id).maybeSingle(),
  ) as UserProfile | null
  if (existing) return existing
  // Safety net if the signup trigger did not create the row.
  return unwrap(
    await supabase.from('profiles').insert({ id }).select(PROFILE_COLUMNS).single(),
  ) as UserProfile
}

export async function saveProfile(patch: Partial<UserProfile>): Promise<UserProfile> {
  const id = await requireUserId()
  return unwrap(
    await supabase.from('profiles').update(patch).eq('id', id).select(PROFILE_COLUMNS).single(),
  ) as UserProfile
}

export async function exportAll(): Promise<string> {
  return JSON.stringify(await loadAll(), null, 2)
}

/** Add the demo restaurants. With onlyIfEmpty, does nothing if the user already has places. */
export async function seedSampleData(onlyIfEmpty = true): Promise<void> {
  if (onlyIfEmpty) {
    const { count, error } = await supabase.from('restaurants').select('id', { count: 'exact', head: true })
    if (error) throw new Error(error.message)
    if ((count ?? 0) > 0) return
  }
  const ids = new Map<string, string>()
  const newId = (old: string) => {
    if (!ids.has(old)) ids.set(old, uuid())
    return ids.get(old) as string
  }
  check(
    await supabase.from('restaurants').insert(
      SAMPLE_DB.restaurants.map((r) => ({ ...r, id: newId(r.id) })),
    ),
  )
  check(
    await supabase.from('visits').insert(
      SAMPLE_DB.visits.map((v) => ({ ...v, id: newId(v.id), restaurant_id: newId(v.restaurant_id) })),
    ),
  )
  check(
    await supabase.from('dishes').insert(
      SAMPLE_DB.dishes.map((d) => ({
        ...d,
        id: newId(d.id),
        restaurant_id: newId(d.restaurant_id),
        visit_id: d.visit_id ? newId(d.visit_id) : null,
      })),
    ),
  )
}

/** Remove every restaurant, visit, dish and share link. Keeps the account and profile. */
export async function clearAllData(): Promise<void> {
  const id = await requireUserId()
  check(await supabase.from('restaurants').delete().eq('user_id', id))
}

/** Replace the journal with the demo restaurants. Keeps the account and profile. */
export async function resetSampleData(): Promise<void> {
  await clearAllData()
  await seedSampleData(false)
}
