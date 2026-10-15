import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAllData, exportAll, resetSampleData, saveProfile, signOut } from '../data/api'
import { useProfile } from '../hooks/useProfile'
import { Button, Card, ErrorNote, Field, inputClass, PageHeader, SectionTitle, selectClass } from '../components/ui'
import { CURRENCIES } from '../lib/format'

export default function Profile() {
  const { profile, account, refresh } = useProfile()
  const navigate = useNavigate()
  const [name, setName] = useState(profile.name)
  const [area, setArea] = useState(profile.home_area)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setName(profile.name)
    setArea(profile.home_area)
  }, [profile])

  async function run(action: () => Promise<void>, done: string) {
    setError(null)
    setMessage(null)
    try {
      await action()
      refresh()
      setMessage(done)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    }
  }

  async function download() {
    const blob = new Blob([await exportAll()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'halal-journal-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader title="Profile" subtitle="Your settings and data" />
      <ErrorNote message={error} />
      {message && <p role="status" className="mb-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{message}</p>}

      <Card className="space-y-4">
        <Field label="Name">
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Home area">
          <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. Edison, NJ" className={inputClass} />
        </Field>
        <Field label="Currency">
          <select
            value={profile.currency}
            onChange={(e) => run(() => saveProfile({ currency: e.target.value }).then(() => undefined), 'Currency updated.')}
            className={selectClass}
          >
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Button onClick={() => run(() => saveProfile({ name: name.trim(), home_area: area.trim() }).then(() => undefined), 'Profile saved.')}>
          Save profile
        </Button>
      </Card>

      <SectionTitle>Account</SectionTitle>
      <Card className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">Signed in as</p>
          <p className="truncate font-medium">{account.email}</p>
        </div>
        <Button
          variant="secondary"
          onClick={async () => {
            try {
              await signOut()
              navigate('/login', { replace: true })
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Could not sign out.')
            }
          }}
        >
          Sign out
        </Button>
      </Card>

      <SectionTitle>Your data</SectionTitle>
      <Card className="space-y-3">
        <p className="text-sm text-slate-600">
          Your journal is saved to your account and private to you. Export a copy any time.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={download}>Export data (JSON)</Button>
          <Button
            variant="secondary"
            onClick={() => {
              if (window.confirm('Replace your journal with the sample restaurants? Your own entries will be removed.')) {
                void run(resetSampleData, 'Sample data restored.')
              }
            }}
          >
            Reset to sample data
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (window.confirm('Delete every restaurant, visit and dish? This cannot be undone.')) {
                void run(clearAllData, 'All journal data deleted.')
              }
            }}
          >
            Delete all data
          </Button>
        </div>
      </Card>

      <SectionTitle>Privacy and trust</SectionTitle>
      <Card>
        <p className="text-sm text-slate-600">
          Halal details are your own notes, with who said it, how, and when. They are not an official certification.
          Shared cards say so and include the date you last checked.
        </p>
      </Card>
    </div>
  )
}
