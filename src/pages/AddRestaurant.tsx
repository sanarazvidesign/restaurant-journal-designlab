import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRestaurant } from '../data/api'
import { PLACE_LOOKUP, type PlaceLookupResult } from '../data/sample'
import type { PlaceStatus, PriceLevel } from '../data/types'
import { PhotoInput } from '../components/PhotoInput'
import { Button, Card, ErrorNote, Field, inputClass, PageHeader, StatusPicker } from '../components/ui'
import { PRICE_LABEL } from '../lib/format'

export default function AddRestaurant() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState<PlaceLookupResult | null>(null)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [price, setPrice] = useState<PriceLevel | null>(null)
  const [status, setStatus] = useState<PlaceStatus>('visited')
  const [photo, setPhoto] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const q = query.trim().toLowerCase()
  const matches = q.length >= 2 && !picked
    ? PLACE_LOOKUP.filter((p) => `${p.name} ${p.address} ${p.cuisine}`.toLowerCase().includes(q)).slice(0, 5)
    : []

  function choose(p: PlaceLookupResult) {
    setPicked(p)
    setQuery(p.name)
    setName(p.name)
    setAddress(p.address)
    setCuisine(p.cuisine)
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter the restaurant name.')
      return
    }
    setSaving(true)
    try {
      const saved = await createRestaurant({
        name: name.trim(),
        address: address.trim(),
        cuisine: cuisine.trim(),
        price_level: price,
        status,
        photo,
        lat: picked?.lat ?? null,
        lng: picked?.lng ?? null,
      })
      // Next step: halal details (the most valuable part). User can skip from there.
      navigate(`/restaurant/${saved.id}/halal?new=1`, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <PageHeader title="Add restaurant" subtitle="Search, or type the details yourself." back />

      <Card>
        <Field label="Search for a place" hint="Demo search over a few sample places. Real maps lookup comes later.">
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPicked(null)
            }}
            placeholder="e.g. Cedar Tree"
            className={inputClass}
          />
        </Field>
        {matches.length > 0 && (
          <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200">
            {matches.map((m) => (
              <li key={m.name}>
                <button type="button" onClick={() => choose(m)} className="block w-full px-3 py-2.5 text-left hover:bg-slate-50">
                  <span className="block font-medium">{m.name}</span>
                  <span className="block text-xs text-slate-500">{m.address} · {m.cuisine}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="space-y-4">
        <Field label="Name *">
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoComplete="off" />
        </Field>
        <Field label="Address">
          <input value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} autoComplete="off" />
        </Field>
        <Field label="Cuisine">
          <input value={cuisine} onChange={(e) => setCuisine(e.target.value)} placeholder="e.g. Pakistani" className={inputClass} />
        </Field>
        <StatusPicker
          label="Price level"
          value={String(price ?? 0)}
          options={[
            { value: '0', label: 'Not set' },
            ...([1, 2, 3, 4] as const).map((p) => ({ value: String(p), label: `${'$'.repeat(p)} ${PRICE_LABEL[p]}` })),
          ]}
          onChange={(v) => setPrice(v === '0' ? null : (Number(v) as PriceLevel))}
        />
        <StatusPicker
          label="Have you been?"
          value={status}
          options={[
            { value: 'visited', label: 'Visited' },
            { value: 'want_to_try', label: 'Want to try' },
          ]}
          onChange={setStatus}
        />
        <PhotoInput value={photo} onChange={setPhoto} />
      </Card>

      <ErrorNote message={error} />
      <Button type="submit" disabled={saving} className="w-full">
        {saving ? 'Saving…' : 'Save and add halal details'}
      </Button>
    </form>
  )
}
