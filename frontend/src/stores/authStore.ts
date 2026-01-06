import { create } from 'zustand'

interface AuthStore {
  token: string | null
  user: { id: string; email: string; role: 'cliente' | 'operador' } | null
  isAuthenticated: boolean
  login: (token: string, user: any) => void
  logout: () => void
  setUser: (user: any) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: (token: string, user: any) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ token, user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ token: null, user: null, isAuthenticated: false })
  },

  setUser: (user: any) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },
}))
