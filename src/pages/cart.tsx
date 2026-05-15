import { useMemo, useState, useEffect, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/authcontext'
import {
  computeCartPricing,
  useCart,
} from '../contexts/cartcontext'
import { useToast } from '../contexts/toastcontext'
import { usePageTitle } from '../hooks/usePageTitle'
import {
  PROMO_DISCOUNT_RATE,
  isValidPromoCode,
} from '../utils/promo'
import { formatByn } from '../utils/currency'
import './cart.css'

type CartQuantityControlProps = {
  productId: number
  quantity: number
  updateQuantity: (productId: number, quantity: number) => void
}

function CartQuantityControl({
  productId,
  quantity,
  updateQuantity,
}: CartQuantityControlProps) {
  const [inputValue, setInputValue] = useState(String(quantity))

  useEffect(() => {
    setInputValue(String(quantity))
  }, [quantity])

  const commitQuantity = (raw: unknown) => {
    const n = parseInt(String(raw).trim(), 10)
    if (!Number.isFinite(n) || n < 1) {
      setInputValue(String(quantity))
      return
    }
    updateQuantity(productId, n)
  }

  const decrement = () => {
    if (quantity <= 1) return
    updateQuantity(productId, quantity - 1)
  }

  const increment = () => {
    updateQuantity(productId, quantity + 1)
  }

  return (
    <div className="cart-item__qty" role="group" aria-label="Количество">
      <button
        type="button"
        className="cart-item__qty-btn"
        onClick={decrement}
        disabled={quantity <= 1}
        aria-label="Уменьшить количество"
      >
        −
      </button>
      <input
        type="number"
        className="cart-item__qty-input"
        min={1}
        inputMode="numeric"
        aria-label="Количество штук"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => commitQuantity(inputValue)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            e.currentTarget.blur()
          }
        }}
      />
      <button
        type="button"
        className="cart-item__qty-btn"
        onClick={increment}
        aria-label="Увеличить количество"
      >
        +
      </button>
    </div>
  )
}

export default function Cart() {
  usePageTitle('Корзина')
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItemPricing,
  } = useCart()

  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)

  const pricing = useMemo(
    () =>
      computeCartPricing(cartItems, {
        promoDiscountRate: appliedPromo ? PROMO_DISCOUNT_RATE : 0,
      }),
    [cartItems, appliedPromo],
  )

  const total = pricing.totalToPay

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (!code) {
      showToast('Введите промокод', 'error')
      return
    }
    if (code.length !== 8) {
      showToast('Промокод — 8 символов', 'error')
      return
    }
    if (appliedPromo === code) {
      showToast('Этот промокод уже активен', 'info')
      return
    }
    if (!isValidPromoCode(code)) {
      showToast('Промокод не найден', 'error')
      if (appliedPromo) setPromoInput(appliedPromo)
      return
    }
    setAppliedPromo(code)
    setPromoInput(code)
    showToast('Промокод применён: скидка 10%')
  }

  const handlePromoFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleApplyPromo()
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoInput('')
    showToast('Промокод снят', 'info')
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Корзина пуста. Добавьте товары для оформления', 'error')
      return
    }
    navigate('/checkout', {
      state: {
        cartItems,
        totalPrice: total,
        appliedPromo,
        pricing,
      },
    })
  }

  const handleClear = () => {
    if (
      !window.confirm(
        'Очистить корзину? Все товары будут удалены.',
      )
    ) {
      return
    }
    clearCart()
    showToast('Корзина очищена', 'info')
  }

  if (cartItems.length === 0) {
    return (
      <section className="page cart-page">
        <h1>Корзина</h1>
        <p className="cart-page__empty">
          Корзина пуста.{' '}
          <Link to="/catalog">Перейти в каталог</Link>
        </p>
      </section>
    )
  }

  return (
    <section className="page cart-page">
      <h1>Корзина</h1>

      <div className="cart-page__layout">
        <div className="cart-page__products-col">
          <ul className="cart-page__list">
            {cartItems.map(({ product, quantity }) => {
              const title = `${product.brand} ${product.name}`
              const itemPricing = getItemPricing(product, quantity)

              return (
                <li key={product.id} className="cart-item">
                  <Link
                    to={`/product/${product.id}`}
                    className="cart-item__thumb-link"
                    aria-label={`Открыть: ${title}`}
                  >
                    <div className="cart-item__thumb">
                      <img
                        src={product.image}
                        alt=""
                        width={88}
                        height={88}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </Link>

                  <div className="cart-item__main">
                    <div className="cart-item__head">
                      <div className="cart-item__title-wrap">
                        <h2 className="cart-item__title">
                          <Link to={`/product/${product.id}`}>{title}</Link>
                        </h2>
                        <p className="cart-item__unit-price">
                          {formatByn(product.price)} за шт.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="cart-item__remove"
                        onClick={() => removeFromCart(product.id)}
                      >
                        Удалить
                      </button>
                    </div>

                    <div className="cart-item__foot">
                      <CartQuantityControl
                        productId={product.id}
                        quantity={quantity}
                        updateQuantity={updateQuantity}
                      />
                      <div className="cart-item__line-wrap">
                        {itemPricing.hasSetDiscount && (
                          <p className="cart-item__set-note">
                            Комплект 4+ шт. — скидка 5%
                          </p>
                        )}
                        <p className="cart-item__line-total">
                          {formatByn(itemPricing.totalAfterSetDiscount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <aside className="cart-page__summary-col">
          <div className="cart-page__summary-card">
            <h2 className="cart-page__summary-card-title">Ваш заказ</h2>

            <div className="cart-page__promo">
              <label className="cart-page__promo-label" htmlFor="cart-promo">
                Промокод{' '}
                <span className="cart-page__promo-optional">(необязательно)</span>
              </label>
              {user?.promoCode && (
                <p className="cart-page__promo-hint">
                  Ваш код:{' '}
                  <button
                    type="button"
                    className="cart-page__promo-own"
                    onClick={() => {
                      setPromoInput(user.promoCode)
                      setAppliedPromo(user.promoCode)
                      showToast('Ваш промокод применён')
                    }}
                  >
                    {user.promoCode}
                  </button>
                </p>
              )}
              <form
                className="cart-page__promo-row"
                onSubmit={handlePromoFormSubmit}
              >
                <input
                  id="cart-promo"
                  type="text"
                  className="cart-page__promo-input"
                  placeholder="________"
                  aria-label="Промокод, 8 символов"
                  value={promoInput}
                  onChange={(e) =>
                    setPromoInput(e.target.value.toUpperCase().slice(0, 8))
                  }
                  maxLength={8}
                  autoComplete="off"
                  spellCheck={false}
                />
                <div className="cart-page__promo-buttons">
                  <button type="submit" className="button cart-page__promo-btn">
                    Применить
                  </button>
                  <button
                    type="button"
                    className="button secondary cart-page__promo-btn"
                    disabled={!appliedPromo}
                    onClick={handleRemovePromo}
                  >
                    Сбросить
                  </button>
                </div>
              </form>
              {appliedPromo && (
                <p className="cart-page__promo-applied" role="status">
                  Активен: {appliedPromo} (−10%)
                </p>
              )}
            </div>

            <dl className="cart-page__summary-lines">
              <div className="cart-page__summary-row">
                <dt>Товары</dt>
                <dd>{formatByn(pricing.subtotal)}</dd>
              </div>
              {pricing.bundleDiscount > 0 && (
                <div className="cart-page__summary-row cart-page__summary-row--discount">
                  <dt>Комплект 4+ шт. −5%</dt>
                  <dd>−{formatByn(pricing.bundleDiscount)}</dd>
                </div>
              )}
              {pricing.promoDiscount > 0 && (
                <div className="cart-page__summary-row cart-page__summary-row--discount">
                  <dt>Промокод −10%</dt>
                  <dd>−{formatByn(pricing.promoDiscount)}</dd>
                </div>
              )}
              <div className="cart-page__summary-row">
                <dt>Доставка</dt>
                <dd>{formatByn(pricing.deliveryFinal)}</dd>
              </div>
            </dl>
            {pricing.isDiscountCapped && (
              <p className="cart-page__discount-cap-note">
                Суммарная скидка ограничена 30% от стоимости товаров.
              </p>
            )}
            <p className="cart-page__total">
              Итого к оплате: <span>{formatByn(total)}</span>
            </p>
          </div>

          <div className="cart-page__actions">
            <button
              type="button"
              className="cart-page__btn cart-page__btn--ghost"
              onClick={handleClear}
            >
              Очистить корзину
            </button>
            <button
              type="button"
              className="cart-page__btn cart-page__btn--primary"
              onClick={handleCheckout}
            >
              Перейти к оформлению
            </button>
          </div>
        </aside>
      </div>
    </section>
  )
}
