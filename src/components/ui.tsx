import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { HalalStatus, YesNoUnsure } from '../data/types'
import { HALAL_LABEL } from '../lib/format'

// ---------- Layout helpers ----------

export function PageHeader({
  title,
  subtitle,
  back = false,
  action,
}: {
  title: string
  subtitle?: string
  back?: boolean
  action?: ReactNode
}) {
  const navigate = useNavigate()
  return (
    <header className="mb-4 flex items-start gap-3">
      {back && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="-ml-2 mt-0.5 rounded-full p-2 text-slate-600 hover:bg-slate-200/60"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4 6 10l6 6" />
          </svg>
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>{children}</section>
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-2 mt-6 flex items-center justify-between">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{children}</h2>
      {action}
    </div>
  )
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
      <p className="font-semibold">{title}</p>
      {body && <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </p>
  )
}

export function Loading() {
  return <p className="py-10 text-center text-sm text-slate-500">Loading…</p>
}

// ---------- Buttons & inputs ----------

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
}

const buttonStyles = {
  primary: 'bg-emerald-700 text-white hover:bg-emerald-800 disabled:bg-emerald-300',
  secondary: 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50',
  danger: 'border border-red-200 bg-white text-red-700 hover:bg-red-50',
  ghost: 'text-emerald-800 hover:bg-emerald-50',
}

export function buttonClass(variant: keyof typeof buttonStyles = 'primary', extra = '') {
  return `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors ${buttonStyles[variant]} ${extra}`
}

export function Button({ variant = 'primary', className = '', type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} {...rest} />
}

export const inputClass =
  'block min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20'

export const selectClass = `${inputClass} select-chevron`

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  )
}

// ---------- Halal badges ----------

const halalColors: Record<HalalStatus, string> = {
  fully_halal: 'bg-emerald-100 text-emerald-800',
  partially_halal: 'bg-amber-100 text-amber-800',
  not_halal: 'bg-red-100 text-red-800',
  unsure: 'bg-slate-100 text-slate-600',
}

export function HalalBadge({ status, className = '' }: { status: HalalStatus; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${halalColors[status]} ${className}`}>
      {HALAL_LABEL[status]}
    </span>
  )
}

const flagColors = {
  good: 'bg-emerald-50 text-emerald-800',
  bad: 'bg-red-100 text-red-700',
  unknown: 'bg-slate-100 text-slate-600',
}

export function FlagPill({ kind, value }: { kind: 'alcohol' | 'pork'; value: YesNoUnsure }) {
  const noun = kind === 'alcohol' ? 'alcohol' : 'pork'
  const text = value === 'no' ? `No ${noun}` : value === 'yes' ? noun : `${noun[0].toUpperCase()}${noun.slice(1)}: unsure`
  const tone = value === 'no' ? 'good' : value === 'yes' ? 'bad' : 'unknown'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${flagColors[tone]}`}>
      {text}
    </span>
  )
}

// ---------- Pickers ----------

export function StatusPicker<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div role="radiogroup" aria-label={label}>
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const selected = o.value === value
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(o.value)}
              className={`min-h-11 rounded-xl border px-3.5 text-sm font-medium transition-colors ${
                selected
                  ? 'border-emerald-700 bg-emerald-700 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'border-emerald-700 bg-emerald-700 text-white'
          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  )
}

export function RatingStars({
  value,
  onChange,
  label = 'Rating',
}: {
  value: number | null
  onChange?: (v: number | null) => void
  label?: string
}) {
  const stars = [1, 2, 3, 4, 5]
  if (!onChange) {
    return (
      <span className="inline-flex items-center gap-0.5" aria-label={value == null ? 'Not rated' : `${value.toFixed(1)} out of 5`}>
        {stars.map((s) => (
          <span key={s} className={value != null && s <= Math.round(value) ? 'text-amber-500' : 'text-slate-300'}>
            <Star filled size={14} />
          </span>
        ))}
      </span>
    )
  }
  return (
    <div role="radiogroup" aria-label={label} className="flex items-center gap-1">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={value === s}
          aria-label={`${s} star${s > 1 ? 's' : ''}`}
          onClick={() => onChange(value === s ? null : s)}
          className="rounded-lg p-1.5 text-amber-500 hover:bg-amber-50"
        >
          <Star filled={value != null && s <= value} size={26} />
        </button>
      ))}
    </div>
  )
}

function Star({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
    </svg>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-5 accent-emerald-700"
      />
      <span className="text-sm text-slate-800">{label}</span>
    </label>
  )
}
