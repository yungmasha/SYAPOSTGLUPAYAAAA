import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FaBalanceScale, FaCheck, FaHeart, FaRegHeart } from 'react-icons/fa'
import { useAuth } from '../contexts/authcontext'
import { useCart } from '../contexts/cartcontext'
import { useBooking } from '../contexts/bookingcontext'
import { useCompare } from '../contexts/comparecontext'
import { useFavorites } from '../contexts/favoritescontext'
import { useToast } from '../contexts/toastcontext'
import { useModalFocus } from '../hooks/useModalFocus'
import { formatByn } from '../utils/currency'
import type { Tire } from '../types/tire'
import './productcard.css'

type ProductCardProps = {
  product: Tire
  compact?: boolean
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { addBooking, removeBooking, isBooked } = useBooking()
  const { addToCompare, removeFromCompare, isInCompare } = useCompare()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const { showToast } = useToast()
  const inFavorites = isFavorite(product.id)
  const inCompare = isInCompare(product.id)
  const booked = isBooked(product.id)
  const availableCount = Number(product.quantity ?? product.stock ?? 1)

  const productUrl = `/product/${product.id}`
  const title = `${product.brand} ${product.name}`
  const FavIcon = inFavorites ? FaHeart : FaRegHeart

  const closeModal = () => setIsModalOpen(false)
  useModalFocus(isModalOpen, modalRef, closeModal)

  const handleOpenBookingModal = () => {
    if (availableCount <= 0) {
      showToast('Товар временно отсутствует на складе', 'error')
      return
    }
    setFullName(user?.fullName ?? '')
    setPhone(user?.phone ?? '')
    setIsModalOpen(true)
  }

  const handleConfirmBooking = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!fullName.trim() || !phone.trim()) {
      showToast('Введите ФИО и телефон для бронирования', 'error')
      return
    }
    addBooking(product, { fullName, phone })
    setIsModalOpen(false)
    setFullName('')
    setPhone('')
    showToast('Бронь оформлена на 3 дня')
  }

  const handleAddToCart = () => {
    addToCart(product)
    if (booked) {
      removeBooking(product.id)
    }
    showToast('Товар добавлен в корзину')
  }

  const handleToggleCompare = () => {
    if (inCompare) {
      removeFromCompare(product.id)
      showToast('Убрано из сравнения', 'info')
      return
    }
    const result = addToCompare(product)
    if (!result.ok) {
      showToast(result.message, 'error')
    } else {
      showToast('Добавлено к сравнению')
    }
  }

  const handleToggleFavorites = () => {
    if (inFavorites) {
      removeFromFavorites(product.id)
      showToast('Убрано из избранного', 'info')
    } else {
      addToFavorites(product.id)
      showToast('Добавлено в избранное')
    }
  }

  return (
    <>
      <article
        className={`product-card${compact ? ' product-card--compact' : ''}`}
      >
        <div className="product-card__body">
          <Link
            to={productUrl}
            className="product-card__media-link"
            aria-label={`Открыть товар: ${title}`}
          >
            <div className="product-card__image-wrap">
              <img
                className="product-card__img"
                src={product.image}
                alt={product.name}
                width={200}
                height={200}
                loading="lazy"
                decoding="async"
              />
            </div>
          </Link>
          <Link to={productUrl} className="product-card__title-link">
            <h3 className="product-card__title">{title}</h3>
          </Link>
          <p className="product-card__price">{formatByn(product.price)}</p>
        </div>
        <div className="product-card__actions">
          <button
            type="button"
            className="product-card__cart-btn"
            onClick={handleAddToCart}
          >
            В корзину
          </button>
          <div className="product-card__actions-icons">
            <button
              type="button"
              className={`product-card__compare-btn${inCompare ? ' product-card__compare-btn--active' : ''}`}
              onClick={handleToggleCompare}
              aria-label={
                inCompare ? 'Убрать из сравнения' : 'Добавить к сравнению'
              }
              aria-pressed={inCompare}
              title={inCompare ? 'Убрать из сравнения' : 'Сравнить'}
            >
              {inCompare ? (
                <FaCheck
                  className="product-card__compare-icon"
                  size={16}
                  aria-hidden
                />
              ) : (
                <FaBalanceScale
                  className="product-card__compare-icon"
                  size={16}
                  aria-hidden
                />
              )}
              <span className="product-card__icon-label">Сравнить</span>
            </button>
            <button
              type="button"
              className={`product-card__fav-btn${inFavorites ? ' product-card__fav-btn--active' : ''}`}
              onClick={handleToggleFavorites}
              aria-label={
                inFavorites ? 'Убрать из избранного' : 'Добавить в избранное'
              }
              aria-pressed={inFavorites}
            >
              <FavIcon className="product-card__fav-icon" size={18} aria-hidden />
              <span className="product-card__icon-label">В избранное</span>
            </button>
          </div>
          <button
            type="button"
            className="product-card__reserve-btn secondary"
            onClick={handleOpenBookingModal}
            disabled={availableCount <= 0}
          >
            Забронировать без оплаты
          </button>
        </div>
      </article>

      {isModalOpen && (
        <div
          className="product-card__modal-backdrop"
          role="presentation"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            className="product-card__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 id="booking-modal-title" className="product-card__modal-title">
              Забронировать товар {title} на 3 дня?
            </h4>
            <p className="product-card__modal-text">Введите ФИО и телефон</p>
            <form onSubmit={handleConfirmBooking}>
              <input
                type="text"
                placeholder="ФИО"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="product-card__modal-input"
                autoComplete="name"
                required
              />
              <input
                type="tel"
                placeholder="Телефон"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="product-card__modal-input"
                autoComplete="tel"
                required
              />
              <div className="product-card__modal-actions">
                <button type="submit" className="button">
                  Подтвердить бронь
                </button>
                <button
                  type="button"
                  className="button secondary"
                  onClick={closeModal}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
