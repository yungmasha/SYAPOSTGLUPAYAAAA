import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaTruck, FaShieldAlt, FaClock, FaThumbsUp } from 'react-icons/fa'
import './about.css'

/*
 * Meta (при подключении react-helmet-async или аналога):
 * title: О компании — Шинный магазин
 * description: Шинный центр: продажа шин и дисков, более 10 лет на рынке,
 *   доставка, гарантия и консультации. Узнайте историю компании и преимущества.
 */

const advantages = [
  {
    icon: FaTruck,
    title: 'Быстрая доставка',
    text: 'Отправляем заказы по городу и региону в кратчайшие сроки. Отслеживание и аккуратная упаковка.',
  },
  {
    icon: FaShieldAlt,
    title: 'Гарантия качества',
    text: 'Работаем только с официальными поставками. На шины и диски — гарантия производителя.',
  },
  {
    icon: FaClock,
    title: 'Опытные консультанты',
    text: 'Поможем подобрать размер, индекс нагрузки и сезонность под ваш автомобиль и стиль езды.',
  },
  {
    icon: FaThumbsUp,
    title: 'Низкие цены',
    text: 'Регулярные акции и прозрачное ценообразование без скрытых доплат.',
  },
]

const timeline = [
  { year: '2014', text: 'Открытие первого шоурума и запуск продаж шин и дисков.' },
  { year: '2017', text: 'Расширение склада и партнёрство с ведущими брендами.' },
  { year: '2020', text: 'Запуск онлайн-каталога и доставки по региону.' },
  { year: '2024', text: 'Более 5000 довольных клиентов и круглосуточная линия поддержки.' },
]

const team = [
  {
    name: 'Алексей Орлов',
    role: 'Руководитель отдела продаж',
    bio: '12 лет в автобизнесе, подбор шин для легковых и коммерческих авто.',
  },
  {
    name: 'Мария Соколова',
    role: 'Старший консультант',
    bio: 'Сертифицированный специалист по шинам, помогает с размерностью и сезоном.',
  },
  {
    name: 'Дмитрий Волков',
    role: 'Логистика и доставка',
    bio: 'Организует отгрузки и контроль сроков — от склада до вашего адреса.',
  },
]

const partners = [
  'Michelin',
  'Bridgestone',
  'Continental',
  'Pirelli',
  'Yokohama',
  'Goodyear',
]

const stats = [
  { value: '10+', label: 'лет на рынке' },
  { value: '5000+', label: 'довольных клиентов' },
  { value: '100+', label: 'брендов в каталоге' },
  { value: '24/7', label: 'поддержка онлайн' },
]

export default function About() {
  const [pageVisible, setPageVisible] = useState(false)

  useEffect(() => {
    const prevTitle = document.title
    document.title = 'О компании — Шинный магазин'

    const metaDesc = document.querySelector('meta[name="description"]')
    const prevDesc = metaDesc?.getAttribute('content') ?? null
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Шинный центр: продажа шин и дисков, история компании, преимущества и команда. Более 10 лет на рынке.',
      )
    }

    setPageVisible(true)

    return () => {
      document.title = prevTitle
      if (metaDesc && prevDesc !== null) {
        metaDesc.setAttribute('content', prevDesc)
      }
    }
  }, [])

  return (
    <div className={`about-page ${pageVisible ? 'fade-in' : ''}`}>
      <section className="about-hero" aria-labelledby="about-hero-heading">
        <div className="container p-3">
          <h1 id="about-hero-heading">О компании</h1>
          <p className="about-hero__lead">
            Мы специализируемся на продаже легковых и коммерческих шин, а также
            дисков разных диаметров и типов посадки. На рынке более десяти лет
            помогаем водителям подобрать надёжную резину и ободы под любые
            условия эксплуатации.
          </p>
        </div>
      </section>

      <div className="container mt-4 mb-4">
        <section className="about-section mb-4" aria-labelledby="history-heading">
          <h2 id="history-heading">Наша история</h2>
          <p className="mt-2 mb-2">
            Компания была основана небольшой командой энтузиастов, которые хотели
            сделать покупку шин понятной и честной: без навязанных услуг и с
            прозрачными ценами. Со временем мы выросли из точки продаж в полноценный
            шинный центр с собственным складом и сервисом подбора.
          </p>
          <p className="mb-2">
            Мы инвестировали в обучение персонала и партнёрства с мировыми
            производителями, чтобы предлагать актуальные модели сезона и редкие
            размеры под заказ. Нам доверяют как частные клиенты, так и небольшие
            автопарки.
          </p>
          <p className="mb-2">
            Развитие онлайн-каталога позволило охватить клиентов за пределами города:
            доставка, консультации по телефону и чату стали такими же важными, как
            визит в шоурум.
          </p>
          <p className="mb-3">
            Сегодня мы гордимся стабильными сроками поставок, гарантией на товар и
            командой, которая отвечает на вопросы даже в нерабочее время через
            каналы поддержки.
          </p>

          <ul className="about-timeline mt-3">
            {timeline.map((item) => (
              <li key={item.year} className="about-timeline__item">
                <span className="about-timeline__year">{item.year}</span>
                <span className="about-timeline__text">{item.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="about-section mb-4" aria-labelledby="advantages-heading">
          <h2 id="advantages-heading" className="mb-3">
            Почему выбирают нас
          </h2>
          <div className="grid-4">
            {advantages.map(({ icon: Icon, title, text }) => (
              <article key={title} className="product-card flex-column">
                <Icon className="about-advantage-icon" aria-hidden size={28} />
                <h3 className="about-card-title">{title}</h3>
                <p className="about-card-text">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section mb-4" aria-labelledby="team-heading">
          <h2 id="team-heading" className="mb-3">
            Наша команда
          </h2>
          <div className="grid-3">
            {team.map((member) => (
              <article key={member.name} className="product-card">
                <div className="about-team__photo">Фото</div>
                <h3 className="about-card-title about-card-title--tight">{member.name}</h3>
                <p className="about-role">{member.role}</p>
                <p className="about-card-text">{member.bio}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section mb-4" aria-labelledby="partners-heading">
          <h2 id="partners-heading" className="mb-3">
            Наши партнёры
          </h2>
          <div className="grid-4">
            {partners.map((name) => (
              <div
                key={name}
                className="flex-center product-card about-partner-card"
              >
                {name}
              </div>
            ))}
          </div>
        </section>

        <section className="about-section mb-4" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="mb-3">
            Мы в цифрах
          </h2>
          <div className="grid-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="product-card about-stat">
                <div className="about-stat__value">{value}</div>
                <p className="about-stat__label">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="about-cta product-card mt-3 mb-2"
          aria-labelledby="about-cta-heading"
        >
          <div className="flex-between flex-column about-cta__inner">
            <div>
              <h3 id="about-cta-heading" className="about-cta__title">
                Готовы подобрать шины для вашего авто?
              </h3>
              <p className="about-cta__text">
                Откройте каталог и найдите подходящую модель по размеру и сезону.
              </p>
            </div>
            <Link to="/catalog" className="button">
              Перейти в каталог
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
