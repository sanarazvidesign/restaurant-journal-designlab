import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { getAccount, saveProfile, seedSampleData } from '../data/api'
import { useAsync } from '../hooks/useAsync'
import { Button, Field, inputClass } from '../components/ui'

const steps = [
  {
    title: 'Your halal food memory',
    body: 'Log a restaurant once, then trust it next time. For every place you can record what is halal, whether it serves alcohol or pork, what you ate, and what it cost.',
  },
  {
    title: 'Tell us a little about you',
    body: 'Optional. Your home area helps you find places near you later.',
  },
  {
    title: 'Private and honest',
    body: 'Your journal is private to your account, and we add a few sample restaurants so you can try things out (delete them any time in Profile). Halal details are your own notes with how and when you checked, never an official certification.',
  },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const account = useAsync(getAccount, [])
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [area, setArea] = useState('')
  const [error, setError] = useState<string | null>(null)
  const last = step === steps.length - 1
  const current = steps[step]

  async function next() {
    if (!last) {
      setStep(step + 1)
      return
    }
    try {
      await seedSampleData(true)
      await saveProfile({ name: name.trim(), home_area: area.trim(), onboarded: true })
      navigate('/', { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save.')
    }
  }

  if (account.loading && !account.data) return null
  if (!account.data) return <Navigate to="/login" replace />

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-between px-6 pb-8 pt-12">
      <div>
        <span className="grid size-14 place-items-center rounded-2xl bg-emerald-700 text-2xl text-white" aria-hidden>☪</span>
        <p className="mt-6 text-sm font-medium text-emerald-800">Step {step + 1} of {steps.length}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{current.title}</h1>
        <p className="mt-3 text-slate-600">{current.body}</p>

        {step === 1 && (
          <div className="mt-6 space-y-4">
            <Field label="Your name">
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoComplete="given-name" />
            </Field>
            <Field label="Home area">
              <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. Edison, NJ" className={inputClass} />
            </Field>
          </div>
        )}
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      </div>

      <div>
        <div className="mb-4 flex justify-center gap-2" aria-hidden>
          {steps.map((_, i) => (
            <span key={i} className={`h-2 rounded-full ${i === step ? 'w-6 bg-emerald-700' : 'w-2 bg-slate-300'}`} />
          ))}
        </div>
        <div className="flex gap-2">
          {step > 0 && <Button variant="secondary" onClick={() => setStep(step - 1)}>Back</Button>}
          <Button className="flex-1" onClick={next}>{last ? 'Start my journal' : 'Continue'}</Button>
        </div>
      </div>
    </div>
  )
}
