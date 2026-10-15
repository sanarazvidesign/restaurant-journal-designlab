import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getRestaurantDetail, updateRestaurant } from '../data/api'
import type { HalalStatus, PriceLevel, Restaurant, VerificationMethod, YesNoUnsure } from '../data/types'
import { useAsync } from '../hooks/useAsync'
import { Button, Card, ErrorNote, Field, inputClass, Loading, PageHeader, StatusPicker } from '../components/ui'
import { HALAL_LABEL, PRICE_LABEL, today, VERIFY_LABEL, YNU_LABEL } from '../lib/format'

const halalOptions = (Object.keys(HALAL_LABEL) as HalalStatus[]).map((v) => ({ value: v, label: HALAL_LABEL[v] }))
const ynuOptions = (['yes', 'no', 'unsure'] as YesNoUnsure[]).map((v) => ({ value: v, label: YNU_LABEL[v] }))
const verifyOptions = (Object.keys(VERIFY_LABEL) as VerificationMethod[]).map((v) => ({ value: v, label: VERIFY_LABEL[v] }))

type Form = Pick<
  Restaurant,
  | 'halal_status'
  | 'halal_type_note'
  | 'alcohol_served'
  | 'pork_served'
  | 'verification_method'
  | 'certifier'
  | 'last_verified_date'
  | 'price_level'
  | 'notes'
>

export default function HalalDetails() {
  const { id = '' } = useParams()
  const [params] = useSearchParams()
  const isNew = params.get('new') === '1'
  const navigate = useNavigate()
  const detail = useAsync(() => getRestaurantDetail(id), [id])
  const [form, setForm] = useState<Form | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const loaded = detail.data?.restaurant
  useEffect(() => {
    if (loaded && !form) {
      setForm({
        halal_status: loaded.halal_status,
        halal_type_note: loaded.halal_type_note,
        alcohol_served: loaded.alcohol_served,
        pork_served: loaded.pork_served,
        verification_method: loaded.verification_method,
        certifier: loaded.certifier,
        last_verified_date: loaded.last_verified_date ?? today(),
        price_level: loaded.price_level,
        notes: loaded.notes,
      })
    }
  }, [loaded, form])

  if (!loaded || !form) return detail.loading ? <Loading /> : <PageHeader title="Not found" back />

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => (f ? { ...f, [key]: value } : f))

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    try {
      await updateRestaurant(id, form)
      navigate(`/restaurant/${id}`, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <PageHeader title="Halal details" subtitle={loaded.name} back />
      <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
        Pick <strong>Unsure</strong> whenever you do not know. These are your own notes, not a certification.
      </p>

      <Card className="space-y-5">
        <StatusPicker label="Halal status" value={form.halal_status} options={halalOptions} onChange={(v) => set('halal_status', v)} />
        <Field label="Type of halal (optional)" hint="e.g. zabiha, machine-slaughtered, seafood only">
          <input value={form.halal_type_note} onChange={(e) => set('halal_type_note', e.target.value)} className={inputClass} />
        </Field>
        <StatusPicker label="Alcohol served?" value={form.alcohol_served} options={ynuOptions} onChange={(v) => set('alcohol_served', v)} />
        <StatusPicker label="Pork served?" value={form.pork_served} options={ynuOptions} onChange={(v) => set('pork_served', v)} />
      </Card>

      <Card className="space-y-5">
        <StatusPicker label="How did you verify?" value={form.verification_method} options={verifyOptions} onChange={(v) => set('verification_method', v)} />
        <Field label="Certifier (optional)">
          <input value={form.certifier} onChange={(e) => set('certifier', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Date checked">
          <input
            type="date"
            max={today()}
            value={form.last_verified_date ?? ''}
            onChange={(e) => set('last_verified_date', e.target.value || null)}
            className={inputClass}
          />
        </Field>
      </Card>

      <Card className="space-y-5">
        <StatusPicker
          label="Price level"
          value={String(form.price_level ?? 0)}
          options={[
            { value: '0', label: 'Not set' },
            ...([1, 2, 3, 4] as const).map((p) => ({ value: String(p), label: `${'$'.repeat(p)} ${PRICE_LABEL[p]}` })),
          ]}
          onChange={(v) => set('price_level', v === '0' ? null : (Number(v) as PriceLevel))}
        />
        <Field label="Notes">
          <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3} className={`${inputClass} py-2`} />
        </Field>
      </Card>

      <ErrorNote message={error} />
      <div className="flex gap-2">
        {isNew && (
          <Button variant="secondary" className="flex-1" onClick={() => navigate(`/restaurant/${id}`, { replace: true })}>
            Skip for now
          </Button>
        )}
        <Button type="submit" disabled={saving} className="flex-1">
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
