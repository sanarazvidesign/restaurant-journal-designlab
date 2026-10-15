import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { deleteDish, getDish, saveDish } from '../data/api'
import type { HalalStatus } from '../data/types'
import { useAsync } from '../hooks/useAsync'
import { useProfile } from '../hooks/useProfile'
import { PhotoInput } from '../components/PhotoInput'
import { Button, Card, ErrorNote, Field, inputClass, Loading, PageHeader, RatingStars, StatusPicker, Toggle } from '../components/ui'
import { HALAL_LABEL } from '../lib/format'

const halalOptions = (Object.keys(HALAL_LABEL) as HalalStatus[]).map((v) => ({ value: v, label: HALAL_LABEL[v] }))

export default function DishForm() {
  const { id = '', dishId } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { profile } = useProfile()
  const existing = useAsync(() => (dishId ? getDish(dishId) : Promise.resolve(null)), [dishId])

  const [name, setName] = useState('')
  const [halal, setHalal] = useState<HalalStatus>('unsure')
  const [price, setPrice] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [again, setAgain] = useState(true)
  const [healthy, setHealthy] = useState(false)
  const [note, setNote] = useState('')
  const [photo, setPhoto] = useState<string | null>(null)
  const [visitId, setVisitId] = useState<string | null>(params.get('visit'))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const dish = existing.data
  useEffect(() => {
    if (!dish) return
    setName(dish.name)
    setHalal(dish.halal_status)
    setPrice(dish.price != null ? String(dish.price) : '')
    setRating(dish.rating)
    setAgain(dish.would_order_again)
    setHealthy(dish.healthy_tag)
    setNote(dish.note)
    setPhoto(dish.photo)
    setVisitId(dish.visit_id)
  }, [dish])

  if (dishId && existing.loading) return <Loading />

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter the dish name.')
      return
    }
    const p = price.trim() === '' ? null : Number(price)
    if (p != null && (!Number.isFinite(p) || p < 0)) {
      setError('Price must be a number.')
      return
    }
    setSaving(true)
    try {
      await saveDish({
        id: dishId,
        restaurant_id: id,
        visit_id: visitId,
        name: name.trim(),
        halal_status: halal,
        price: p,
        rating,
        would_order_again: again,
        healthy_tag: healthy,
        note: note.trim(),
        photo,
      })
      navigate(`/restaurant/${id}`, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <PageHeader title={dishId ? 'Edit dish' : 'Add dish'} back />

      <Card className="space-y-5">
        <Field label="Dish name *">
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoComplete="off" />
        </Field>
        <StatusPicker label="Halal status" value={halal} options={halalOptions} onChange={setHalal} />
        <Field label={`Price (${profile.currency})`}>
          <input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className={inputClass} />
        </Field>
        <div>
          <span className="mb-1 block text-sm font-medium text-slate-700">Rating</span>
          <RatingStars value={rating} onChange={setRating} label="Dish rating" />
        </div>
        <div>
          <Toggle checked={again} onChange={setAgain} label="I would order this again" />
          <Toggle checked={healthy} onChange={setHealthy} label="Light / healthy option" />
        </div>
        <Field label="Note">
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className={`${inputClass} py-2`} />
        </Field>
        <PhotoInput value={photo} onChange={setPhoto} />
      </Card>

      <ErrorNote message={error} />
      <Button type="submit" disabled={saving} className="w-full">{saving ? 'Saving…' : 'Save dish'}</Button>
      {dishId && (
        <Button
          variant="danger"
          className="w-full"
          onClick={async () => {
            if (!window.confirm('Delete this dish?')) return
            await deleteDish(dishId)
            navigate(`/restaurant/${id}`, { replace: true })
          }}
        >
          Delete dish
        </Button>
      )}
    </form>
  )
}
