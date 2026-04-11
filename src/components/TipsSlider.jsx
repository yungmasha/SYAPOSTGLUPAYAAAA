import { useCallback, useEffect, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import './tips-slider.css'

const SLIDES = [
  {
    title: 'Индекс скорости и нагрузки',
    text: 'Не ставьте шины с индексом нагрузки ниже, чем указано в паспорте автомобиля — это влияет на безопасность и износ.',
  },
  {
    title: 'Сезонность',
    text: 'Зимние шины целесообразно менять при стабильной температуре ниже +7 °C. Летняя резина на морозе теряет эластичность.',
  },
  {
    title: 'Давление в шинах',
    text: 'Проверяйте давление на холодных шинах раз в месяц и перед дальними поездками — экономия топлива и ровный износ протектора.',
  },
  {
    title: 'Глубина протектора',
    text: 'Для лета минимум 1,6 мм по закону; для зимы фрикционных шин рекомендуют не менее 4 мм к началу сезона.',
  },
  {
    title: 'Сборка комплекта',
    text: 'На одной оси ставьте шины одного типоразмера, рисунка и степени износа — иначе ухудшается управляемость и ABS.',
  },
]

const AUTO_MS = 7000

export default function TipsSlider() {
  const [index, setIndex] = useState(0)
  const count = SLIDES.length

  const go = useCallback((delta) => {
    setIndex((i) => (i + delta + count) % count)
  }, [count])

  useEffect(() => {
    const t = setInterval(() => go(1), AUTO_MS)
    return () => clearInterval(t)
  }, [go])

  const slide = SLIDES[index]

  return (
    <section className="tips-slider" aria-roledescription="carousel" aria-label="Полезные советы">
      <h2 className="tips-slider__heading">Полезно знать</h2>
      <div className="tips-slider__viewport">
        <button
          type="button"
          className="tips-slider__nav tips-slider__nav--prev"
          onClick={() => go(-1)}
          aria-label="Предыдущий слайд"
        >
          <FaChevronLeft aria-hidden />
        </button>
        <div className="tips-slider__slide" key={index}>
          <h3 className="tips-slider__title">{slide.title}</h3>
          <p className="tips-slider__text">{slide.text}</p>
        </div>
        <button
          type="button"
          className="tips-slider__nav tips-slider__nav--next"
          onClick={() => go(1)}
          aria-label="Следующий слайд"
        >
          <FaChevronRight aria-hidden />
        </button>
      </div>
      <div className="tips-slider__mobile-nav">
        <button
          type="button"
          className="tips-slider__nav"
          onClick={() => go(-1)}
          aria-label="Предыдущий слайд"
        >
          <FaChevronLeft aria-hidden />
        </button>
        <button
          type="button"
          className="tips-slider__nav"
          onClick={() => go(1)}
          aria-label="Следующий слайд"
        >
          <FaChevronRight aria-hidden />
        </button>
      </div>
      <div className="tips-slider__dots" role="tablist" aria-label="Выбор слайда">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Слайд ${i + 1}`}
            className={`tips-slider__dot${i === index ? ' tips-slider__dot--active' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  )
}
