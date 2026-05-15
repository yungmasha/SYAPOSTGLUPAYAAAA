import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/authcontext'
import { useToast } from '../contexts/toastcontext'
import { usePageTitle } from '../hooks/usePageTitle'
import './login.css'

export default function Register() {
  usePageTitle('Регистрация')
  const { register } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const emailTrimmed = email.trim()
    const passwordTrimmed = password.trim()
    const confirmTrimmed = confirmPassword.trim()

    if (!emailTrimmed || !passwordTrimmed || !confirmTrimmed) {
      setError('Заполните все поля')
      return
    }

    if (passwordTrimmed !== confirmTrimmed) {
      setError('Пароли не совпадают')
      return
    }

    setSubmitting(true)
    try {
      await register(emailTrimmed, passwordTrimmed)
      showToast('Аккаунт создан! Заполните профиль')
      navigate('/profile', { replace: true })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Не удалось зарегистрироваться'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page auth-page">
      <div className="auth-page__card panel">
        <h1>Регистрация</h1>
        <p className="auth-page__lead">
          Создайте аккаунт — получите личный 8-значный промокод со скидкой 10%.
        </p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error ? (
          <p className="auth-form__error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="auth-form__field">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="auth-form__field">
          <label htmlFor="register-password">Пароль</label>
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="auth-form__field">
          <label htmlFor="register-confirm">Подтверждение пароля</label>
          <input
            id="register-confirm"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={submitting}
          />
        </div>

        <button
          type="submit"
          className="auth-form__submit"
          disabled={submitting}
        >
          {submitting ? 'Регистрация…' : 'Зарегистрироваться'}
        </button>
      </form>

      <p className="auth-form__footer">
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
      </div>
    </section>
  )
}
