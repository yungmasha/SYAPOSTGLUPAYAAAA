import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa'
import { STORE_PHONE, STORE_PHONE_TEL } from '../constants/contacts'
import { usePageTitle } from '../hooks/usePageTitle'
import HomeHeroSlider from '../components/HomeHeroSlider'
import ProductCard from '../components/productcard'
import TipsSlider from '../components/TipsSlider'
import CarSelector from '../components/CarSelector'
import { tires } from '../data/tires'
import {
  STORE_ADDRESS,
  YANDEX_MAP_EMBED_URL,
  YANDEX_MAP_OPEN_URL,
} from '../constants/yandexMap'
import './home.css'

const POPULAR = tires.slice(0, 4)

export default function Home() {
  usePageTitle('Главная', 'MotoHunters — шинный центр в Минске: каталог, подбор по авто, доставка.')

  return (
    <>
      <HomeHeroSlider />
      <div className="home page">
      <section className="home-section" id="pick" aria-labelledby="pick-heading">
        <header className="home-section__head">
          <div>
            <h2 id="pick-heading" className="home-section__title">
              Подбор шин
            </h2>
            <p className="home-section__lead">
              Укажите марку, модель и год — покажем подходящие размеры и откроем
              каталог с готовым фильтром.
            </p>
          </div>
        </header>
        <div className="home-panel">
          <CarSelector title="" />
        </div>
      </section>

      <section className="home-section" aria-labelledby="tips-heading">
        <header className="home-section__head">
          <div>
            <h2 id="tips-heading" className="home-section__title">
              Полезно знать
            </h2>
            <p className="home-section__lead">
              Короткие советы по выбору, давлению и сезонной смене резины.
            </p>
          </div>
        </header>
        <TipsSlider embedded />
      </section>

      <section className="home-section" aria-labelledby="popular-heading">
        <header className="home-section__head">
          <div>
            <h2 id="popular-heading" className="home-section__title">
              Хиты продаж
            </h2>
            <p className="home-section__lead">
              Популярные модели, которые чаще всего берут наши клиенты.
            </p>
          </div>
          <Link to="/catalog" className="home-section__link">
            Весь каталог →
          </Link>
        </header>
        <ul className="home-hits">
          {POPULAR.map((tire) => (
            <li key={tire.id} className="home-hits__item">
              <ProductCard product={tire} compact />
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section" id="map" aria-labelledby="map-heading">
        <header className="home-section__head">
          <div>
            <h2 id="map-heading" className="home-section__title">
              Как нас найти
            </h2>
            <p className="home-section__lead">
              Шоурум и пункт выдачи: {STORE_ADDRESS}
            </p>
          </div>
          <a
            href={YANDEX_MAP_OPEN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="home-section__link"
          >
            Маршрут в Яндекс.Картах →
          </a>
        </header>
        <div className="home-location">
          <div className="home-location__map home-panel">
            <iframe
              src={YANDEX_MAP_EMBED_URL}
              width="100%"
              height="100%"
              title="Карта: MotoHunters, Минск"
              loading="lazy"
              allowFullScreen
            />
          </div>
          <div className="home-location__info home-panel">
            <ul className="home-location__list">
              <li>
                <FaMapMarkerAlt aria-hidden />
                <span>{STORE_ADDRESS}</span>
              </li>
              <li>
                <FaPhone aria-hidden />
                <a href={`tel:${STORE_PHONE_TEL}`}>{STORE_PHONE}</a>
              </li>
              <li>
                <FaClock aria-hidden />
                <span>Ежедневно 9:00–21:00</span>
              </li>
            </ul>
            <p className="home-location__note">
              Бесплатная парковка для клиентов. Перед визитом можно
              забронировать шины на сайте без оплаты.
            </p>
            <Link to="/contacts" className="button secondary home-location__btn">
              Все контакты
            </Link>
          </div>
        </div>
      </section>

      </div>
    </>
  )
}
