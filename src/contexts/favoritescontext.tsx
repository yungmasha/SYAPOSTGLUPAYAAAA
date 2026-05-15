import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type FavoritesContextValue = {
  favorites: number[]
  addToFavorites: (productId: number | string) => void
  removeFromFavorites: (productId: number | string) => void
  isFavorite: (productId: number | string) => boolean
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

const STORAGE_KEY = 'tire-shop-favorites'

function readFavoritesFromStorage(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id))
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setFavorites(readFavoritesFromStorage())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      /* ignore quota / private mode */
    }
  }, [favorites, hydrated])

  const addToFavorites = useCallback((productId: number | string) => {
    const id = Number(productId)
    if (!Number.isFinite(id)) return
    setFavorites((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const removeFromFavorites = useCallback((productId: number | string) => {
    const id = Number(productId)
    if (!Number.isFinite(id)) return
    setFavorites((prev) => prev.filter((x) => x !== id))
  }, [])

  const isFavorite = useCallback(
    (productId: number | string) => {
      const id = Number(productId)
      if (!Number.isFinite(id)) return false
      return favorites.includes(id)
    },
    [favorites],
  )

  const value = useMemo(
    () => ({
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
    }),
    [favorites, addToFavorites, removeFromFavorites, isFavorite],
  )

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }
  return ctx
}
