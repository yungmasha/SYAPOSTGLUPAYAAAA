import { Link } from 'react-router-dom'
import { FaTelegram, FaVk, FaYoutube } from 'react-icons/fa'
import './footer.css'

const MAP_EMBED_SRC =
  'https://www.openstreetmap.org/export/embed.html?bbox=37.608%2C55.748%2C37.638%2C55.758&layer=mapnik&marker=55.753%2C37.622'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <div className="site-footer" role="contentinfo">
      <div className="site-footer__grid">
        <div className="site-footer__col site-footer__col--brand">
          <p className="site-footer__copy">© {year} Шинный магазин</p>
          <p className="site-footer__tagline">
            Летние и зимние шины, подбор размера онлайн
          </p>
        </div>

        <div className="site-footer__col">
          <h2 className="site-footer__heading">Контакты</h2>
          <ul className="site-footer__contacts">
            <li>
              <a href="tel:+78001234567">8 (800) 123-45-67</a>
              <span className="site-footer__muted"> ежедневно 9:00–21:00</span>
            </li>
            <li>
              <a href="mailto:info@tireshop.ru">info@tireshop.ru</a>
            </li>
            <li>г. Москва, ул. Шоссейная, д. 12</li>
          </ul>
        </div>

        <div className="site-footer__col">
          <h2 className="site-footer__heading">Соцсети</h2>
          <div className="site-footer__social">
            <a
              href="https://vk.com"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__social-link"
              aria-label="ВКонтакте"
            >
              <FaVk size={22} aria-hidden />
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__social-link"
              aria-label="Telegram"
            >
              <FaTelegram size={22} aria-hidden />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__social-link"
              aria-label="YouTube"
            >
              <FaYoutube size={22} aria-hidden />
            </a>
          </div>
        </div>

        <div className="site-footer__col site-footer__col--map">
          <h2 className="site-footer__heading">Как нас найти</h2>
          <div className="site-footer__map">
            <iframe
              title="Карта: Шинный магазин, Москва"
              src={MAP_EMBED_SRC}
              loading="lazy"
            />
          </div>
          <a
            className="site-footer__map-link"
            href="https://www.openstreetmap.org/?mlat=55.753&mlon=37.622#map=16/55.753/37.622"
            target="_blank"
            rel="noopener noreferrer"
          >
            Открыть карту крупнее
          </a>
        </div>
      </div>

      <div className="site-footer__bottom">
        <nav className="site-footer__nav" aria-label="Нижняя навигация">
          <Link to="/contacts">Контакты</Link>
          <Link to="/catalog">Каталог</Link>
        </nav>
      </div>
    </div>
  );
}
