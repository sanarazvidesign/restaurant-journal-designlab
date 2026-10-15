import { Link } from 'react-router-dom'
import type { RestaurantWithStats } from '../data/api'
import { formatMoney, priceSymbols } from '../lib/format'
import { useProfile } from '../hooks/useProfile'
import { FlagPill, HalalBadge, RatingStars } from './ui'

export function RestaurantCard({ place }: { place: RestaurantWithStats }) {
  const { profile } = useProfile()
  return (
    <Link
      to={`/restaurant/${place.id}`}
      className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_0_rgba(0,0,0,0.06)] transition-shadow hover:shadow-md"
    >
      {place.photo ? (
        <img src={place.photo} alt="" className="size-20 shrink-0 rounded-xl object-cover" />
      ) : (
        <div className="grid size-20 shrink-0 place-items-center rounded-xl bg-emerald-50 text-2xl font-bold text-emerald-700" aria-hidden>
          {place.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-semibold">{place.name}</h3>
          {place.status === 'want_to_try' && (
            <span className="shrink-0 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-800">Want to try</span>
          )}
        </div>
        <p className="truncate text-sm text-slate-500">
          {[place.cuisine, priceSymbols(place.price_level)].filter(Boolean).join(' · ') || 'No details yet'}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <HalalBadge status={place.halal_status} />
          <FlagPill kind="alcohol" value={place.alcohol_served} />
          <FlagPill kind="pork" value={place.pork_served} />
        </div>
        <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500">
          {place.avgRating != null && <RatingStars value={place.avgRating} />}
          {place.avgSpendPerPerson != null && <span>{formatMoney(place.avgSpendPerPerson, profile.currency)} / person</span>}
          {place.visitCount > 0 && <span>{place.visitCount} visit{place.visitCount > 1 ? 's' : ''}</span>}
        </div>
      </div>
    </Link>
  )
}
