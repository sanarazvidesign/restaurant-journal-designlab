import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

export const isConfigured = Boolean(url && key)

// Placeholders keep the app from crashing at import time when env vars are
// missing; App.tsx shows a setup message instead.
export const supabase = createClient(url ?? 'http://localhost:54321', key ?? 'missing-key')
