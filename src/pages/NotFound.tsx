import { Link } from 'react-router-dom'
import { FaHome, FaSearch } from 'react-icons/fa'
import { usePageTitle } from '../hooks/usePageTitle'
import './not-found.css'

export default function NotFound() {
  usePageTitle('Страница не найдена')
  return (
    <section className="not-found page">
      <div className="not-found__grid-bg" aria-hidden />
      <div className="not-found__glow not-found__glow--orange" aria-hidden />
      <div className="not-found__glow not-found__glow--blue" aria-hidden />

      <div className="not-found__content">
        <p className="not-found__code" aria-hidden>
          404
        </p>
        <h1 className="not-found__title">Съехали с маршрута</h1>
        <p className="not-found__text">
          Такой страницы нет — возможно, ссылка устарела или адрес набран с ошибкой.
          Вернитесь на главную или откройте каталог шин.
        </p>
        <div className="not-found__actions">
          <Link to="/" className="button not-found__btn">
            <FaHome aria-hidden />
            На главную
          </Link>
          <Link to="/catalog" className="button secondary not-found__btn">
            <FaSearch aria-hidden />
            В каталог
          </Link>
        </div>
      </div>

      <div className="not-found__tire" aria-hidden>
        <svg viewBox="0 0 200 200" className="not-found__tire-svg">
          <circle cx="100" cy="100" r="88" className="not-found__tire-ring" />
          <circle cx="100" cy="100" r="72" className="not-found__tire-ring not-found__tire-ring--inner" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="100"
              y1="100"
              x2={100 + 88 * Math.cos((deg * Math.PI) / 180)}
              y2={100 + 88 * Math.sin((deg * Math.PI) / 180)}
              className="not-found__tire-spoke"
            />
          ))}
        </svg>
      </div>
    </section>
  )
}

