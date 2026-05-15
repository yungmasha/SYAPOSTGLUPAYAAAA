import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/authcontext'
import { useToast } from '../contexts/toastcontext'
import { usePageTitle } from '../hooks/usePageTitle'
import './login.css'

export default function Login() {
  usePageTitle('Вход')
  const { login, user, isAuthReady } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? '/profile'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isAuthReady) {
    return (
      <section className="page login-page">
        <p>Загрузка…</p>
      </section>
    )
  }

  if (user) {
    return <Navigate to={redirectTo} replace />
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const emailTrimmed = email.trim()
    const passwordTrimmed = password.trim()

    if (!emailTrimmed || !passwordTrimmed) {
      setError('Заполните email и пароль')
      return
    }

    setSubmitting(true)
    try {
      await login(emailTrimmed, passwordTrimmed)
      showToast('Добро пожаловать!')
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Не удалось выполнить вход'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page auth-page">
      <div className="auth-page__card panel">
        <h1>Вход</h1>
        <p className="auth-page__lead">
          Войдите в аккаунт, чтобы сохранить профиль и использовать личный промокод.
        </p>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {error ? (
          <p className="auth-form__error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="auth-form__field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="auth-form__field">
          <label htmlFor="login-password">Пароль</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
          />
        </div>

        <button
          type="submit"
          className="auth-form__submit"
          disabled={submitting}
        >
          {submitting ? 'Вход…' : 'Войти'}
        </button>
      </form>

      <p className="auth-form__footer">
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
      </div>
    </section>
  )
}
