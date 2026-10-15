import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn, signUp } from '../data/api'
import { Button, ErrorNote, Field, inputClass } from '../components/ui'

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)
    if (mode === 'signup' && password.length < 8) {
      setError('Use a password with at least 8 characters.')
      return
    }
    setBusy(true)
    try {
      if (mode === 'signin') {
        await signIn(email.trim(), password)
        navigate('/', { replace: true })
      } else {
        const { needsConfirmation } = await signUp(email.trim(), password)
        if (needsConfirmation) {
          setNotice('Account created. Check your email for a confirmation link, then sign in here.')
          setMode('signin')
          setPassword('')
        } else {
          navigate('/', { replace: true })
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-10">
      <span className="grid size-14 place-items-center rounded-2xl bg-emerald-700 text-2xl text-white" aria-hidden>☪</span>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">Halal Restaurant Journal</h1>
      <p className="mt-2 text-slate-600">
        {mode === 'signin' ? 'Sign in to open your journal.' : 'Create an account to keep your journal safe and synced.'}
      </p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Field label="Email">
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Password" hint={mode === 'signup' ? 'At least 8 characters.' : undefined}>
          <input
            type="password"
            required
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </Field>
        <ErrorNote message={error} />
        {notice && <p role="status" className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{notice}</p>}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </Button>
      </form>

      <button
        type="button"
        onClick={() => {
          setMode(mode === 'signin' ? 'signup' : 'signin')
          setError(null)
          setNotice(null)
        }}
        className="mt-4 text-center text-sm font-medium text-emerald-800"
      >
        {mode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in'}
      </button>
    </div>
  )
}
