import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaHeart, FaImage, FaRegHeart } from 'react-icons/fa'
import { useCart } from '../contexts/cartcontext.jsx'
import { useFavorites } from '../contexts/favoritescontext.jsx'
import { formatByn } from '../utils/currency.js'
import './productcard.css'

export default function ProductCard({ product, compact = false }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const inFavorites = isFavorite(product.id)

  const productUrl = `/product/${product.id}`
  const title = `${product.brand} ${product.name}`
  const FavIcon = inFavorites ? FaHeart : FaRegHeart

  return (
    <article
      className={`product-card${compact ? ' product-card--compact' : ''}`}
    >
      <div className="product-card__body">
        <Link
          to={productUrl}
          className="product-card__media-link"
          aria-label={`Открыть товар: ${title}`}
        >
          <div className="product-card__image-wrap">
            {!imageLoaded && (
              <div className="image-skeleton product-card__skeleton" aria-hidden>
                <FaImage
                  className="product-card__skeleton-icon"
                  size={compact ? 28 : 36}
                  aria-hidden
                />
              </div>
            )}
            <img
              className={`product-card__img${imageLoaded ? ' product-card__img--loaded' : ''}`}
              src={product.image}
              alt={product.name}
              width={200}
              height={200}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </Link>
        <Link to={productUrl} className="product-card__title-link">
          <h3 className="product-card__title">{title}</h3>
        </Link>
        <p className="product-card__price">{formatByn(product.price)}</p>
      </div>
      <div className="product-card__actions">
        <button
          type="button"
          className="product-card__cart-btn"
          onClick={() => addToCart(product)}
        >
          В корзину
        </button>
        <button
          type="button"
          className={`product-card__fav-btn${inFavorites ? ' product-card__fav-btn--active' : ''}`}
          onClick={() =>
            inFavorites
              ? removeFromFavorites(product.id)
              : addToFavorites(product.id)
          }
          aria-label={
            inFavorites ? 'Убрать из избранного' : 'Добавить в избранное'
          }
          aria-pressed={inFavorites}
        >
          <FavIcon className="product-card__fav-icon" size={20} aria-hidden />
        </button>
      </div>
    </article>
  );
}
