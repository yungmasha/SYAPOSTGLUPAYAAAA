import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { FaHeart, FaShoppingCart, FaBalanceScale, FaCalendarCheck } from 'react-icons/fa'
import { useAuth } from '../contexts/authcontext'
import { useBooking } from '../contexts/bookingcontext'
import { useCart } from '../contexts/cartcontext'
import { useCompare } from '../contexts/comparecontext'
import { useFavorites } from '../contexts/favoritescontext'
import { useToast } from '../contexts/toastcontext'
import { usePageTitle } from '../hooks/usePageTitle'
import { STORE_EMAIL, STORE_PHONE, STORE_PHONE_TEL } from '../constants/contacts'
import './profile.css'

export default function Profile() {
  const { user, updateProfile, logout } = useAuth()
  const { favorites } = useFavorites()
  const { cartItems } = useCart()
  const { compareItems } = useCompare()
  const { bookings } = useBooking()
  const { showToast } = useToast()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')

  usePageTitle(
    'Профиль',
    'Личный кабинет MotoHunters: контакты, избранное, корзина и бронирования.',
  )

  useEffect(() => {
    if (user) {
      setFullName(user.fullName)
      setPhone(user.phone)
    }
  }, [user])

  if (!user) {
    return <Navigate to="/login" replace state={{ from: '/profile' }} />
  }

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateProfile({ fullName, phone })
    showToast('Профиль сохранён')
  }

  const copyPromo = async () => {
    try {
      await navigator.clipboard.writeText(user.promoCode)
      showToast('Промокод скопирован')
    } catch {
      showToast('Не удалось скопировать', 'error')
    }
  }

  const initials = (user.fullName || user.email)
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'MH'

  return (
    <section className="page profile-page">
      <header className="profile-page__hero">
        <div className="profile-page__avatar" aria-hidden>
          {initials}
        </div>
        <div>
          <h1>Профиль</h1>
          <p className="profile-page__email">{user.email}</p>
        </div>
      </header>

      <div className="profile-page__grid">
        <div className="profile-page__main">
        <form className="profile-page__card panel" onSubmit={handleSubmit}>
          <h2>Личные данные</h2>
          <p className="profile-page__hint">
            Используются при бронировании и оформлении заказа.
          </p>

          <label className="profile-page__label" htmlFor="profile-email">
            Email
          </label>
          <input
            id="profile-email"
            type="email"
            value={user.email}
            disabled
            className="profile-page__input profile-page__input--disabled"
          />

          <label className="profile-page__label" htmlFor="profile-name">
            ФИО
          </label>
          <input
            id="profile-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Иван Иванов"
            autoComplete="name"
          />

          <label className="profile-page__label" htmlFor="profile-phone">
            Телефон
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={STORE_PHONE}
            autoComplete="tel"
          />

          <div className="profile-page__actions">
            <button type="submit" className="button">
              Сохранить
            </button>
          </div>
        </form>

          <div className="profile-page__card panel profile-page__promo">
            <h2>Личный промокод</h2>
            <p className="profile-page__hint">
              Скидка 10% на заказ в корзине. Код уникален для вашего email.
            </p>
            <p className="profile-page__promo-code" aria-label="Промокод">
              {user.promoCode}
            </p>
            <p className="profile-page__promo-note">
              Введите код при оформлении в корзине — поле необязательное.
            </p>
            <button type="button" className="button secondary" onClick={copyPromo}>
              Скопировать код
            </button>
          </div>
        </div>

        <aside className="profile-page__aside">
          <div className="profile-page__stats">
            <Link to="/favorites" className="profile-stat">
              <FaHeart aria-hidden />
              <span className="profile-stat__value">{favorites.length}</span>
              <span className="profile-stat__label">Избранное</span>
            </Link>
            <Link to="/cart" className="profile-stat">
              <FaShoppingCart aria-hidden />
              <span className="profile-stat__value">{cartCount}</span>
              <span className="profile-stat__label">В корзине</span>
            </Link>
            <Link to="/compare" className="profile-stat">
              <FaBalanceScale aria-hidden />
              <span className="profile-stat__value">{compareItems.length}</span>
              <span className="profile-stat__label">Сравнение</span>
            </Link>
            <Link
              to="/my-bookings"
              className="profile-stat"
              aria-label={`Мои бронирования: ${bookings.length}`}
            >
              <FaCalendarCheck aria-hidden />
              <span className="profile-stat__value">{bookings.length}</span>
              <span className="profile-stat__label profile-stat__label--long">
                Мои бронирования
              </span>
            </Link>
          </div>

          <div className="profile-page__card panel profile-page__support">
            <h2>Поддержка</h2>
            <p>
              Телефон:{' '}
              <a href={`tel:${STORE_PHONE_TEL}`}>{STORE_PHONE}</a>
            </p>
            <p>
              Email: <a href={`mailto:${STORE_EMAIL}`}>{STORE_EMAIL}</a>
            </p>
            <Link to="/contacts" className="button secondary profile-page__link-btn">
              Все контакты
            </Link>
          </div>
        </aside>
      </div>

      <div className="profile-page__logout-wrap">
        <button
          type="button"
          className="button secondary profile-page__logout-btn"
          onClick={() => {
            logout()
            showToast('Вы вышли из аккаунта', 'info')
          }}
        >
          Выйти из аккаунта
        </button>
      </div>
    </section>
  )
}
