import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  FaHeart,
  FaShoppingCart,
  FaBalanceScale,
  FaCalendarCheck,
  FaBox,
} from 'react-icons/fa'
import { useAuth } from '../contexts/authcontext'
import { useBooking } from '../contexts/bookingcontext'
import { useOrders } from '../contexts/ordercontext'
import { useCart } from '../contexts/cartcontext'
import { useCompare } from '../contexts/comparecontext'
import { useFavorites } from '../contexts/favoritescontext'
import { useToast } from '../contexts/toastcontext'
import { usePageTitle } from '../hooks/usePageTitle'
import { STORE_EMAIL, STORE_PHONE, STORE_PHONE_TEL } from '../constants/contacts'
import type { OrderRecord } from '../types/order'
import { formatByn } from '../utils/currency'
import './profile.css'

function formatOrderDate(timestamp: number) {
  return new Date(timestamp).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ProfileOrdersSection({
  orders,
  loading,
}: {
  orders: OrderRecord[]
  loading: boolean
}) {
  return (
    <section
      id="profile-orders"
      className="profile-page__card panel profile-page__orders"
      aria-labelledby="profile-orders-heading"
    >
      <h2 id="profile-orders-heading">Мои заказы</h2>
      {loading ? (
        <p className="profile-page__orders-empty">Загрузка заказов…</p>
      ) : orders.length === 0 ? (
        <p className="profile-page__orders-empty">
          Заказов пока нет. Оформите покупку в{' '}
          <Link to="/catalog">каталоге</Link> — история появится здесь.
        </p>
      ) : (
        <ul className="profile-orders-list">
          {orders.map((order) => (
            <li key={order.id} className="profile-order">
              <header className="profile-order__head">
                <div>
                  <p className="profile-order__id">№ {order.id}</p>
                  <time
                    className="profile-order__date"
                    dateTime={new Date(order.createdAt).toISOString()}
                  >
                    {formatOrderDate(order.createdAt)}
                  </time>
                </div>
                <span className="profile-order__status">Выполнен</span>
              </header>

              <ul className="profile-order__items">
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.productId}`}>
                    <Link to={`/product/${item.productId}`}>{item.title}</Link>
                    <span>
                      × {item.quantity} — {formatByn(item.lineTotal)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="profile-order__meta">
                <div>
                  <dt>Доставка</dt>
                  <dd>{order.customer.address}</dd>
                </div>
                <div>
                  <dt>Оплата</dt>
                  <dd>{order.customer.payment}</dd>
                </div>
                {order.appliedPromo && (
                  <div>
                    <dt>Промокод</dt>
                    <dd>{order.appliedPromo}</dd>
                  </div>
                )}
              </dl>

              <p className="profile-order__total">
                Итого: <strong>{formatByn(order.pricing.totalToPay)}</strong>
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default function Profile() {
  const { user, isAuthReady, updateProfile, logout } = useAuth()
  const { favorites } = useFavorites()
  const { cartItems } = useCart()
  const { compareItems } = useCompare()
  const { bookings } = useBooking()
  const { orders, isOrdersReady } = useOrders()
  const { showToast } = useToast()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  usePageTitle(
    'Профиль',
    'Личный кабинет MotoHunters: заказы, контакты, избранное и бронирования.',
  )

  const userOrders = useMemo(() => {
    if (!user?.email) return []
    const key = user.email.trim().toLowerCase()
    return orders
      .filter((order) => order.userEmail === key)
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [user?.email, orders])

  useEffect(() => {
    if (user) {
      setFullName(user.fullName)
      setPhone(user.phone)
      setAddress(user.address)
    }
  }, [user])

  if (!isAuthReady) {
    return (
      <section className="page profile-page profile-page--loading">
        <p className="profile-page__loading">Загрузка профиля…</p>
      </section>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: '/profile' }} />
  }

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0)

  const handleSaveProfile = () => {
    updateProfile({
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
    })
    setSaveMessage('Изменения сохранены')
    showToast('Профиль сохранён')
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSaveProfile()
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

      <ProfileOrdersSection orders={userOrders} loading={!isOrdersReady} />

      <div className="profile-page__grid">
        <div className="profile-page__main">
          <div className="profile-page__card panel profile-page__card--personal">
            <form className="profile-page__form" onSubmit={handleSubmit} noValidate>
              <div className="profile-page__form-top">
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
              </div>

              <div className="profile-page__form-address">
                <label className="profile-page__label" htmlFor="profile-address">
                  Адрес доставки
                </label>
                <textarea
                  id="profile-address"
                  className="profile-page__textarea"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Город, улица, дом, подъезд"
                  rows={3}
                  autoComplete="street-address"
                />
              </div>

              <div className="profile-page__actions">
                <button type="submit" className="button">
                  Сохранить
                </button>
                {saveMessage ? (
                  <p className="profile-page__save-msg" role="status">
                    {saveMessage}
                  </p>
                ) : null}
              </div>
            </form>
          </div>
        </div>

        <aside className="profile-page__aside">
          <div className="profile-page__stats">
            <button
              type="button"
              className="profile-stat profile-stat--anchor"
              onClick={() => {
                document
                  .getElementById('profile-orders')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              <FaBox aria-hidden />
              <span className="profile-stat__value">{userOrders.length}</span>
              <span className="profile-stat__label">Заказы</span>
            </button>
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

          <div className="profile-page__support-promo">
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
