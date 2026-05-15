import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaTelegram, FaVk, FaYoutube } from 'react-icons/fa'
import {
  STORE_EMAIL,
  STORE_HOURS,
  STORE_PHONE,
  STORE_PHONE_TEL,
} from '../constants/contacts'
import {
  STORE_ADDRESS,
  YANDEX_MAP_EMBED_URL,
  YANDEX_MAP_OPEN_URL,
} from '../constants/yandexMap'
import './footer.css'

export default function Footer() {
  const year = new Date().getFullYear()
  const [isMapOpen, setIsMapOpen] = useState(false)

  return (
    <div className="site-footer" role="contentinfo">
      <div className="site-footer__grid">
        <div className="site-footer__col site-footer__col--brand">
          <p className="site-footer__copy">© {year} MotoHunters</p>
          <p className="site-footer__tagline">
            Летние и зимние шины, подбор размера онлайн
          </p>
        </div>

        <div className="site-footer__col site-footer__col--contacts">
          <h2 className="site-footer__heading">Контакты</h2>
          <ul className="site-footer__contacts">
            <li>
              <a href={`tel:${STORE_PHONE_TEL}`}>{STORE_PHONE}</a>
              <span className="site-footer__muted"> {STORE_HOURS}</span>
            </li>
            <li>
              <a href={`mailto:${STORE_EMAIL}`}>{STORE_EMAIL}</a>
            </li>
            <li>{STORE_ADDRESS}</li>
          </ul>
        </div>

        <div className="site-footer__col site-footer__col--social">
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
          <p className="site-footer__tagline">
            Шоурум в Минске — откройте карту в полноэкранном окне и постройте маршрут.
          </p>
          <button
            type="button"
            className="site-footer__subscribe-btn"
            onClick={() => setIsMapOpen(true)}
          >
            Показать карту
          </button>
        </div>
      </div>

      <div className="site-footer__bottom">
        <nav className="site-footer__nav" aria-label="Нижняя навигация">
          <Link to="/contacts">Контакты</Link>
          <Link to="/catalog">Каталог</Link>
        </nav>
      </div>

      {isMapOpen && (
        <div
          className="site-footer__modal-backdrop"
          role="presentation"
          onClick={() => setIsMapOpen(false)}
        >
          <div
            className="site-footer__modal site-footer__modal--wide"
            role="dialog"
            aria-modal="true"
            aria-label="Карта проезда"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="site-footer__modal-header">
              <h3>Как нас найти</h3>
              <button
                type="button"
                className="site-footer__modal-close"
                onClick={() => setIsMapOpen(false)}
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>
            <div className="site-footer__map">
              <iframe
                title="Карта: MotoHunters, Минск"
                src={YANDEX_MAP_EMBED_URL}
                loading="lazy"
              />
            </div>
            <a
              className="site-footer__map-link"
              href={YANDEX_MAP_OPEN_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Открыть карту крупнее
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
