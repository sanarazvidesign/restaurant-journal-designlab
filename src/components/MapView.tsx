import { useState } from 'react'
import type { RestaurantWithStats } from '../data/api'
import { RestaurantCard } from './RestaurantCard'

const PIN_COLOR = {
  fully_halal: '#047857',
  partially_halal: '#d97706',
  not_halal: '#dc2626',
  unsure: '#64748b',
} as const

/**
 * A lightweight pin map: places are plotted by lat/lng onto a plain panel.
 * No map tiles or API key needed for v1; swap for a real map component later.
 */
export function MapView({ places }: { places: RestaurantWithStats[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const located = places.filter((p) => p.lat != null && p.lng != null)
  const unlocated = places.filter((p) => p.lat == null || p.lng == null)

  const lats = located.map((p) => p.lat as number)
  const lngs = located.map((p) => p.lng as number)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  const spanLat = maxLat - minLat || 0.01
  const spanLng = maxLng - minLng || 0.01

  const selected = places.find((p) => p.id === selectedId) ?? null

  return (
    <div>
      {located.length > 0 && (
        <div
          className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 bg-emerald-50 md:aspect-[16/9]"
          role="group"
          aria-label="Map of saved places"
        >
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                'linear-gradient(#d1fae5 1px, transparent 1px), linear-gradient(90deg, #d1fae5 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          {located.map((p) => {
            const x = 8 + ((((p.lng as number) - minLng) / spanLng) * 84)
            const y = 8 + ((1 - ((p.lat as number) - minLat) / spanLat) * 84)
            const active = p.id === selectedId
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedId(active ? null : p.id)}
                aria-label={p.name}
                aria-pressed={active}
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-full p-2"
              >
                <svg width={active ? 34 : 28} height={active ? 34 : 28} viewBox="0 0 24 24" aria-hidden>
                  <path
                    d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"
                    fill={PIN_COLOR[p.halal_status]}
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                  <circle cx="12" cy="10" r="2.6" fill="#fff" />
                </svg>
              </button>
            )
          })}
        </div>
      )}
      <p className="mt-2 text-xs text-slate-500">
        Pin colour: green fully halal · amber partially · red not halal · grey unsure. A full map comes later.
      </p>
      {selected && (
        <div className="mt-3">
          <RestaurantCard place={selected} />
        </div>
      )}
      {unlocated.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-semibold text-slate-500">No location saved</h3>
          {unlocated.map((p) => (
            <RestaurantCard key={p.id} place={p} />
          ))}
        </div>
      )}
    </div>
  )
}
