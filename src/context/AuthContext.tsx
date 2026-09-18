import { onAuthStateChanged, type User } from 'firebase/auth'
import React, { createContext, useEffect, useState } from 'react'
import { auth } from '../services/firebase'

interface AuthContextData {
  user: User | null
  loading: boolean
}

export const AuthContext = createContext<AuthContextData>({
  user: null,
  loading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  })

  return (
    <>
      <AuthContext.Provider value={{ user, loading }}>
        {children}
      </AuthContext.Provider>
    </>
  )
}
