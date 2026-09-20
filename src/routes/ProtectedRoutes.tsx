import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

interface ProtectedProps {
  children: ReactNode
}

export const ProtectedRoutes = ({ children }: ProtectedProps) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <p>Carregando...</p>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
