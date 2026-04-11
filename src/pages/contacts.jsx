import { useState } from 'react'
import './contacts.css'

const ADDRESS =
  '125009, г. Москва, ул. Тверская, 7 стр. 1 (условный адрес для демонстрации)'
const PHONE = '+7 (495) 123-45-67'
const PHONE_TEL = '+74951234567'
const EMAIL = 'hello@tire-shop.demo'

/** Схема проезда: виджет Яндекс.Карт (центр — Тверская, Москва). */
const YANDEX_MAP_EMBED =
  'https://yandex.ru/map-widget/v1/?ll=37.605560%2C55.761870&z=16&l=map&pt=37.605560%2C55.761870%2Cpm2rdm'

export default function Contacts() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleFeedbackSubmit = (e) => {
    e.preventDefault()
    window.alert(
      'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.'
    )
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <section className="page contacts-page">
      <h1>Контакты</h1>
      <p className="contacts-page__intro">
        Приезжайте в шоурум, звоните или пишите — подберём шины и ответим на
        вопросы.
      </p>

      <div className="contacts-page__grid">
        <div className="contacts-page__card">
          <h2>Как нас найти</h2>
          <dl className="contacts-page__list">
            <div>
              <dt>Адрес</dt>
              <dd>{ADDRESS}</dd>
            </div>
            <div>
              <dt>Телефон</dt>
              <dd>
                <a href={`tel:${PHONE_TEL}`}>{PHONE}</a>
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </dd>
            </div>
          </dl>
        </div>

        <figure className="contacts-page__map-wrap">
          <iframe
            title="Схема проезда — Яндекс.Карты"
            src={YANDEX_MAP_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </figure>
      </div>

      <section
        className="contacts-page__form-section"
        aria-labelledby="contacts-feedback-heading"
      >
        <h2 id="contacts-feedback-heading">Обратная связь</h2>
        <p className="contacts-page__form-hint">
          Оставьте сообщение — мы ответим на указанный email.
        </p>

        <form className="contacts-form" onSubmit={handleFeedbackSubmit}>
          <div className="contacts-form__field">
            <label htmlFor="feedback-name">Имя</label>
            <input
              id="feedback-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="contacts-form__field">
            <label htmlFor="feedback-email">Email</label>
            <input
              id="feedback-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="contacts-form__field">
            <label htmlFor="feedback-message">Сообщение</label>
            <textarea
              id="feedback-message"
              name="message"
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button type="submit" className="contacts-form__submit">
            Отправить
          </button>
        </form>
      </section>
    </section>
  )
}
