import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/authcontext.jsx'
import { useCart } from '../contexts/cartcontext.jsx'
import { useFavorites } from '../contexts/favoritescontext.jsx'
import './header.css'

const linkClass = ({ isActive }) =>
  isActive ? 'nav-link nav-link--active' : 'nav-link';

export default function Header() {
  const { user, logout } = useAuth()
  const { cartItems } = useCart()
  const { favorites } = useFavorites()

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )
  const favoritesCount = favorites.length

  return (
    <div className="site-header" role="banner">
      <NavLink to="/" className="site-logo" end={true}>
        Шинный магазин
      </NavLink>
      <nav className="site-nav" aria-label="Основная навигация">
        <NavLink to="/catalog" className={linkClass}>
          Каталог
        </NavLink>
        <NavLink to="/about" className={linkClass}>
          О компании
        </NavLink>
        <NavLink
          to="/favorites"
          className={linkClass}
          aria-label={`Избранное, ${favoritesCount} позиций`}
        >
          Избранное
          {favoritesCount > 0 && (
            <span className="nav-badge">{favoritesCount}</span>
          )}
        </NavLink>
        <NavLink
          to="/cart"
          className={linkClass}
          aria-label={`Корзина, ${cartCount} товаров`}
        >
          Корзина
          {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
        </NavLink>
        <NavLink to="/contacts" className={linkClass}>
          Контакты
        </NavLink>
      </nav>
      <div className="site-header__auth">
        {user ? (
          <div className="site-header__user">
            <span className="site-header__email" title={user.email}>
              {user.email}
            </span>
            <button
              type="button"
              className="site-header__logout"
              onClick={logout}
            >
              Выйти
            </button>
          </div>
        ) : (
          <NavLink to="/login" className={linkClass}>
            Войти
          </NavLink>
        )}
      </div>
    </div>
  );
}
