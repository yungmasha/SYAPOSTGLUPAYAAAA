export type OrderItemSnapshot = {
  productId: number
  title: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export type OrderPricingSnapshot = {
  subtotal: number
  deliveryFinal: number
  bundleDiscount: number
  promoDiscount: number
  totalToPay: number
}

export type OrderStatus = 'completed'

export type OrderRecord = {
  id: string
  userEmail: string
  createdAt: number
  status: OrderStatus
  customer: {
    fullName: string
    phone: string
    email: string
    address: string
    payment: string
    comment: string
  }
  appliedPromo: string | null
  items: OrderItemSnapshot[]
  pricing: OrderPricingSnapshot
}

export type NewOrderInput = Omit<OrderRecord, 'id' | 'createdAt' | 'status'>
