import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { tires } from '../data/tires.js'
import { formatByn } from '../utils/currency.js'
import { useCart } from '../contexts/cartcontext.jsx'
import { useFavorites } from '../contexts/favoritescontext.jsx'
import ProductCard from '../components/productcard.jsx'
import './productdetail.css'

function getSimilarProducts(current) {
  return tires
    .filter(
      (t) =>
        t.id !== current.id &&
        (t.brand === current.brand || t.size === current.size)
    )
    .sort((a, b) => {
      const aScore =
        (a.brand === current.brand ? 2 : 0) + (a.size === current.size ? 1 : 0)
      const bScore =
        (b.brand === current.brand ? 2 : 0) + (b.size === current.size ? 1 : 0)
      if (bScore !== aScore) return bScore - aScore
      return a.name.localeCompare(b.name, 'ru')
    })
}

export default function ProductDetail() {
  const { id } = useParams()
  const numericId = Number(id)
  const product = tires.find((t) => t.id === numericId)

  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const inFavorites = product ? isFavorite(product.id) : false
  const FavIcon = inFavorites ? FaHeart : FaRegHeart

  const similarProducts = useMemo(
    () => (product ? getSimilarProducts(product) : []),
    [product]
  )

  if (!product) {
    return (
      <section className="page">
        <h1>Товар не найден</h1>
        <p>
          <Link to="/catalog">Вернуться в каталог</Link>
        </p>
      </section>
    )
  }

  const fullTitle = `${product.brand} ${product.name}`

  return (
    <section className="page page--detail product-detail">
      <Link to="/catalog" className="product-detail__back">
        ← Каталог
      </Link>

      <div className="product-detail__grid">
        <figure className="product-detail__media">
          <img
            src={product.image}
            alt={fullTitle}
            width={420}
            height={420}
            loading="eager"
          />
        </figure>

        <div>
          <h1 className="product-detail__title">{product.name}</h1>
          <p className="product-detail__brand">
            Бренд: <strong>{product.brand}</strong>
          </p>

          <dl className="product-detail__specs">
            <div>
              <dt>Размер</dt>
              <dd>{product.size}</dd>
            </div>
            <div>
              <dt>Сезон</dt>
              <dd>{product.season}</dd>
            </div>
          </dl>

          <p className="product-detail__price">{formatByn(product.price)}</p>

          <p className="product-detail__desc">{product.description}</p>

          <div className="product-detail__actions">
            <button
              type="button"
              className="product-detail__cart-btn"
              onClick={() => addToCart(product)}
            >
              В корзину
            </button>
            <button
              type="button"
              className={`product-detail__fav-btn${inFavorites ? ' product-detail__fav-btn--active' : ''}`}
              onClick={() =>
                inFavorites
                  ? removeFromFavorites(product.id)
                  : addToFavorites(product.id)
              }
              aria-pressed={inFavorites}
              aria-label={
                inFavorites ? 'Убрать из избранного' : 'Добавить в избранное'
              }
            >
              <FavIcon className="product-detail__fav-icon" size={20} aria-hidden />
              {inFavorites ? 'В избранном' : 'В избранное'}
            </button>
          </div>
        </div>
      </div>

      <section className="product-detail__similar" aria-labelledby="similar-heading">
        <h2 id="similar-heading">Похожие товары</h2>
        {similarProducts.length === 0 ? (
          <p className="product-detail__similar-empty">
            Пока нет других позиций с тем же брендом или размером.
          </p>
        ) : (
          <div className="product-detail__similar-grid">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </section>
  )
}
