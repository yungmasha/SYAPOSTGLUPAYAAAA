import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
  type NavLinkRenderProps,
} from 'react-router-dom'
import { FaBars, FaTimes, FaUser } from 'react-icons/fa'
import { useAuth } from '../contexts/authcontext'
import { useCart } from '../contexts/cartcontext'
import { useCompare } from '../contexts/comparecontext'
import { useFavorites } from '../contexts/favoritescontext'
import ThemeToggle from './ThemeToggle'
import './header.css'

const linkClass = ({ isActive }: NavLinkRenderProps) =>
  isActive ? 'nav-link nav-link--active' : 'nav-link'

const profileLinkClass = ({ isActive }: NavLinkRenderProps) =>
  `header-icon-link${isActive ? ' header-icon-link--active' : ''}`

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const { cartItems } = useCart()
  const { favorites } = useFavorites()
  const { compareItems } = useCompare()
  const [searchValue, setSearchValue] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )
  const favoritesCount = favorites.length
  const compareCount = compareItems.length

  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    if (location.pathname === '/catalog') {
      setSearchValue(q)
    }
  }, [location.pathname, searchParams])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.classList.toggle('nav-menu-open', menuOpen)
    return () => document.body.classList.remove('nav-menu-open')
  }, [menuOpen])

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const q = searchValue.trim()
    if (!q) {
      navigate('/catalog')
      return
    }
    navigate(`/catalog?q=${encodeURIComponent(q)}`)
  }

  const navLinks = (
    <>
      <NavLink to="/catalog" className={linkClass}>
        Каталог
      </NavLink>
      <NavLink to="/about" className={linkClass}>
        О компании
      </NavLink>
      <NavLink
        to="/compare"
        className={linkClass}
        aria-label={`Сравнение, ${compareCount} товаров`}
      >
        Сравнение
        {compareCount > 0 && (
          <span className="nav-badge">{compareCount}</span>
        )}
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
    </>
  )

  return (
    <header className="site-header" role="banner">
      <div className="site-header__bar">
        <NavLink to="/" className="site-logo" end={true}>
          MotoHunters
        </NavLink>

        <nav
          id="site-nav"
          className={`site-nav${menuOpen ? ' site-nav--open' : ''}`}
          aria-label="Основная навигация"
        >
          {navLinks}
        </nav>

        <div className="site-header__toolbar">
          <ThemeToggle />
          {user ? (
            <NavLink
              to="/profile"
              className={profileLinkClass}
              aria-label="Профиль"
              title="Профиль"
            >
              <FaUser size={18} aria-hidden />
            </NavLink>
          ) : (
            <NavLink to="/login" className={linkClass}>
              Войти
            </NavLink>
          )}
          <button
            type="button"
            className="site-header__menu-btn"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <FaTimes aria-hidden />
            ) : (
              <FaBars aria-hidden />
            )}
            <span className="visually-hidden">
              {menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            </span>
          </button>
        </div>
      </div>

      <div className="site-header__search-row">
        <form className="site-header__search" onSubmit={handleSearchSubmit}>
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Поиск шины по названию"
            aria-label="Поиск шины по названию"
          />
          <button type="submit">Найти</button>
        </form>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="site-header__backdrop"
          aria-label="Закрыть меню"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  )
}
