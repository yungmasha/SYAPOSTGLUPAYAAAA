import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import type { Tire } from '../types/tire'

type CompareAddResult = { ok: boolean; message: string }

type CompareContextValue = {
  compareItems: Tire[]
  isInCompare: (productId: number) => boolean
  addToCompare: (product: Tire) => CompareAddResult
  removeFromCompare: (productId: number) => void
  clearCompare: () => void
  canCompare: boolean
}

const CompareContext = createContext<CompareContextValue | null>(null)
const COMPARE_STORAGE_KEY = 'tire-shop-compare'
const MAX_COMPARE_ITEMS = 3

function readCompareFromStorage(): Tire[] {
  try {
    const raw = localStorage.getItem(COMPARE_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as Tire[]) : []
  } catch {
    return []
  }
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareItems, setCompareItems] = useState<Tire[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setCompareItems(readCompareFromStorage())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareItems))
    } catch {
      /* ignore */
    }
  }, [compareItems, hydrated])

  const isInCompare = useCallback(
    (productId: number) => compareItems.some((item) => item.id === productId),
    [compareItems],
  )

  const addToCompare = useCallback((product: Tire) => {
    let response: CompareAddResult = {
      ok: true,
      message: 'Товар добавлен к сравнению.',
    }
    setCompareItems((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        response = { ok: false, message: 'Товар уже в сравнении.' }
        return prev
      }
      if (prev.length >= MAX_COMPARE_ITEMS) {
        response = {
          ok: false,
          message: 'Можно сравнить максимум 3 товара.',
        }
        return prev
      }
      return [...prev, product]
    })
    return response
  }, [])

  const removeFromCompare = useCallback((productId: number) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== productId))
  }, [])

  const clearCompare = useCallback(() => {
    setCompareItems([])
  }, [])

  const value = useMemo(
    () => ({
      compareItems,
      isInCompare,
      addToCompare,
      removeFromCompare,
      clearCompare,
      canCompare: compareItems.length >= 2,
    }),
    [
      compareItems,
      isInCompare,
      addToCompare,
      removeFromCompare,
      clearCompare,
    ],
  )

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) {
    throw new Error('useCompare must be used within CompareProvider')
  }
  return ctx
}
