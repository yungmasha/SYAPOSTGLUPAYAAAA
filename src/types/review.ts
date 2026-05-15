export type ProductReview = {
  id: string
  productId: number
  userEmail: string
  rating: number
  text: string
  /** Устаревшее поле из старых отзывов с фото */
  photoBase64?: string
  createdAt: string
}
