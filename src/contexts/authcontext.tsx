import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { normalizeEmail } from '../utils/email'
import {
  createPromoForEmail,
  getPromoForEmail,
} from '../utils/promo'

export type AuthUser = {
  email: string
  fullName: string
  phone: string
  address: string
  promoCode: string
}

type ProfileUpdate = Partial<Pick<AuthUser, 'fullName' | 'phone' | 'address'>>

type AuthContextValue = {
  user: AuthUser | null
  /** false до чтения сессии из localStorage */
  isAuthReady: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (email: string, password: string) => Promise<void>
  updateProfile: (data: ProfileUpdate) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'tire-shop-auth-user'

function normalizeUser(raw: unknown): AuthUser | null {
  if (!raw || typeof raw !== 'object' || !('email' in raw)) return null
  const email = normalizeEmail(String((raw as { email: unknown }).email ?? ''))
  if (!email) return null
  const fullName =
    'fullName' in raw && typeof (raw as { fullName: unknown }).fullName === 'string'
      ? (raw as { fullName: string }).fullName.trim()
      : ''
  const phone =
    'phone' in raw && typeof (raw as { phone: unknown }).phone === 'string'
      ? (raw as { phone: string }).phone.trim()
      : ''
  const address =
    'address' in raw && typeof (raw as { address: unknown }).address === 'string'
      ? (raw as { address: string }).address.trim()
      : ''
  const storedPromo =
    'promoCode' in raw && typeof (raw as { promoCode: unknown }).promoCode === 'string'
      ? (raw as { promoCode: string }).promoCode.trim().toUpperCase()
      : ''
  const promoCode = storedPromo || getPromoForEmail(email) || ''
  return { email, fullName, phone, address, promoCode }
}

function readUserFromStorage(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return normalizeUser(JSON.parse(raw) as unknown)
  } catch {
    return null
  }
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = readUserFromStorage()
    if (stored && !stored.promoCode) {
      const promoCode =
        getPromoForEmail(stored.email) || createPromoForEmail(stored.email)
      setUser({ ...stored, promoCode })
    } else {
      setUser(stored)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      /* ignore */
    }
  }, [user, hydrated])

  const login = useCallback(async (email: string, password: string) => {
    await delay(450)
    const e = normalizeEmail(String(email ?? ''))
    const p = String(password ?? '').trim()
    if (!e || !p) {
      throw new Error('Укажите email и пароль')
    }
    const existing = readUserFromStorage()
    const sameAccount =
      existing && normalizeEmail(existing.email) === e
    const promoCode =
      getPromoForEmail(e) ??
      ((sameAccount ? existing.promoCode : '') || createPromoForEmail(e))

    if (sameAccount && existing) {
      setUser({ ...existing, email: e, promoCode })
    } else {
      setUser({ email: e, fullName: '', phone: '', address: '', promoCode })
    }
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    await delay(450)
    const e = normalizeEmail(String(email ?? ''))
    const p = String(password ?? '').trim()
    if (!e || !p) {
      throw new Error('Укажите email и пароль')
    }
    const promoCode = createPromoForEmail(e)
    setUser({ email: e, fullName: '', phone: '', address: '', promoCode })
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const updateProfile = useCallback((data: ProfileUpdate) => {
    setUser((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        ...data,
        fullName:
          data.fullName !== undefined ? data.fullName.trim() : prev.fullName,
        phone: data.phone !== undefined ? data.phone.trim() : prev.phone,
        address:
          data.address !== undefined ? data.address.trim() : prev.address,
      }
    })
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthReady: hydrated,
      login,
      logout,
      register,
      updateProfile,
    }),
    [user, hydrated, login, logout, register, updateProfile],
  )

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
