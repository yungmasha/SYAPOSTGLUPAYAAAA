import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { tires } from '../data/tires'
import { formatByn } from '../utils/currency'
import { useAuth } from '../contexts/authcontext'
import {
  computeCartPricing,
  useCart,
  type CartItem,
} from '../contexts/cartcontext'
import { useBooking } from '../contexts/bookingcontext'
import { useFavorites } from '../contexts/favoritescontext'
import Breadcrumbs from '../components/Breadcrumbs'
import ProductCard from '../components/productcard'
import { useToast } from '../contexts/toastcontext'
import { usePageTitle } from '../hooks/usePageTitle'
import type { ProductReview } from '../types/review'
import './productdetail.css'

function getRim(size: string) {
  const match = String(size).match(/R\d+/i)
  return match ? match[0].toUpperCase() : ''
}

function pickRandomItems<T>(list: T[], count: number): T[] {
  const next = [...list]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next.slice(0, count)
}

function readReviews(productId: number): ProductReview[] {
  try {
    const raw = localStorage.getItem(`reviews-${productId}`)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as ProductReview[]) : []
  } catch {
    return []
  }
}

function writeReviews(productId: number, reviews: ProductReview[]) {
  try {
    localStorage.setItem(`reviews-${productId}`, JSON.stringify(reviews))
  } catch {
    /* ignore storage errors */
  }
}

export default function ProductDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const numericId = Number(id)
  const product = tires.find((t) => t.id === numericId)
  const { user } = useAuth()
  const [reviews, setReviews] = useState<ProductReview[]>([])
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')

  const { addToCart } = useCart()
  const { removeBooking } = useBooking()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { showToast } = useToast()
  const inFavorites = product ? isFavorite(product.id) : false
  const FavIcon = inFavorites ? FaHeart : FaRegHeart

  const fullTitle = product ? `${product.brand} ${product.name}` : ''
  usePageTitle(fullTitle || 'Товар', fullTitle ? `Купить ${fullTitle} в MotoHunters, Минск.` : undefined)

  const frequentTogether = useMemo(() => {
    if (!product) return []
    const currentRim = getRim(product.size)
    const candidates = tires.filter((t) => {
      if (t.id === product.id) return false
      return getRim(t.size) === currentRim || t.season === product.season
    })
    return pickRandomItems(candidates, 3)
  }, [product])

  const cheaperAlternatives = useMemo(() => {
    if (!product) return []
    const maxPrice = product.price * 0.9
    return tires
      .filter((t) => {
        if (t.id === product.id) return false
        const sameBrandOrSize = t.brand === product.brand || t.size === product.size
        return sameBrandOrSize && t.price <= maxPrice
      })
      .sort((a, b) => a.price - b.price)
      .slice(0, 3)
  }, [product])

  useEffect(() => {
    if (!product) return
    const next = readReviews(product.id).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    setReviews(next)
  }, [product])

  if (!product) {
    return (
      <section className="page">
        <h1>Товар не найден</h1>
        <p>
          <Link to="/catalog">Вернуться в каталог</Link>
        </p>
      </section>
    )
  }

  const handleReviewSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) {
      showToast('Войдите, чтобы оставить отзыв', 'error')
      return
    }
    if (!reviewText.trim()) {
      showToast('Добавьте текст отзыва', 'error')
      return
    }

    const nextReview: ProductReview = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      productId: product.id,
      userEmail: user.email,
      rating: Number(rating),
      text: reviewText.trim(),
      createdAt: new Date().toISOString(),
    }

    const nextReviews = [nextReview, ...reviews].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    setReviews(nextReviews)
    writeReviews(product.id, nextReviews)
    setReviewText('')
    setRating(5)
    showToast('Отзыв добавлен')
  }

  const handleDeleteReview = (reviewId: string) => {
    const nextReviews = reviews.filter((item) => item.id !== reviewId)
    setReviews(nextReviews)
    writeReviews(product.id, nextReviews)
  }

  return (
    <section className="page page--detail product-detail">
      <Breadcrumbs
        items={[
          { label: 'Главная', to: '/' },
          { label: 'Каталог', to: '/catalog' },
          { label: fullTitle },
        ]}
      />

      <div className="product-detail__grid">
        <div className="product-detail__main-info">
          <figure className="product-detail__media">
            <img
              src={product.image}
              alt={fullTitle}
              width={420}
              height={420}
              loading="eager"
            />
          </figure>

          <div>
            <h1 className="product-detail__title">{product.name}</h1>
            <p className="product-detail__brand">
              Бренд: <strong>{product.brand}</strong>
            </p>

            <dl className="product-detail__specs">
              <div>
                <dt>Размер</dt>
                <dd>{product.size}</dd>
              </div>
              <div>
                <dt>Сезон</dt>
                <dd>{product.season}</dd>
              </div>
            </dl>

            <p className="product-detail__desc">{product.description}</p>
          </div>
        </div>

        <aside className="product-detail__purchase">
          <p className="product-detail__price">{formatByn(product.price)}</p>

          <div className="product-detail__actions">
            <button
              type="button"
              className="product-detail__cart-btn"
              onClick={() => {
                addToCart(product)
                removeBooking(product.id)
                showToast('Товар добавлен в корзину')
              }}
            >
              В корзину
            </button>
            <button
              type="button"
              className="product-detail__set-btn"
              onClick={() => {
                removeBooking(product.id)
                const bundleLine: CartItem[] = [{ product, quantity: 4 }]
                const orderPricing = computeCartPricing(bundleLine)
                navigate('/checkout', {
                  state: {
                    cartItems: bundleLine,
                    totalPrice: orderPricing.totalToPay,
                  },
                })
              }}
            >
              Купить комплект (4 шины)
            </button>
            <button
              type="button"
              className={`product-detail__fav-btn${inFavorites ? ' product-detail__fav-btn--active' : ''}`}
              onClick={() => {
                if (inFavorites) {
                  removeFromFavorites(product.id)
                  showToast('Убрано из избранного', 'info')
                } else {
                  addToFavorites(product.id)
                  showToast('Добавлено в избранное')
                }
              }}
              aria-pressed={inFavorites}
              aria-label={
                inFavorites ? 'Убрать из избранного' : 'Добавить в избранное'
              }
            >
              <FavIcon className="product-detail__fav-icon" size={20} aria-hidden />
              {inFavorites ? 'В избранном' : 'В избранное'}
            </button>
          </div>
        </aside>
      </div>

      {(frequentTogether.length > 0 || cheaperAlternatives.length > 0) && (
        <section className="product-detail__related" aria-label="Рекомендации">
          {frequentTogether.length > 0 && (
            <section
              className="product-detail__similar product-detail__similar--col"
              aria-labelledby="frequent-heading"
            >
              <h2 id="frequent-heading">С этим товаром часто покупают</h2>
              <div className="product-detail__similar-row">
                {frequentTogether.map((p) => (
                  <ProductCard key={p.id} product={p} compact />
                ))}
              </div>
            </section>
          )}

          {cheaperAlternatives.length > 0 && (
            <section
              className="product-detail__similar product-detail__similar--col"
              aria-labelledby="cheaper-heading"
            >
              <h2 id="cheaper-heading">Аналоги дешевле</h2>
              <div className="product-detail__similar-row">
                {cheaperAlternatives.map((p) => (
                  <ProductCard key={p.id} product={p} compact />
                ))}
              </div>
            </section>
          )}
        </section>
      )}

      <section className="product-detail__reviews" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading">Отзывы</h2>

        {user ? (
          <form className="product-review-form" onSubmit={handleReviewSubmit}>
            <label className="product-review-form__label" htmlFor="review-rating">
              Оценка
            </label>
            <select
              id="review-rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value={5}>★★★★★ (5)</option>
              <option value={4}>★★★★☆ (4)</option>
              <option value={3}>★★★☆☆ (3)</option>
              <option value={2}>★★☆☆☆ (2)</option>
              <option value={1}>★☆☆☆☆ (1)</option>
            </select>

            <label className="product-review-form__label" htmlFor="review-text">
              Текст отзыва
            </label>
            <textarea
              id="review-text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Поделитесь впечатлением о товаре"
              required
            />

            <button type="submit" className="button">
              Добавить отзыв
            </button>
          </form>
        ) : (
          <p className="product-detail__reviews-login-note">
            Оставлять отзывы могут только авторизованные пользователи.{' '}
            <Link to="/login">Войти</Link>
          </p>
        )}

        {reviews.length === 0 ? (
          <p className="product-detail__reviews-empty">Пока нет отзывов.</p>
        ) : (
          <ul className="product-detail__reviews-list">
            {reviews.map((review) => (
              <li key={review.id} className="product-detail__review-item">
                <p className="product-detail__review-meta">
                  <strong>{review.userEmail}</strong> · {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)} ·{' '}
                  {new Date(review.createdAt).toLocaleString('ru-RU')}
                </p>
                <p className="product-detail__review-text">{review.text}</p>
                {review.photoBase64 ? (
                  <img
                    src={review.photoBase64}
                    alt="Фото к отзыву"
                    className="product-detail__review-image"
                    width={100}
                    height={100}
                  />
                ) : null}
                {user?.email === review.userEmail && (
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    Удалить мой отзыв
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  )
}
