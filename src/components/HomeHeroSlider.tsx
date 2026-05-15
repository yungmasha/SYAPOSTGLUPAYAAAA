import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { Link } from 'react-router-dom'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import './home-hero-slider.css'

const AUTO_MS = 7000

const SLIDES = [
  {
    id: 'brand',
    eyebrow: 'Шинный центр · Минск',
    title: 'MotoHunters',
    text: 'Летняя и зимняя резина, подбор по автомобилю и помощь специалистов — от выбора размера до монтажа.',
    image:
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1920&q=80',
    ctaPrimary: { label: 'Открыть каталог', to: '/catalog' },
    ctaSecondary: { label: 'О компании', to: '/about' },
  },
  {
    id: 'pick',
    eyebrow: 'Подбор за минуту',
    title: 'Шины под ваш автомобиль',
    text: 'Укажите марку, модель и год — подберём размер и откроем каталог с готовым фильтром.',
    image:
      'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&w=1920&q=80',
    ctaPrimary: { label: 'Подобрать шины', to: '/catalog' },
    ctaSecondary: { label: 'Контакты', to: '/contacts' },
  },
  {
    id: 'promo',
    eyebrow: 'Акция',
    title: 'Комплект из 4 шин',
    text: 'Скидка 5% на комплект и бесплатный шиномонтаж в сервисе при заказе до конца месяца.',
    image:
      'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1920&q=80',
    ctaPrimary: { label: 'Смотреть каталог', to: '/catalog' },
    ctaSecondary: { label: 'Как нас найти', to: '/contacts' },
  },
] as const

export default function HomeHeroSlider() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = SLIDES.length
  const rootRef = useRef<HTMLElement>(null)

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count)
    },
    [count],
  )

  const go = useCallback(
    (delta: number) => {
      goTo(index + delta)
    },
    [goTo, index],
  )

  useEffect(() => {
    if (paused) return undefined
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, AUTO_MS)
    return () => window.clearInterval(timer)
  }, [paused, count])

  const slide = SLIDES[index]
  const progressStyle = {
    '--hero-progress': `${((index + 1) / count) * 100}%`,
  } as CSSProperties

  return (
    <section
      ref={rootRef}
      className="hero-slider"
      aria-roledescription="carousel"
      aria-label="Презентация MotoHunters"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) {
          setPaused(false)
        }
      }}
    >
      <div className="hero-slider__viewport">
        <div
          className="hero-slider__media-track"
          style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
          aria-hidden
        >
          {SLIDES.map((item, i) => (
            <div key={item.id} className="hero-slider__media-slide">
              <img
                src={item.image}
                alt=""
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
        </div>

        <div className="hero-slider__overlay" aria-hidden />

        <div className="hero-slider__content">
          <div className="hero-slider__content-inner" key={slide.id}>
            <p className="hero-slider__eyebrow">{slide.eyebrow}</p>
            {index === 0 ? (
              <h1 className="hero-slider__title">{slide.title}</h1>
            ) : (
              <h2 className="hero-slider__title">{slide.title}</h2>
            )}
            <p className="hero-slider__text">{slide.text}</p>
            <div className="hero-slider__actions">
              <Link to={slide.ctaPrimary.to} className="button hero-slider__btn">
                {slide.ctaPrimary.label}
              </Link>
              <Link
                to={slide.ctaSecondary.to}
                className="button secondary hero-slider__btn hero-slider__btn--ghost"
              >
                {slide.ctaSecondary.label}
              </Link>
            </div>
          </div>
        </div>

        <footer className="hero-slider__bar">
          <div className="hero-slider__dots" role="tablist" aria-label="Выбор слайда">
            {SLIDES.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={item.title}
                className={`hero-slider__dot${i === index ? ' hero-slider__dot--active' : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          <div className="hero-slider__nav-group">
            <button
              type="button"
              className="hero-slider__nav"
              onClick={() => go(-1)}
              aria-label="Предыдущий слайд"
            >
              <FaChevronLeft aria-hidden />
            </button>
            <button
              type="button"
              className="hero-slider__nav"
              onClick={() => go(1)}
              aria-label="Следующий слайд"
            >
              <FaChevronRight aria-hidden />
            </button>
          </div>
        </footer>

        <div className="hero-slider__progress" aria-hidden style={progressStyle} />
      </div>
    </section>
  )
}
