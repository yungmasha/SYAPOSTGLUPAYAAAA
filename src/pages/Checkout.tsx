import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/authcontext'
import {
  computeCartPricing,
  useCart,
} from '../contexts/cartcontext'
import type { CartItem, CartPricing } from '../contexts/cartcontext'
import { useOrders } from '../contexts/ordercontext'
import { useToast } from '../contexts/toastcontext'
import { PROMO_DISCOUNT_RATE } from '../utils/promo'
import { usePageTitle } from '../hooks/usePageTitle'
import { formatByn } from '../utils/currency'
import { normalizeEmail } from '../utils/email'
import './checkout.css'

const PAYMENT_OPTIONS = [
  { value: 'card', label: 'Карта онлайн' },
  { value: 'cash', label: 'Наличные курьеру' },
  { value: 'sbp', label: 'СБП' },
]

export default function Checkout() {
  usePageTitle('Оформление заказа')
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { clearCart } = useCart()
  const { addOrder } = useOrders()
  const { showToast } = useToast()

  const payload = location.state as
    | {
        cartItems?: CartItem[]
        totalPrice?: number
        appliedPromo?: string | null
        pricing?: CartPricing
      }
    | null
  const cartItems = payload?.cartItems ?? []
  const totalPrice = payload?.totalPrice ?? 0
  const appliedPromo = payload?.appliedPromo ?? null
  const orderPricing = payload?.pricing

  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [address, setAddress] = useState(user?.address ?? '')
  const [payment, setPayment] = useState('card')
  const [comment, setComment] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      showToast('Заполните обязательные поля: ФИО, телефон, адрес', 'error')
      return
    }
    const resolvedEmail = normalizeEmail(user?.email || email || '')
    if (!resolvedEmail) {
      showToast('Укажите email для сохранения заказа в профиле', 'error')
      return
    }
    const pricing =
      orderPricing ??
      computeCartPricing(cartItems, {
        promoDiscountRate: appliedPromo ? PROMO_DISCOUNT_RATE : 0,
      })
    const paymentLabel =
      PAYMENT_OPTIONS.find((opt) => opt.value === payment)?.label ?? payment

    addOrder({
      userEmail: resolvedEmail,
      customer: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: resolvedEmail,
        address: address.trim(),
        payment: paymentLabel,
        comment: comment.trim(),
      },
      appliedPromo,
      items: cartItems.map(({ product, quantity }) => ({
        productId: product.id,
        title: `${product.brand} ${product.name}`,
        quantity,
        unitPrice: product.price,
        lineTotal: product.price * quantity,
      })),
      pricing: {
        subtotal: pricing.subtotal,
        deliveryFinal: pricing.deliveryFinal,
        bundleDiscount: pricing.bundleDiscount,
        promoDiscount: pricing.promoDiscount,
        totalToPay: pricing.totalToPay,
      },
    })

    showToast('Заказ оформлен! История доступна в профиле')
    clearCart()
    navigate(user ? '/profile' : '/', { replace: true })
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <section className="page checkout-page">
        <h1>Оформление заказа</h1>
        <p className="checkout-page__empty">
          Нет данных заказа.{' '}
          <Link to="/cart">Вернуться в корзину</Link>
        </p>
      </section>
    )
  }

  return (
    <section className="page checkout-page">
      <h1>Оформление заказа</h1>

      <div className="checkout-page__layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <fieldset className="checkout-form__fieldset">
            <legend className="checkout-form__legend">Контакты и доставка</legend>

            <label className="checkout-form__label" htmlFor="checkout-name">
              ФИО <span aria-hidden="true">*</span>
            </label>
            <input
              id="checkout-name"
              className="checkout-form__input"
              type="text"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
            />

            <label className="checkout-form__label" htmlFor="checkout-phone">
              Телефон <span aria-hidden="true">*</span>
            </label>
            <input
              id="checkout-phone"
              className="checkout-form__input"
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              autoComplete="tel"
            />

            <label className="checkout-form__label" htmlFor="checkout-email">
              Email
            </label>
            <input
              id="checkout-email"
              className="checkout-form__input"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <label className="checkout-form__label" htmlFor="checkout-address">
              Адрес доставки <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="checkout-address"
              className="checkout-form__textarea"
              name="address"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              autoComplete="street-address"
            />

            <label className="checkout-form__label" htmlFor="checkout-payment">
              Способ оплаты
            </label>
            <select
              id="checkout-payment"
              className="checkout-form__select"
              name="payment"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
            >
              {PAYMENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <label className="checkout-form__label" htmlFor="checkout-comment">
              Комментарий к заказу
            </label>
            <textarea
              id="checkout-comment"
              className="checkout-form__textarea"
              name="comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Пожелания по доставке, звонку и т.п."
            />
          </fieldset>

          <div className="checkout-form__actions">
            <button type="submit" className="checkout-form__submit button">
              Подтвердить заказ
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => navigate('/cart')}
            >
              Вернуться в корзину
            </button>
          </div>
        </form>

        <aside className="checkout-summary" aria-labelledby="checkout-order-heading">
          <h2 id="checkout-order-heading" className="checkout-summary__title">
            Ваш заказ
          </h2>
          <ul className="checkout-summary__list">
            {cartItems.map(({ product, quantity }) => {
              const line = product.price * quantity
              const title = `${product.brand} ${product.name}`
              return (
                <li key={product.id} className="checkout-summary__item">
                  <span className="checkout-summary__name">{title}</span>
                  <span className="checkout-summary__qty">× {quantity}</span>
                  <span className="checkout-summary__line">{formatByn(line)}</span>
                </li>
              )
            })}
          </ul>
          {orderPricing && (
            <dl className="checkout-summary__lines">
              <div className="checkout-summary__line-row">
                <dt>Товары</dt>
                <dd>{formatByn(orderPricing.subtotal)}</dd>
              </div>
              <div className="checkout-summary__line-row">
                <dt>Доставка</dt>
                <dd>{formatByn(orderPricing.deliveryFinal)}</dd>
              </div>
              {orderPricing.bundleDiscount > 0 && (
                <div className="checkout-summary__line-row checkout-summary__line-row--discount">
                  <dt>Комплект</dt>
                  <dd>−{formatByn(orderPricing.bundleDiscount)}</dd>
                </div>
              )}
              {orderPricing.promoDiscount > 0 && (
                <div className="checkout-summary__line-row checkout-summary__line-row--discount">
                  <dt>
                    Промокод{appliedPromo ? ` ${appliedPromo}` : ''} −10%
                  </dt>
                  <dd>−{formatByn(orderPricing.promoDiscount)}</dd>
                </div>
              )}
            </dl>
          )}
          <p className="checkout-summary__total">
            Итого: <strong>{formatByn(totalPrice)}</strong>
          </p>
        </aside>
      </div>
    </section>
  )
}
