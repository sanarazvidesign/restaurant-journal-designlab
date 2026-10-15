import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EMPTY_FILTERS, listCuisines, listRestaurants, type Filters } from '../data/api'
import { useAsync } from '../hooks/useAsync'
import { MapView } from '../components/MapView'
import { RestaurantCard } from '../components/RestaurantCard'
import { buttonClass, Chip, EmptyState, ErrorNote, inputClass, Loading, PageHeader, selectClass } from '../components/ui'
import { PRICE_LABEL } from '../lib/format'

const filterSelectClass = `${selectClass} !pl-2 !pr-7 !text-[13px]`

export default function MyPlaces() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [view, setView] = useState<'list' | 'map'>('list')
  const places = useAsync(() => listRestaurants(filters), [JSON.stringify(filters)])
  const cuisines = useAsync(listCuisines, [])

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((f) => ({ ...f, [key]: value }))
  const anyFilter = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS)
  const list = places.data ?? []

  return (
    <div>
      <PageHeader
        title="My Places"
        subtitle={places.data ? `${list.length} place${list.length === 1 ? '' : 's'}` : undefined}
        action={
          <div className="flex rounded-xl border border-slate-300 bg-white p-0.5" role="group" aria-label="View">
            {(['list', 'map'] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={`min-h-9 rounded-lg px-3 text-sm font-medium capitalize ${
                  view === v ? 'bg-emerald-700 text-white' : 'text-slate-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        }
      />

      <input
        type="search"
        value={filters.search}
        onChange={(e) => set('search', e.target.value)}
        placeholder="Search name, cuisine or area"
        aria-label="Search places"
        className={inputClass}
      />

      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filters">
        <Chip active={filters.fullyHalal} onClick={() => set('fullyHalal', !filters.fullyHalal)}>Fully halal</Chip>
        <Chip active={filters.noAlcohol} onClick={() => set('noAlcohol', !filters.noAlcohol)}>No alcohol</Chip>
        <Chip active={filters.noPork} onClick={() => set('noPork', !filters.noPork)}>No pork</Chip>
        <Chip active={filters.wantToTry} onClick={() => set('wantToTry', !filters.wantToTry)}>Want to try</Chip>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <select aria-label="Price level" value={filters.price} onChange={(e) => set('price', Number(e.target.value))} className={filterSelectClass}>
          <option value={0}>Any price</option>
          {([1, 2, 3, 4] as const).map((p) => (
            <option key={p} value={p}>{'$'.repeat(p)} {PRICE_LABEL[p]}</option>
          ))}
        </select>
        <select aria-label="Cuisine" value={filters.cuisine} onChange={(e) => set('cuisine', e.target.value)} className={filterSelectClass}>
          <option value="">Any cuisine</option>
          {(cuisines.data ?? []).map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select aria-label="Minimum rating" value={filters.minRating} onChange={(e) => set('minRating', Number(e.target.value))} className={filterSelectClass}>
          <option value={0}>Any rating</option>
          {[3, 4, 5].map((r) => <option key={r} value={r}>{r}+ stars</option>)}
        </select>
      </div>
      {anyFilter && (
        <button type="button" onClick={() => setFilters(EMPTY_FILTERS)} className="mt-2 text-sm font-medium text-emerald-800">
          Clear filters
        </button>
      )}

      <div className="mt-5">
        <ErrorNote message={places.error} />
        {places.loading && !places.data ? (
          <Loading />
        ) : list.length === 0 ? (
          anyFilter ? (
            <EmptyState title="No places match" body="Try removing a filter." />
          ) : (
            <EmptyState
              title="Your journal is empty"
              body="Save the first restaurant you visit, or add one you want to try."
              action={<Link to="/add" className={buttonClass()}>Add a restaurant</Link>}
            />
          )
        ) : view === 'map' ? (
          <MapView places={list} />
        ) : (
          <div className="grid gap-3 lg:grid-cols-1">
            {list.map((p) => <RestaurantCard key={p.id} place={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
