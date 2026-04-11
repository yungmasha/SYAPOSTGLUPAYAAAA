import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/cartcontext.jsx'
import { formatByn } from '../utils/currency.js'
import './cart.css'

function CartQuantityControl({ productId, quantity, updateQuantity }) {
  const [inputValue, setInputValue] = useState(String(quantity))

  useEffect(() => {
    setInputValue(String(quantity))
  }, [quantity])

  const commitQuantity = (raw) => {
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
  const navigate = useNavigate()
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart()

  const total = useMemo(
    () =>
      cartItems.reduce(
        (sum, { product, quantity }) => sum + product.price * quantity,
        0
      ),
    [cartItems]
  )

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      window.alert('Корзина пуста. Добавьте товары для оформления заказа')
      return
    }
    navigate('/checkout', { state: { cartItems, totalPrice: total } })
  }

  const handleClear = () => {
    clearCart()
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

      <ul className="cart-page__list">
        {cartItems.map(({ product, quantity }) => {
          const lineTotal = product.price * quantity
          const title = `${product.brand} ${product.name}`

          return (
            <li key={product.id} className="cart-item">
              <div className="cart-item__title-wrap">
                <h2 className="cart-item__title">
                  <Link to={`/product/${product.id}`}>{title}</Link>
                </h2>
                <p className="cart-item__unit-price">
                  {formatByn(product.price)} за шт.
                </p>
              </div>

              <CartQuantityControl
                productId={product.id}
                quantity={quantity}
                updateQuantity={updateQuantity}
              />

              <p className="cart-item__line-total">{formatByn(lineTotal)}</p>

              <button
                type="button"
                className="cart-item__remove"
                onClick={() => removeFromCart(product.id)}
              >
                Удалить
              </button>
            </li>
          )
        })}
      </ul>

      <footer className="cart-page__footer">
        <p className="cart-page__total">
          Итого: {formatByn(total)}
        </p>
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
      </footer>
    </section>
  )
}
