import { createContext, useState, useEffect } from 'react'
import {
  login as loginRequest,
  register as registerRequest,
  fetchProfile
} from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('ags_token') || '')
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(!!token)

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setInitializing(false)
        return
      }

      const response = await fetchProfile()
      if (response?.user) {
        setUser(response.user)
        localStorage.setItem('ags_user', JSON.stringify(response.user))
      } else {
        logout()
      }
      setInitializing(false)
    }

    loadUser()
  }, [token])

  const login = async (credentials) => {
    setLoading(true)
    const response = await loginRequest(credentials)
    setLoading(false)

    if (response?.token) {
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem('ags_token', response.token)
      localStorage.setItem('ags_user', JSON.stringify(response.user))
    }

    return response
  }

  const register = async (credentials) => {
    setLoading(true)
    const response = await registerRequest(credentials)
    setLoading(false)

    if (response?.token) {
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem('ags_token', response.token)
      localStorage.setItem('ags_user', JSON.stringify(response.user))
    }

    return response
  }

  const logout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('ags_token')
    localStorage.removeItem('ags_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, initializing, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}
