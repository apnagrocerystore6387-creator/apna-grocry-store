import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AdminRoute() {
  const { user } = useAuth()
  const isAdmin = user?.roleId === 1

  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />
}
