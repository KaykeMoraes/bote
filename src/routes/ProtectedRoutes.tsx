import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

interface ProtectedProps {
  children: ReactNode
}

export const ProtectedRoutes = ({ children }: ProtectedProps) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <p className="min-h-screen bg-gray-50 p-4 text-neutral-900 dark:bg-neutral-950 dark:text-gray-100">
        Carregando...
      </p>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
