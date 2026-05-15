export type Tire = {
  id: number
  name: string
  brand: string
  size: string
  rim: string
  season: string
  price: number
  image: string
  description: string
  /** Опционально: остаток на складе в карточках */
  quantity?: number
  stock?: number
}
