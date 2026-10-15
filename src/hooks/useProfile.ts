import { createContext, useContext } from 'react'
import type { Account } from '../data/api'
import type { UserProfile } from '../data/types'

export interface ProfileContextValue {
  profile: UserProfile
  account: Account
  refresh: () => void
}

export const ProfileContext = createContext<ProfileContextValue | null>(null)

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used inside the app shell')
  return ctx
}
