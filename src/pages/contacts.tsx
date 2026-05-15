import { useState, type FormEvent } from 'react'
import {
  STORE_EMAIL,
  STORE_PHONE,
  STORE_PHONE_TEL,
} from '../constants/contacts'
import { STORE_ADDRESS, YANDEX_MAP_EMBED_URL } from '../constants/yandexMap'
import { useToast } from '../contexts/toastcontext'
import { usePageTitle } from '../hooks/usePageTitle'
import './contacts.css'

export default function Contacts() {
  usePageTitle('Контакты', 'Контакты шинного центра MotoHunters в Минске: адрес, телефон, карта.')
  const { showToast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleFeedbackSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Заполните все поля формы', 'error')
      return
    }
    showToast('Спасибо! Мы свяжемся с вами в ближайшее время')
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
        <div className="contacts-page__left-col">
          <div className="contacts-page__card">
            <h2>Как нас найти</h2>
            <dl className="contacts-page__list">
              <div>
                <dt>Адрес</dt>
                <dd>{STORE_ADDRESS}</dd>
              </div>
              <div>
                <dt>Телефон</dt>
                <dd>
                  <a href={`tel:${STORE_PHONE_TEL}`}>{STORE_PHONE}</a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${STORE_EMAIL}`}>{STORE_EMAIL}</a>
                </dd>
              </div>
            </dl>
          </div>

          <figure className="contacts-page__map-wrap">
            <iframe
              title="Схема проезда — Яндекс.Карты"
              src={YANDEX_MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </figure>
        </div>

        <form
          className="contacts-page__form panel"
          onSubmit={handleFeedbackSubmit}
          noValidate
        >
          <h2>Обратная связь</h2>
          <p className="contacts-page__form-lead">
            Оставьте сообщение — перезвоним или ответим на email.
          </p>

          <label className="contacts-page__label" htmlFor="feedback-name">
            Имя
          </label>
          <input
            id="feedback-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />

          <label className="contacts-page__label" htmlFor="feedback-email">
            Email
          </label>
          <input
            id="feedback-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <label className="contacts-page__label" htmlFor="feedback-message">
            Сообщение
          </label>
          <textarea
            id="feedback-message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <button type="submit" className="button contacts-form__submit">
            Отправить
          </button>
        </form>
      </div>
    </section>
  )
}
