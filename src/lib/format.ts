import type {
  Companions,
  HalalStatus,
  PriceLevel,
  VerificationMethod,
  YesNoUnsure,
} from '../data/types'

export const HALAL_LABEL: Record<HalalStatus, string> = {
  fully_halal: 'Fully halal',
  partially_halal: 'Partially halal',
  not_halal: 'Not halal',
  unsure: 'Unsure',
}

export const YNU_LABEL: Record<YesNoUnsure, string> = {
  yes: 'Yes',
  no: 'No',
  unsure: 'Unsure',
}

export const VERIFY_LABEL: Record<VerificationMethod, string> = {
  certificate_seen: 'Certificate seen',
  asked_staff: 'Asked staff',
  owner_said: 'Owner said',
  website: 'Website',
  none: 'Not verified',
}

export const COMPANION_LABEL: Record<Companions, string> = {
  family: 'Family',
  friends: 'Friends',
  partner: 'Partner',
  solo: 'Solo',
}

export const PRICE_LABEL: Record<PriceLevel, string> = {
  1: 'Budget',
  2: 'Average',
  3: 'Upscale',
  4: 'Splurge',
}

export const CURRENCIES = ['USD', 'CAD', 'GBP', 'EUR', 'AUD'] as const

export function formatMoney(amount: number | null | undefined, currency = 'USD'): string {
  if (amount == null) return '–'
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

export function today(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '–'
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Halal info older than 6 months (or never checked) should be re-checked. */
export function isStale(iso: string | null | undefined): boolean {
  if (!iso) return true
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return true
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - 6)
  return new Date(y, m - 1, d) < cutoff
}

export function priceSymbols(level: number | null): string {
  return level ? '$'.repeat(level) : ''
}
