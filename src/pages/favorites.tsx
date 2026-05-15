import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FaHeart, FaShoppingCart, FaBalanceScale } from 'react-icons/fa'
import { useFavorites } from '../contexts/favoritescontext'
import { tires } from '../data/tires'
import type { Tire } from '../types/tire'
import ProductCard from '../components/productcard'
import { usePageTitle } from '../hooks/usePageTitle'
import './favorites.css'

const TIPS = [
  {
    icon: FaHeart,
    title: 'Сохраняйте варианты',
    text: 'Добавляйте понравившиеся модели, чтобы сравнить цены и характеристики позже.',
  },
  {
    icon: FaBalanceScale,
    title: 'Сравнивайте',
    text: 'Из избранного удобно отправлять шины в сравнение — до 3 моделей одновременно.',
  },
  {
    icon: FaShoppingCart,
    title: 'Покупайте выгодно',
    text: 'Комплект из 4 шин даёт скидку 5% — оформите заказ прямо из каталога.',
  },
]

export default function Favorites() {
  usePageTitle('Избранное')
  const { favorites } = useFavorites()

  const favoriteProducts = useMemo(() => {
    const byId = new Map(tires.map((t) => [t.id, t]))
    return favorites
      .map((id) => byId.get(id))
      .filter((p): p is Tire => p !== undefined)
  }, [favorites])

  return (
    <section className="page favorites-page">
      <header className="favorites-page__head">
        <h1>Избранное</h1>
        <p className="favorites-page__count">Сохранено товаров: {favoriteProducts.length}</p>
      </header>

      {favoriteProducts.length === 0 ? (
        <div className="favorites-page__empty">
          <div className="favorites-page__empty-icon" aria-hidden>
            <FaHeart />
          </div>
          <p>Пока пусто — нажмите ♥ на карточке товара в каталоге</p>
          <Link to="/catalog" className="button">
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <>
          <div className="favorites-page__grid">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <aside className="favorites-page__extras" aria-label="Подсказки">
            <h2 className="favorites-page__extras-title">Зачем избранное?</h2>
            <ul className="favorites-page__tips">
              {TIPS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="favorites-tip">
                  <span className="favorites-tip__icon" aria-hidden>
                    <Icon />
                  </span>
                  <div>
                    <h3 className="favorites-tip__title">{title}</h3>
                    <p className="favorites-tip__text">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="favorites-page__cta-row">
              <Link to="/catalog" className="button">
                Добавить ещё из каталога
              </Link>
              <Link to="/compare" className="button secondary">
                Сравнить выбранные
              </Link>
            </div>
          </aside>
        </>
      )}
    </section>
  )
}
