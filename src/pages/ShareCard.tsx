import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { createShareLink, getRestaurantDetail, type RestaurantDetail } from '../data/api'
import { useAsync } from '../hooks/useAsync'
import { useProfile } from '../hooks/useProfile'
import { Button, Card, ErrorNote, FlagPill, HalalBadge, Loading, PageHeader, Toggle } from '../components/ui'
import { formatDate, formatMoney, HALAL_LABEL, PRICE_LABEL, priceSymbols, VERIFY_LABEL, YNU_LABEL } from '../lib/format'

interface Options {
  halal: boolean
  flags: boolean
  dishes: boolean
  price: boolean
  notes: boolean
}

function buildText(d: RestaurantDetail, o: Options, currency: string): string {
  const r = d.restaurant
  const lines: string[] = [r.name]
  const where = [r.cuisine, r.address].filter(Boolean).join(' · ')
  if (where) lines.push(where)
  if (o.halal) {
    let halal = `Halal: ${HALAL_LABEL[r.halal_status]}`
    if (r.halal_type_note) halal += ` (${r.halal_type_note})`
    lines.push(halal)
    lines.push(`Checked: ${VERIFY_LABEL[r.verification_method]}, ${formatDate(r.last_verified_date)}`)
  }
  if (o.flags) {
    lines.push(`Alcohol: ${YNU_LABEL[r.alcohol_served]} · Pork: ${YNU_LABEL[r.pork_served]}`)
  }
  if (o.price) {
    const parts = [
      r.price_level ? `${priceSymbols(r.price_level)} ${PRICE_LABEL[r.price_level]}` : '',
      r.avgSpendPerPerson != null ? `about ${formatMoney(r.avgSpendPerPerson, currency)} per person` : '',
    ].filter(Boolean)
    if (parts.length) lines.push(`Price: ${parts.join(' · ')}`)
  }
  if (o.dishes) {
    const top = d.dishes.filter((x) => (x.rating ?? 0) >= 4 || x.would_order_again).slice(0, 3)
    if (top.length) lines.push(`Try: ${top.map((x) => x.name).join(', ')}`)
  }
  if (o.notes && r.notes) lines.push(`Note: ${r.notes}`)
  lines.push('')
  lines.push(`From my personal notes, last checked ${formatDate(r.last_verified_date)}. Not an official halal certification, so please confirm with the restaurant.`)
  return lines.join('\n')
}

export default function ShareCard() {
  const { id = '' } = useParams()
  const { profile } = useProfile()
  const detail = useAsync(() => getRestaurantDetail(id), [id])
  const [opts, setOpts] = useState<Options>({ halal: true, flags: true, dishes: true, price: true, notes: false })
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!detail.data) return detail.loading ? <Loading /> : <PageHeader title="Not found" back />
  const d = detail.data
  const r = d.restaurant
  const text = buildText(d, opts, profile.currency)
  const topDishes = d.dishes.filter((x) => (x.rating ?? 0) >= 4 || x.would_order_again).slice(0, 3)
  const set = (k: keyof Options) => (v: boolean) => setOpts((o) => ({ ...o, [k]: v }))

  async function send() {
    setError(null)
    setMessage(null)
    try {
      await createShareLink(id, text)
      if (typeof navigator.share === 'function') {
        try {
          await navigator.share({ title: r.name, text })
          return
        } catch (e) {
          if (e instanceof DOMException && e.name === 'AbortError') return
          // otherwise fall back to copying
        }
      }
      await navigator.clipboard.writeText(text)
      setMessage('Copied to your clipboard. Paste it into any chat or text.')
    } catch {
      setError('Could not share or copy. Select the text in the preview and copy it manually.')
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Share" subtitle="Check what will be sent" back />

      <Card className="border-emerald-200 bg-emerald-50/50">
        <h2 className="text-lg font-bold">{r.name}</h2>
        <p className="text-sm text-slate-600">{[r.cuisine, r.address].filter(Boolean).join(' · ')}</p>
        {opts.halal && (
          <div className="mt-3">
            <HalalBadge status={r.halal_status} />
            <p className="mt-1 text-xs text-slate-500">
              {VERIFY_LABEL[r.verification_method]} · {formatDate(r.last_verified_date)}
            </p>
          </div>
        )}
        {opts.flags && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            <FlagPill kind="alcohol" value={r.alcohol_served} />
            <FlagPill kind="pork" value={r.pork_served} />
          </div>
        )}
        {opts.price && (r.price_level || r.avgSpendPerPerson != null) && (
          <p className="mt-2 text-sm">
            {[
              r.price_level ? `${priceSymbols(r.price_level)} ${PRICE_LABEL[r.price_level]}` : '',
              r.avgSpendPerPerson != null ? `about ${formatMoney(r.avgSpendPerPerson, profile.currency)} per person` : '',
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
        {opts.dishes && topDishes.length > 0 && (
          <p className="mt-2 text-sm"><span className="font-medium">Try:</span> {topDishes.map((x) => x.name).join(', ')}</p>
        )}
        {opts.notes && r.notes && <p className="mt-2 text-sm text-slate-700">{r.notes}</p>}
        <p className="mt-3 text-xs text-slate-500">From my personal notes, not an official halal certification.</p>
      </Card>

      <Card>
        <h2 className="mb-1 font-semibold">Include</h2>
        <Toggle checked={opts.halal} onChange={set('halal')} label="Halal status and how it was checked" />
        <Toggle checked={opts.flags} onChange={set('flags')} label="Alcohol and pork details" />
        <Toggle checked={opts.dishes} onChange={set('dishes')} label="Top dishes" />
        <Toggle checked={opts.price} onChange={set('price')} label="Price level and average spend" />
        <Toggle checked={opts.notes} onChange={set('notes')} label="My notes" />
      </Card>

      <ErrorNote message={error} />
      {message && <p role="status" className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{message}</p>}
      <Button className="w-full" onClick={send}>
        {typeof navigator.share === 'function' ? 'Share' : 'Copy to share'}
      </Button>

      <details className="text-sm text-slate-500">
        <summary className="cursor-pointer">Preview the plain text</summary>
        <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-white p-3 font-sans text-slate-700">{text}</pre>
      </details>
    </div>
  )
}
