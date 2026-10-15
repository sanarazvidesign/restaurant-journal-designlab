import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteRestaurant, deleteVisit, getRestaurantDetail, setRestaurantStatus } from '../data/api'
import { useAsync } from '../hooks/useAsync'
import { useProfile } from '../hooks/useProfile'
import {
  Button,
  buttonClass,
  Card,
  EmptyState,
  ErrorNote,
  FlagPill,
  HalalBadge,
  Loading,
  PageHeader,
  RatingStars,
  SectionTitle,
} from '../components/ui'
import {
  COMPANION_LABEL,
  formatDate,
  formatMoney,
  HALAL_LABEL,
  isStale,
  PRICE_LABEL,
  priceSymbols,
  VERIFY_LABEL,
} from '../lib/format'

export default function RestaurantDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { profile } = useProfile()
  const detail = useAsync(() => getRestaurantDetail(id), [id])

  if (detail.loading && !detail.data) return <Loading />
  if (!detail.data) {
    return (
      <div>
        <PageHeader title="Not found" back />
        <EmptyState title="We could not find that restaurant" action={<Link to="/" className={buttonClass()}>Back to My Places</Link>} />
      </div>
    )
  }

  const { restaurant: r, visits, dishes } = detail.data
  const stale = isStale(r.last_verified_date)
  const hasHalalInfo = r.verification_method !== 'none' || r.halal_status !== 'unsure'

  async function remove() {
    if (!window.confirm(`Delete ${r.name} and all its visits and dishes?`)) return
    await deleteRestaurant(r.id)
    navigate('/', { replace: true })
  }

  return (
    <div>
      <PageHeader title={r.name} subtitle={[r.cuisine, r.address].filter(Boolean).join(' · ')} back />
      <ErrorNote message={detail.error} />

      {r.photo && <img src={r.photo} alt="" className="mb-4 h-48 w-full rounded-2xl object-cover" />}

      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <HalalBadge status={r.halal_status} className="!px-3 !py-1 !text-sm" />
          <FlagPill kind="alcohol" value={r.alcohol_served} />
          <FlagPill kind="pork" value={r.pork_served} />
          {r.status === 'want_to_try' && (
            <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-800">Want to try</span>
          )}
        </div>

        {r.halal_type_note && <p className="mt-3 text-sm text-slate-700">{r.halal_type_note}</p>}

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-slate-500">Checked via</dt>
            <dd className="font-medium">{VERIFY_LABEL[r.verification_method]}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Last checked</dt>
            <dd className="font-medium">{formatDate(r.last_verified_date)}</dd>
          </div>
          {r.certifier && (
            <div className="col-span-2">
              <dt className="text-slate-500">Certifier</dt>
              <dd className="font-medium">{r.certifier}</dd>
            </div>
          )}
        </dl>

        {(stale || !hasHalalInfo) && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {!hasHalalInfo || !r.last_verified_date
              ? 'No halal details recorded yet. '
              : 'Halal info was last checked over 6 months ago. Worth a re-check. '}
            <Link to={`/restaurant/${r.id}/halal`} className="font-semibold underline">
              {hasHalalInfo ? 'Update details' : 'Add details'}
            </Link>
          </p>
        )}
        <p className="mt-3 text-xs text-slate-500">
          These are your own notes, not an official halal certification. Always confirm with the restaurant if it matters.
        </p>
      </Card>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Link to={`/restaurant/${r.id}/visit/new`} className={buttonClass()}>Log visit</Link>
        <Link to={`/restaurant/${r.id}/dish/new`} className={buttonClass('secondary')}>Add dish</Link>
        <Link to={`/restaurant/${r.id}/share`} className={buttonClass('secondary')}>Share</Link>
        <Link to={`/restaurant/${r.id}/halal`} className={buttonClass('secondary')}>Edit details</Link>
      </div>

      <SectionTitle>Cost</SectionTitle>
      <Card>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-bold">{priceSymbols(r.price_level) || '–'}</p>
            <p className="text-xs text-slate-500">{r.price_level ? PRICE_LABEL[r.price_level] : 'Price level'}</p>
          </div>
          <div>
            <p className="text-lg font-bold">{formatMoney(r.avgSpendPerPerson, profile.currency)}</p>
            <p className="text-xs text-slate-500">Avg per person</p>
          </div>
          <div>
            <p className="text-lg font-bold">{r.visitCount}</p>
            <p className="text-xs text-slate-500">Visits</p>
          </div>
        </div>
      </Card>

      <SectionTitle action={<Link to={`/restaurant/${r.id}/dish/new`} className="text-sm font-medium text-emerald-800">+ Add</Link>}>
        Dishes
      </SectionTitle>
      {dishes.length === 0 ? (
        <EmptyState title="No dishes yet" body="Log what you ate so you remember what to order next time." />
      ) : (
        <ul className="space-y-2">
          {dishes.map((d) => (
            <li key={d.id}>
              <Link to={`/restaurant/${r.id}/dish/${d.id}`} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3">
                {d.photo && <img src={d.photo} alt="" className="size-14 rounded-xl object-cover" />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-medium">{d.name}</p>
                    <span className="shrink-0 text-sm text-slate-600">{formatMoney(d.price, profile.currency)}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <RatingStars value={d.rating} />
                    <span className="text-slate-500">{HALAL_LABEL[d.halal_status]}</span>
                    {d.would_order_again && <span className="font-medium text-emerald-700">Order again</span>}
                    {d.healthy_tag && <span className="font-medium text-lime-700">Light / healthy</span>}
                  </div>
                  {d.note && <p className="mt-1 text-sm text-slate-600">{d.note}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <SectionTitle>Visits</SectionTitle>
      {visits.length === 0 ? (
        <EmptyState title="No visits logged" body="Log a visit to track cost and memories." />
      ) : (
        <ul className="space-y-2">
          {visits.map((v) => (
            <li key={v.id} className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{formatDate(v.date)}</p>
                <RatingStars value={v.overall_rating} />
              </div>
              <p className="mt-0.5 text-sm text-slate-600">
                {COMPANION_LABEL[v.companions]} · party of {v.party_size} · {formatMoney(v.total_cost, profile.currency)}
              </p>
              {v.note && <p className="mt-1 text-sm text-slate-600">{v.note}</p>}
              <button
                type="button"
                onClick={async () => {
                  if (!window.confirm('Delete this visit? Its dishes stay on the restaurant.')) return
                  await deleteVisit(v.id)
                  detail.reload()
                }}
                className="mt-1 text-xs font-medium text-red-700"
              >
                Delete visit
              </button>
            </li>
          ))}
        </ul>
      )}

      {r.notes && (
        <>
          <SectionTitle>Notes</SectionTitle>
          <Card><p className="whitespace-pre-wrap text-sm">{r.notes}</p></Card>
        </>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        {r.status === 'want_to_try' && (
          <Button
            variant="secondary"
            onClick={async () => {
              await setRestaurantStatus(r.id, 'visited')
              detail.reload()
            }}
          >
            Mark as visited
          </Button>
        )}
        <Button variant="danger" onClick={remove}>Delete restaurant</Button>
      </div>
    </div>
  )
}
