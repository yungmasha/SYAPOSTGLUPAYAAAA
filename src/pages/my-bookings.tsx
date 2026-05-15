import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useBooking } from '../contexts/bookingcontext'
import { usePageTitle } from '../hooks/usePageTitle'
import './my-bookings.css'

function formatRemaining(ms: number) {
  if (ms <= 0) return 'Срок истёк'
  const totalSec = Math.floor(ms / 1000)
  const days = Math.floor(totalSec / 86400)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  return `${days}д ${hours}ч ${minutes}м ${seconds}с`
}

export default function MyBookings() {
  usePageTitle('Мои бронирования')
  const { bookings, removeBooking } = useBooking()
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const activeBookings = useMemo(
    () => bookings.filter((item) => item.expiresAt > now),
    [bookings, now],
  )

  if (activeBookings.length === 0) {
    return (
      <section className="page my-bookings-page">
        <h1>Мои бронирования</h1>
        <p className="my-bookings-page__empty">
          У вас нет активных броней. <Link to="/catalog">Перейти в каталог</Link>
        </p>
      </section>
    )
  }

  return (
    <section className="page my-bookings-page">
      <h1>Мои бронирования</h1>
      <ul className="my-bookings-page__list">
        {activeBookings.map((item) => (
          <li key={item.productId} className="my-bookings-page__item">
            <h2 className="my-bookings-page__title">{item.productName}</h2>
            <p>
              Дата бронирования:{' '}
              {new Date(item.bookedAt).toLocaleString('ru-RU')}
            </p>
            <p>
              Действует до: {new Date(item.expiresAt).toLocaleString('ru-RU')}
            </p>
            <p className="my-bookings-page__countdown">
              Осталось: {formatRemaining(item.expiresAt - now)}
            </p>
            <button
              type="button"
              className="button secondary"
              onClick={() => removeBooking(item.productId)}
            >
              Отменить бронь
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
