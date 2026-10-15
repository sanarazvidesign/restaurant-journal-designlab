import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addVisit, getRestaurantDetail } from '../data/api'
import type { Companions, HalalStatus } from '../data/types'
import { useAsync } from '../hooks/useAsync'
import { useProfile } from '../hooks/useProfile'
import { Button, Card, ErrorNote, Field, inputClass, Loading, PageHeader, RatingStars, StatusPicker, Toggle } from '../components/ui'
import { COMPANION_LABEL, HALAL_LABEL, today } from '../lib/format'

const companionOptions = (Object.keys(COMPANION_LABEL) as Companions[]).map((v) => ({ value: v, label: COMPANION_LABEL[v] }))
const halalOptions = (Object.keys(HALAL_LABEL) as HalalStatus[]).map((v) => ({ value: v, label: HALAL_LABEL[v] }))

function num(s: string): number | null {
  if (s.trim() === '') return null
  const n = Number(s)
  return Number.isFinite(n) && n >= 0 ? n : null
}

export default function LogVisit() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { profile } = useProfile()
  const detail = useAsync(() => getRestaurantDetail(id), [id])

  const [date, setDate] = useState(today())
  const [companions, setCompanions] = useState<Companions>('family')
  const [partySize, setPartySize] = useState('2')
  const [cost, setCost] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [note, setNote] = useState('')

  const [dishName, setDishName] = useState('')
  const [dishPrice, setDishPrice] = useState('')
  const [dishRating, setDishRating] = useState<number | null>(null)
  const [dishHalal, setDishHalal] = useState<HalalStatus>('unsure')
  const [again, setAgain] = useState(true)

  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  if (!detail.data) return detail.loading ? <Loading /> : <PageHeader title="Not found" back />
  const r = detail.data.restaurant

  async function submit(e: FormEvent) {
    e.preventDefault()
    const size = Math.max(1, Math.round(num(partySize) ?? 1))
    setSaving(true)
    try {
      await addVisit(
        { restaurant_id: id, date, companions, party_size: size, total_cost: num(cost), overall_rating: rating, note: note.trim() },
        dishName.trim()
          ? {
              name: dishName.trim(),
              halal_status: dishHalal,
              price: num(dishPrice),
              rating: dishRating,
              would_order_again: again,
              healthy_tag: false,
              note: '',
              photo: null,
            }
          : undefined,
      )
      navigate(`/restaurant/${id}`, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <PageHeader title="Log a visit" subtitle={r.name} back />

      <Card className="space-y-5">
        <Field label="Date">
          <input type="date" max={today()} value={date} onChange={(e) => setDate(e.target.value || today())} className={inputClass} />
        </Field>
        <StatusPicker label="Who did you go with?" value={companions} options={companionOptions} onChange={(v) => {
          setCompanions(v)
          if (v === 'solo') setPartySize('1')
        }} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Party size">
            <input inputMode="numeric" value={partySize} onChange={(e) => setPartySize(e.target.value)} className={inputClass} />
          </Field>
          <Field label={`Total bill (${profile.currency})`}>
            <input inputMode="decimal" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="0.00" className={inputClass} />
          </Field>
        </div>
        <div>
          <span className="mb-1 block text-sm font-medium text-slate-700">Overall rating</span>
          <RatingStars value={rating} onChange={setRating} label="Overall rating" />
        </div>
        <Field label="Note (optional)">
          <input value={note} onChange={(e) => setNote(e.target.value)} className={inputClass} />
        </Field>
      </Card>

      <Card className="space-y-5">
        <div>
          <h2 className="font-semibold">First dish (optional)</h2>
          <p className="text-sm text-slate-500">Add more dishes later from the restaurant page.</p>
        </div>
        <Field label="Dish name">
          <input value={dishName} onChange={(e) => setDishName(e.target.value)} className={inputClass} />
        </Field>
        {dishName.trim() && (
          <>
            <StatusPicker label="Halal status" value={dishHalal} options={halalOptions} onChange={setDishHalal} />
            <Field label={`Price (${profile.currency})`}>
              <input inputMode="decimal" value={dishPrice} onChange={(e) => setDishPrice(e.target.value)} className={inputClass} />
            </Field>
            <div>
              <span className="mb-1 block text-sm font-medium text-slate-700">Dish rating</span>
              <RatingStars value={dishRating} onChange={setDishRating} label="Dish rating" />
            </div>
            <Toggle checked={again} onChange={setAgain} label="I would order this again" />
          </>
        )}
      </Card>

      <ErrorNote message={error} />
      <Button type="submit" disabled={saving} className="w-full">{saving ? 'Saving…' : 'Save visit'}</Button>
    </form>
  )
}
