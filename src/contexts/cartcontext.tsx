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

export type CartItem = {
  product: Tire
  quantity: number
}

export type CartPricing = {
  subtotal: number
  totalQuantity: number
  bundleDiscount: number
  promoDiscount: number
  deliveryFinal: number
  totalDiscount: number
  totalToPay: number
  isDiscountCapped: boolean
}

export type CartPricingOptions = {
  promoDiscountRate?: number
}

const STORAGE_KEY = 'tire-shop-cart'
const BOOKING_STORAGE_KEY = 'bookings'
export const DEFAULT_DELIVERY_COST = 25
const SET_DISCOUNT_RATE = 0.05

/** Суммы заказа по составу корзины (скидка за комплект, промокод, лимит скидок 30%). */
export function computeCartPricing(
  cartItems: CartItem[],
  options?: CartPricingOptions,
): CartPricing {
  const subtotal = cartItems.reduce((sum, { product, quantity }) => {
    return sum + product.price * quantity
  }, 0)
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const bundleDiscountRaw = cartItems.reduce((sum, { product, quantity }) => {
    if (quantity < 4) return sum
    return sum + product.price * quantity * SET_DISCOUNT_RATE
  }, 0)

  const promoRate = options?.promoDiscountRate ?? 0
  const baseAfterBundle = Math.max(0, subtotal - bundleDiscountRaw)
  const promoDiscountRaw =
    promoRate > 0 ? baseAfterBundle * promoRate : 0

  const rawSubtotalDiscount = bundleDiscountRaw + promoDiscountRaw
  const discountCap = subtotal * 0.3
  const cappedSubtotalDiscount = Math.min(rawSubtotalDiscount, discountCap)
  const scaleFactor =
    rawSubtotalDiscount > 0 ? cappedSubtotalDiscount / rawSubtotalDiscount : 0

  const bundleDiscount = bundleDiscountRaw * scaleFactor
  const promoDiscount = promoDiscountRaw * scaleFactor
  const deliveryFinal = DEFAULT_DELIVERY_COST
  const totalDiscount = bundleDiscount + promoDiscount
  const totalToPay = Math.max(0, subtotal - totalDiscount + deliveryFinal)

  return {
    subtotal,
    totalQuantity,
    bundleDiscount,
    promoDiscount,
    deliveryFinal,
    totalDiscount,
    totalToPay,
    isDiscountCapped: rawSubtotalDiscount > discountCap,
  }
}

type CartContextValue = {
  cartItems: CartItem[]
  addToCart: (product: Tire) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number | string) => void
  clearCart: () => void
  pricing: CartPricing
  getItemPricing: (
    product: Tire,
    quantity: number,
  ) => {
    baseTotal: number
    setDiscount: number
    totalAfterSetDiscount: number
    hasSetDiscount: boolean
  }
}

const CartContext = createContext<CartContextValue | null>(null)

function readCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setCartItems(readCartFromStorage())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
    } catch {
      /* ignore quota / private mode */
    }
  }, [cartItems, hydrated])

  const addToCart = useCallback((product: Tire) => {
    try {
      const rawBookings = localStorage.getItem(BOOKING_STORAGE_KEY)
      if (rawBookings) {
        const parsed = JSON.parse(rawBookings) as unknown
        if (Array.isArray(parsed)) {
          const nextBookings = (
            parsed as { productId?: number }[]
          ).filter((item) => item.productId !== product.id)
          localStorage.setItem(
            BOOKING_STORAGE_KEY,
            JSON.stringify(nextBookings),
          )
        }
      }
    } catch {
      /* ignore storage parsing errors */
    }

    setCartItems((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id)
      if (idx === -1) {
        return [...prev, { product, quantity: 1 }]
      }
      return prev.map((item, i) =>
        i === idx ? { ...item, quantity: item.quantity + 1 } : item,
      )
    })
  }, [])

  const removeFromCart = useCallback((productId: number) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId),
    )
  }, [])

  const updateQuantity = useCallback((productId: number, quantity: number | string) => {
    const next = Math.floor(Number(quantity))
    if (!Number.isFinite(next) || next < 1) {
      setCartItems((prev) =>
        prev.filter((item) => item.product.id !== productId),
      )
      return
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: next } : item,
      ),
    )
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const pricing = useMemo(
    () => computeCartPricing(cartItems),
    [cartItems],
  )

  const getItemPricing = useCallback((product: Tire, quantity: number) => {
    const baseTotal = product.price * quantity
    const setDiscount = quantity >= 4 ? baseTotal * SET_DISCOUNT_RATE : 0
    return {
      baseTotal,
      setDiscount,
      totalAfterSetDiscount: baseTotal - setDiscount,
      hasSetDiscount: quantity >= 4,
    }
  }, [])

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      pricing,
      getItemPricing,
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      pricing,
      getItemPricing,
    ],
  )

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}
