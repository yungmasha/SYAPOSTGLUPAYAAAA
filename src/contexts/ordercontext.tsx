import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import type { NewOrderInput, OrderRecord } from '../types/order'
import { normalizeEmail as normalizeOrderEmail } from '../utils/email'

type OrderContextValue = {
  orders: OrderRecord[]
  isOrdersReady: boolean
  addOrder: (input: NewOrderInput) => OrderRecord
  getOrdersByEmail: (email: string) => OrderRecord[]
}

const ORDERS_STORAGE_KEY = 'tire-shop-orders'

function normalizeOrder(raw: unknown): OrderRecord | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Partial<OrderRecord>
  if (typeof o.id !== 'string' || typeof o.userEmail !== 'string') return null
  if (!Array.isArray(o.items) || o.items.length === 0) return null

  const items = o.items
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const row = item as Record<string, unknown>
      const productId = Number(row.productId)
      if (!Number.isFinite(productId)) return null
      const title =
        typeof row.title === 'string'
          ? row.title
          : typeof row.name === 'string'
            ? row.name
            : 'Товар'
      const quantity = Number(row.quantity) > 0 ? Number(row.quantity) : 1
      const unitPrice = Number(row.unitPrice) || 0
      const lineTotal =
        Number(row.lineTotal) > 0 ? Number(row.lineTotal) : unitPrice * quantity
      return { productId, title, quantity, unitPrice, lineTotal }
    })
    .filter((item): item is OrderRecord['items'][number] => item !== null)

  if (items.length === 0) return null

  const pricingRaw = o.pricing as Partial<OrderRecord['pricing']> | undefined
  const pricing = {
    subtotal: Number(pricingRaw?.subtotal) || 0,
    deliveryFinal: Number(pricingRaw?.deliveryFinal) || 0,
    bundleDiscount: Number(pricingRaw?.bundleDiscount) || 0,
    promoDiscount: Number(pricingRaw?.promoDiscount) || 0,
    totalToPay: Number(pricingRaw?.totalToPay) || 0,
  }

  const customerRaw = o.customer as Partial<OrderRecord['customer']> | undefined

  return {
    id: o.id,
    userEmail: normalizeOrderEmail(o.userEmail),
    createdAt: Number(o.createdAt) || Date.now(),
    status: 'completed',
    customer: {
      fullName: String(customerRaw?.fullName ?? ''),
      phone: String(customerRaw?.phone ?? ''),
      email: normalizeOrderEmail(String(customerRaw?.email ?? o.userEmail)),
      address: String(customerRaw?.address ?? ''),
      payment: String(customerRaw?.payment ?? ''),
      comment: String(customerRaw?.comment ?? ''),
    },
    appliedPromo:
      typeof o.appliedPromo === 'string' && o.appliedPromo.trim()
        ? o.appliedPromo.trim().toUpperCase()
        : null,
    items,
    pricing,
  }
}

function readOrdersFromStorage(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((item) => normalizeOrder(item))
      .filter((item): item is OrderRecord => item !== null)
  } catch {
    return []
  }
}

function createOrderId() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const date = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
  const time = `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  return `MH-${date}-${time}`
}

function persistOrders(orders: OrderRecord[]) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
  } catch {
    /* ignore */
  }
}

const OrderContext = createContext<OrderContextValue | null>(null)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [isOrdersReady, setIsOrdersReady] = useState(false)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    setOrders(readOrdersFromStorage())
    hasLoadedRef.current = true
    setIsOrdersReady(true)
  }, [])

  useEffect(() => {
    if (!hasLoadedRef.current) return
    persistOrders(orders)
  }, [orders])

  const addOrder = useCallback((input: NewOrderInput) => {
    const record: OrderRecord = {
      ...input,
      id: createOrderId(),
      createdAt: Date.now(),
      status: 'completed',
      userEmail: normalizeOrderEmail(input.userEmail),
      customer: {
        ...input.customer,
        email: normalizeOrderEmail(input.customer.email || input.userEmail),
      },
    }
    setOrders((prev) => {
      const next = [record, ...prev]
      persistOrders(next)
      return next
    })
    return record
  }, [])

  const getOrdersByEmail = useCallback(
    (email: string) => {
      const key = normalizeOrderEmail(email)
      if (!key) return []
      return orders
        .filter((order) => order.userEmail === key)
        .sort((a, b) => b.createdAt - a.createdAt)
    },
    [orders],
  )

  const value = useMemo(
    () => ({ orders, isOrdersReady, addOrder, getOrdersByEmail }),
    [orders, isOrdersReady, addOrder, getOrdersByEmail],
  )

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  )
}

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) {
    throw new Error('useOrders must be used within OrderProvider')
  }
  return ctx
}
