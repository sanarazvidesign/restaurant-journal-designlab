import type { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { ProfileContext } from '../hooks/useProfile'
import { useAsync } from '../hooks/useAsync'
import { getAccount, getProfile } from '../data/api'
import { Navigate } from 'react-router-dom'
import { Loading } from './ui'

const icons = {
  places: (
    <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a1 1 0 0 1-1.5.9L12 17l-6.5 2.9A1 1 0 0 1 4 19z" />
  ),
  add: <path d="M12 5v14M5 12h14" />,
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" />
    </>
  ),
}

function Icon({ name }: { name: keyof typeof icons }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {icons[name]}
    </svg>
  )
}

function navClass(isActive: boolean) {
  return `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
    isActive ? 'bg-emerald-100 text-emerald-900' : 'text-slate-600 hover:bg-slate-100'
  }`
}

async function loadSession() {
  const account = await getAccount()
  if (!account) return { account: null, profile: null } as const
  return { account, profile: await getProfile() } as const
}

/** Gate: sends signed-out users to login, first-time users to onboarding, then provides the profile to all pages. */
export function AppShell(): ReactNode {
  const { data, error, loading, reload } = useAsync(loadSession, [])
  if (error) return <p role="alert" className="p-6 text-sm text-red-700">{error}</p>
  if (loading && !data) return <Loading />
  if (!data) return <Loading />
  if (!data.account) return <Navigate to="/login" replace />
  if (!data.profile.onboarded) return <Navigate to="/onboarding" replace />
  const { account, profile } = data

  return (
    <ProfileContext.Provider value={{ profile, account, refresh: reload }}>
      <div className="min-h-dvh md:flex">
        {/* Sidebar (tablet / desktop) */}
        <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white p-4 md:block">
          <div className="sticky top-4">
            <div className="mb-6 flex items-center gap-2 px-2">
              <span className="grid size-9 place-items-center rounded-xl bg-emerald-700 font-bold text-white" aria-hidden>
                ☪
              </span>
              <span className="font-bold leading-tight">Halal Restaurant<br />Journal</span>
            </div>
            <nav className="space-y-1" aria-label="Main">
              <NavLink to="/" end className={({ isActive }) => navClass(isActive)}>
                <Icon name="places" /> My Places
              </NavLink>
              <NavLink to="/add" className={({ isActive }) => navClass(isActive)}>
                <Icon name="add" /> Add restaurant
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => navClass(isActive)}>
                <Icon name="profile" /> Profile
              </NavLink>
            </nav>
          </div>
        </aside>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-5 md:px-8 md:pb-10 md:pt-8">
          <Outlet />
        </main>

        {/* Bottom tab bar (phone) */}
        <nav
          aria-label="Main"
          className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 items-end border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        >
          <NavLink to="/" end className={({ isActive }) => tabClass(isActive)}>
            <Icon name="places" />
            <span>My Places</span>
          </NavLink>
          <NavLink to="/add" aria-label="Add restaurant" className="flex flex-col items-center pb-2 text-xs font-medium text-emerald-800">
            <span className="-mt-5 grid size-14 place-items-center rounded-full bg-emerald-700 text-white shadow-lg ring-4 ring-white">
              <Icon name="add" />
            </span>
            <span className="mt-1">Add</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => tabClass(isActive)}>
            <Icon name="profile" />
            <span>Profile</span>
          </NavLink>
        </nav>
      </div>
    </ProfileContext.Provider>
  )
}

function tabClass(isActive: boolean) {
  return `flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${isActive ? 'text-emerald-800' : 'text-slate-500'}`
}
