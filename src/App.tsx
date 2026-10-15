import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { isConfigured } from './data/api'
import Login from './pages/Login'
import AddRestaurant from './pages/AddRestaurant'
import DishForm from './pages/DishForm'
import HalalDetails from './pages/HalalDetails'
import LogVisit from './pages/LogVisit'
import MyPlaces from './pages/MyPlaces'
import Onboarding from './pages/Onboarding'
import Profile from './pages/Profile'
import RestaurantDetail from './pages/RestaurantDetail'
import ShareCard from './pages/ShareCard'

export default function App() {
  if (!isConfigured) {
    return (
      <div className="mx-auto max-w-md p-6">
        <h1 className="text-xl font-bold">Supabase is not configured</h1>
        <p className="mt-2 text-sm text-slate-600">
          Copy <code>.env.example</code> to <code>.env.local</code>, fill in <code>VITE_SUPABASE_URL</code> and{' '}
          <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>, then restart the dev server.
        </p>
      </div>
    )
  }
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route element={<AppShell />}>
        <Route index element={<MyPlaces />} />
        <Route path="add" element={<AddRestaurant />} />
        <Route path="profile" element={<Profile />} />
        <Route path="restaurant/:id" element={<RestaurantDetail />} />
        <Route path="restaurant/:id/halal" element={<HalalDetails />} />
        <Route path="restaurant/:id/visit/new" element={<LogVisit />} />
        <Route path="restaurant/:id/dish/new" element={<DishForm />} />
        <Route path="restaurant/:id/dish/:dishId" element={<DishForm />} />
        <Route path="restaurant/:id/share" element={<ShareCard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
