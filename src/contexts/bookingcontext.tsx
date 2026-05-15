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

export type BookingRecord = {
  productId: number
  productName: string
  bookedAt: number
  expiresAt: number
  fullName: string
  phone: string
}

type BookingCustomer = {
  fullName: string
  phone: string
}

type BookingContextValue = {
  bookings: BookingRecord[]
  addBooking: (product: Tire, customer: BookingCustomer) => void
  removeBooking: (productId: number) => void
  isBooked: (productId: number) => boolean
}

const BookingContext = createContext<BookingContextValue | null>(null)

const BOOKING_STORAGE_KEY = 'bookings'
const BOOKING_DAYS = 3

function readBookingsFromStorage(): BookingRecord[] {
  try {
    const raw = localStorage.getItem(BOOKING_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as BookingRecord[]) : []
  } catch {
    return []
  }
}

function filterActiveBookings(items: BookingRecord[]) {
  const now = Date.now()
  return items.filter((item) => Number(item.expiresAt) > now)
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<BookingRecord[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setBookings(filterActiveBookings(readBookingsFromStorage()))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings))
    } catch {
      /* ignore */
    }
  }, [bookings, hydrated])

  const addBooking = useCallback((product: Tire, customer: BookingCustomer) => {
    const now = Date.now()
    const expiresAt = now + BOOKING_DAYS * 24 * 60 * 60 * 1000
    setBookings((prev) => {
      const active = filterActiveBookings(prev).filter(
        (item) => item.productId !== product.id,
      )
      return [
        ...active,
        {
          productId: product.id,
          productName: `${product.brand} ${product.name}`,
          bookedAt: now,
          expiresAt,
          fullName: customer.fullName.trim(),
          phone: customer.phone.trim(),
        },
      ]
    })
  }, [])

  const removeBooking = useCallback((productId: number) => {
    setBookings((prev) => prev.filter((item) => item.productId !== productId))
  }, [])

  const isBooked = useCallback(
    (productId: number) => bookings.some((item) => item.productId === productId),
    [bookings],
  )

  const value = useMemo(
    () => ({ bookings, addBooking, removeBooking, isBooked }),
    [bookings, addBooking, removeBooking, isBooked],
  )

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) {
    throw new Error('useBooking must be used within BookingProvider')
  }
  return ctx
}
