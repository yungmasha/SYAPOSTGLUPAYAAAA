import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowUp, FaCloud, FaSnowflake, FaSun } from 'react-icons/fa'
import ProductCard from '../components/productcard.jsx'
import TipsSlider from '../components/TipsSlider.jsx'
import { tires } from '../data/tires.js'
import { carBrands, carsData } from '../data/carsData.js'
import './home.css'

const POPULAR = tires.slice(0, 4)

const YEARS = Array.from({ length: 11 }, (_, i) => String(2015 + i)).reverse()

const MAP_IFRAME_SRC =
  'https://yandex.ru/map-widget/v1/?ll=37.617698,55.755864&z=12'

function getWeatherRecommendation(temp) {
  if (temp < 5) return 'Рекомендуем зимнюю резину'
  if (temp > 7) return 'Пора переходить на летнюю резину'
  return 'Всесезонная резина подойдёт'
}

function WeatherIcon({ temperature }) {
  if (temperature === null) return null
  if (temperature < 0) {
    return <FaSnowflake size={56} className="home-weather__big-icon" aria-hidden />
  }
  if (temperature > 20) {
    return <FaSun size={56} className="home-weather__big-icon" aria-hidden />
  }
  return <FaCloud size={56} className="home-weather__big-icon" aria-hidden />
}

export default function Home() {
  const [temperature, setTemperature] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  const [carBrand, setCarBrand] = useState('')
  const [carModel, setCarModel] = useState('')
  const [carYear, setCarYear] = useState(String(new Date().getFullYear()))

  useEffect(() => {
    const t = setTimeout(() => {
      const mockTemp = Math.floor(Math.random() * 41) - 15
      setTemperature(mockTemp)
    }, 500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300)
    }
    toggleVisibility()
    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const modelsForBrand = useMemo(() => {
    if (!carBrand || !carsData[carBrand]) return []
    return carsData[carBrand]
  }, [carBrand])

  const recommendation =
    temperature !== null ? getWeatherRecommendation(temperature) : ''

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleTireCalcSubmit = (e) => {
    e.preventDefault()
    if (!carBrand || !carModel) {
      window.alert('Выберите марку и модель автомобиля.')
      return
    }
    window.alert(
      `Рекомендуем шины для ${carBrand} ${carModel} ${carYear}. Перейдите в каталог для просмотра всех вариантов.`,
    )
  }

  const handleSeasonalityInfo = () => {
    window.alert(
      'Зимняя резина эффективна при низких температурах; летняя — при тепле. В переходный период оцените условия эксплуатации и законодательство вашего региона.',
    )
  }

  return (
    <div className="home">
      <section className="home__welcome">
        <h1>Добро пожаловать в Шинный магазин</h1>
        <p>
          Подберём летние и зимние шины под ваш автомобиль: каталог с ценами,
          доставка и помощь в выборе размера.
        </p>
      </section>

      <section className="home__weather" aria-labelledby="weather-widget-heading">
        <div className="container">
          <div className="home-weather card-like">
            <h3 id="weather-widget-heading">📅 Пора менять резину?</h3>
            {temperature === null ? (
              <p className="home-weather__loading" role="status">
                Loading...
              </p>
            ) : (
              <div className="home-weather__body">
                <WeatherIcon temperature={temperature} />
                <div className="home-weather__info">
                  <p className="home-weather__temp">
                    Сейчас в Минске:{' '}
                    <strong>
                      {temperature > 0 ? '+' : ''}
                      {temperature}°C
                    </strong>
                  </p>
                  <p className="home-weather__hint">{recommendation}</p>
                  <button
                    type="button"
                    className="button secondary home-weather__more"
                    onClick={handleSeasonalityInfo}
                  >
                    Подробнее о сезонности
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="home__banner" aria-label="Акция">
        <div className="home__banner-inner">
          <h2 className="home__banner-title">Скидка на комплект из 4 шин</h2>
          <p className="home__banner-text">
            Оформите заказ до конца месяца и получите бесплатный шиномонтаж в
            нашем сервисе.
          </p>
          <Link to="/catalog" className="home__banner-link">
            Перейти в каталог
          </Link>
        </div>
      </section>

      <TipsSlider />

      <section className="home__tire-calc" aria-labelledby="tire-calc-heading">
        <div className="container">
          <h2 id="tire-calc-heading">Подберите шины по марке автомобиля</h2>
          <form className="home-tire-calc" onSubmit={handleTireCalcSubmit}>
            <div className="home-tire-calc__row">
              <label className="home-tire-calc__label" htmlFor="car-brand">
                Марка автомобиля
              </label>
              <select
                id="car-brand"
                className="home-tire-calc__select"
                value={carBrand}
                onChange={(e) => {
                  setCarBrand(e.target.value)
                  setCarModel('')
                }}
              >
                <option value="">Выберите марку</option>
                {carBrands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="home-tire-calc__row">
              <label className="home-tire-calc__label" htmlFor="car-model">
                Модель
              </label>
              <select
                id="car-model"
                className="home-tire-calc__select"
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
                disabled={!carBrand}
              >
                {!carBrand ? (
                  <option value="">Сначала выберите марку</option>
                ) : (
                  <>
                    <option value="">Выберите модель</option>
                    {modelsForBrand.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
            <div className="home-tire-calc__row">
              <label className="home-tire-calc__label" htmlFor="car-year">
                Год выпуска
              </label>
              <select
                id="car-year"
                className="home-tire-calc__select"
                value={carYear}
                onChange={(e) => setCarYear(e.target.value)}
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="button home-tire-calc__submit">
              Подобрать шины
            </button>
          </form>
        </div>
      </section>

      <section className="home__help" aria-labelledby="help-choice-heading">
        <div className="container">
          <div className="home-help card-like">
            <h2 id="help-choice-heading">Поможем с выбором?</h2>
            <p className="home-help__text">
              Не уверены в размере или сезоне? Напишите нам или загляните в
              каталог — подскажем по автомобилю и бюджету.
            </p>
            <div className="home-help__actions">
              <Link to="/catalog" className="button">
                В каталог
              </Link>
              <Link to="/contacts" className="button secondary">
                Контакты
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home__popular" aria-labelledby="popular-heading">
        <div className="container">
          <h2 id="popular-heading" className="home__section-title">
            Хиты продаж
          </h2>
          <div className="home__grid">
            {POPULAR.map((tire) => (
              <ProductCard key={tire.id} product={tire} />
            ))}
          </div>
        </div>
      </section>

      <section className="home__map" aria-labelledby="map-heading">
        <div className="container">
          <h2 id="map-heading">Как нас найти</h2>
          <p className="home-map__subtitle">
            Наш адрес: г. Минск, ул. Суворова, д. 13
          </p>
          <div className="home-map__frame-wrap">
            <iframe
              src={MAP_IFRAME_SRC}
              width="100%"
              height="400"
              style={{ border: 'none', borderRadius: '12px' }}
              title="Карта проезда"
              allowFullScreen
            />
          </div>
          <ul className="home-map__meta">
            <li>Ежедневно с 9:00 до 21:00</li>
            <li>Бесплатная парковка для клиентов</li>
          </ul>
        </div>
      </section>

      <section className="home__seo" aria-labelledby="seo-text-heading">
        <div className="container">
          <h2 id="seo-text-heading" className="home__seo-title">
            Шины и диски в Минске
          </h2>
          <div className="home-seo-text">
            <p>
              Интернет-магазин шин предлагает летнюю и зимнюю резину, диски и
              аксессуары для легковых автомобилей. Подбор по размеру, доставка,
              гарантия качества и консультации специалистов — чтобы вы уверенно
              выезжали на дорогу в любой сезон.
            </p>
            <p>
              В каталоге представлены проверенные бренды: от бюджетных решений
              до премиальных моделей. Сравнивайте цены, читайте характеристики и
              оформляйте заказ онлайн или в шоуруме на ул. Суворова.
            </p>
          </div>
        </div>
      </section>

      <button
        type="button"
        className="home-scroll-top"
        aria-label="Наверх"
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#e63946',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? 'auto' : 'none',
          transition: 'opacity 0.3s ease, transform 0.3s ease, background-color 0.2s ease',
          transform: 'scale(1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.backgroundColor = '#b71c1c'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.backgroundColor = '#e63946'
        }}
      >
        <FaArrowUp size={22} aria-hidden />
      </button>
    </div>
  )
}
