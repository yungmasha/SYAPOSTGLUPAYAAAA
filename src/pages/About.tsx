import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { FaTruck, FaShieldAlt, FaClock, FaThumbsUp } from 'react-icons/fa'
import { usePageTitle } from '../hooks/usePageTitle'
import './about.css'

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
    name: 'Алясова Анна',
    role: 'Руководитель отдела продаж',
    bio: '12 лет в автобизнесе, подбор шин для легковых и коммерческих авто.',
  },
  {
    name: 'Ерш Мария',
    role: 'Старший консультант',
    bio: 'Сертифицированный специалист по шинам, помогает с размерностью и сезоном.',
  },
  {
    name: 'Ковальчук Арсений',
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
  usePageTitle(
    'О компании',
    'Шинный центр MotoHunters: история, преимущества, команда и партнёры. Более 10 лет на рынке.',
  )
  const [pageVisible, setPageVisible] = useState(false)

  useEffect(() => {
    setPageVisible(true)
  }, [])

  return (
    <div className={`about-page page${pageVisible ? ' fade-in' : ''}`}>
      <header className="about-hero">
        <h1>О компании</h1>
        <p className="about-hero__lead">
          Мы специализируемся на продаже легковых и коммерческих шин, а также
          дисков разных диаметров и типов посадки. На рынке более десяти лет
          помогаем водителям подобрать надёжную резину и ободы под любые
          условия эксплуатации.
        </p>
      </header>

      <div className="about-content">
        <section className="about-block" aria-labelledby="history-heading">
          <h2 id="history-heading">Наша история</h2>
          <div className="about-block__text">
            <p>
              Компания была основана небольшой командой энтузиастов, которые хотели
              сделать покупку шин понятной и честной: без навязанных услуг и с
              прозрачными ценами. Со временем мы выросли из точки продаж в полноценный
              шинный центр с собственным складом и сервисом подбора.
            </p>
            <p>
              Мы инвестировали в обучение персонала и партнёрства с мировыми
              производителями, чтобы предлагать актуальные модели сезона и редкие
              размеры под заказ. Нам доверяют как частные клиенты, так и небольшие
              автопарки.
            </p>
            <p>
              Развитие онлайн-каталога позволило охватить клиентов за пределами города:
              доставка, консультации по телефону и чату стали такими же важными, как
              визит в шоурум.
            </p>
            <p>
              Сегодня мы гордимся стабильными сроками поставок, гарантией на товар и
              командой, которая отвечает на вопросы даже в нерабочее время через
              каналы поддержки.
            </p>
          </div>

          <ul className="about-timeline">
            {timeline.map((item) => (
              <li key={item.year} className="about-timeline__item">
                <span className="about-timeline__year">{item.year}</span>
                <span className="about-timeline__text">{item.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="about-block" aria-labelledby="advantages-heading">
          <h2 id="advantages-heading">Почему выбирают нас</h2>
          <ul className="about-cards about-cards--4">
            {advantages.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <article className="about-card">
                  <Icon className="about-advantage-icon" aria-hidden size={28} />
                  <h3 className="about-card__title">{title}</h3>
                  <p className="about-card__text">{text}</p>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section className="about-block" aria-labelledby="team-heading">
          <h2 id="team-heading">Наша команда</h2>
          <ul className="about-cards about-cards--3">
            {team.map((member) => (
              <li key={member.name}>
                <article className="about-card">
                  <div className="about-team__photo" aria-hidden>
                    Фото
                  </div>
                  <h3 className="about-card__title">{member.name}</h3>
                  <p className="about-role">{member.role}</p>
                  <p className="about-card__text">{member.bio}</p>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section className="about-block" aria-labelledby="partners-heading">
          <h2 id="partners-heading">Наши партнёры</h2>
          <ul className="about-showcase about-showcase--partners">
            {partners.map((name, i) => (
              <li key={name} style={{ '--stagger': i } as CSSProperties}>
                <div className="about-partner-tile">
                  <span className="about-partner-tile__name">{name}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="about-block" aria-labelledby="stats-heading">
          <h2 id="stats-heading">Мы в цифрах</h2>
          <ul className="about-showcase about-showcase--stats">
            {stats.map(({ value, label }, i) => (
              <li key={label} style={{ '--stagger': i } as CSSProperties}>
                <article className="about-stat-tile">
                  <div className="about-stat-tile__value">{value}</div>
                  <p className="about-stat-tile__label">{label}</p>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section className="about-cta" aria-labelledby="about-cta-heading">
          <div className="about-cta__inner">
            <div className="about-cta__copy">
              <h2 id="about-cta-heading" className="about-cta__title">
                Готовы подобрать шины для вашего авто?
              </h2>
              <p className="about-cta__text">
                Откройте каталог и найдите подходящую модель по размеру и сезону.
              </p>
            </div>
            <Link to="/catalog" className="button about-cta__btn">
              Перейти в каталог
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
