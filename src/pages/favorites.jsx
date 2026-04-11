import { useMemo } from 'react'
import { useFavorites } from '../contexts/favoritescontext.jsx'
import { tires } from '../data/tires.js'
import ProductCard from '../components/productcard.jsx'
import './favorites.css'

export default function Favorites() {
  const { favorites } = useFavorites()

  const favoriteProducts = useMemo(() => {
    const byId = new Map(tires.map((t) => [t.id, t]))
    return favorites
      .map((id) => byId.get(id))
      .filter(Boolean)
  }, [favorites])

  return (
    <section className="page favorites-page">
      <h1>Избранное</h1>

      {favoriteProducts.length === 0 ? (
        <p className="favorites-page__empty">Нет избранных товаров</p>
      ) : (
        <div className="favorites-page__grid">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
