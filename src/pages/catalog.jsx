import { useCallback, useEffect, useMemo, useState } from 'react'
import { tires } from '../data/tires.js'
import ProductCard from '../components/productcard.jsx'
import { formatByn } from '../utils/currency.js'
import './catalog.css'

const ITEMS_PER_PAGE = 9

const RIM_OPTIONS = [
  'R13',
  'R14',
  'R15',
  'R16',
  'R17',
  'R18',
  'R19',
  'R20',
]

const priceList = tires.map((t) => t.price)
const ABS_MIN_PRICE = Math.min(...priceList)
const ABS_MAX_PRICE = Math.max(...priceList)

const BRANDS = [...new Set(tires.map((t) => t.brand))].sort((a, b) =>
  a.localeCompare(b, 'ru'),
)
const SEASONS = [...new Set(tires.map((t) => t.season))]

const SORT_OPTIONS = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
  { value: 'name-asc', label: 'По названию (А-Я)' },
]

function sortTires(list, sortBy) {
  const next = [...list]
  switch (sortBy) {
    case 'price-asc':
      return next.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return next.sort((a, b) => b.price - a.price)
    case 'name-asc':
      return next.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
    case 'default':
    default:
      return next.sort((a, b) => a.id - b.id)
  }
}

function matchesSearch(t, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    t.brand.toLowerCase().includes(q) || t.name.toLowerCase().includes(q)
  )
}

function applyFilters(
  source,
  selectedBrands,
  selectedRims,
  season,
  priceMin,
  priceMax,
  searchQuery,
) {
  return source.filter((t) => {
    if (selectedBrands.length && !selectedBrands.includes(t.brand)) {
      return false
    }
    if (selectedRims.length && !selectedRims.includes(t.rim)) {
      return false
    }
    if (season && t.season !== season) {
      return false
    }
    if (t.price < priceMin || t.price > priceMax) {
      return false
    }
    if (!matchesSearch(t, searchQuery)) {
      return false
    }
    return true
  })
}

export default function Catalog() {
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedRims, setSelectedRims] = useState([])
  const [season, setSeason] = useState('')
  const [priceMin, setPriceMin] = useState(ABS_MIN_PRICE)
  const [priceMax, setPriceMax] = useState(ABS_MAX_PRICE)
  const [sortBy, setSortBy] = useState('default')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 450)
    return () => window.clearTimeout(t)
  }, [])

  const filteredProducts = useMemo(() => {
    const filtered = applyFilters(
      tires,
      selectedBrands,
      selectedRims,
      season,
      priceMin,
      priceMax,
      searchQuery,
    )
    return sortTires(filtered, sortBy)
  }, [
    selectedBrands,
    selectedRims,
    season,
    priceMin,
    priceMax,
    searchQuery,
    sortBy,
  ])

  const totalCount = filteredProducts.length
  const totalPages =
    totalCount === 0 ? 0 : Math.ceil(totalCount / ITEMS_PER_PAGE)
  const safePage =
    totalPages === 0 ? 1 : Math.min(currentPage, Math.max(1, totalPages))

  const pageItems = useMemo(() => {
    if (totalPages === 0) return []
    const start = (safePage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProducts, safePage, totalPages])

  const rangeFrom = totalCount === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1
  const rangeTo = totalCount === 0 ? 0 : Math.min(safePage * ITEMS_PER_PAGE, totalCount)

  const resetFilters = useCallback(() => {
    setSelectedBrands([])
    setSelectedRims([])
    setSeason('')
    setPriceMin(ABS_MIN_PRICE)
    setPriceMax(ABS_MAX_PRICE)
    setSortBy('default')
    setSearchQuery('')
    setCurrentPage(1)
  }, [])

  const goToPage = useCallback((pageNumber) => {
    setCurrentPage(pageNumber)
  }, [])

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    )
    setCurrentPage(1)
  }

  const toggleRim = (rim) => {
    setSelectedRims((prev) =>
      prev.includes(rim) ? prev.filter((r) => r !== rim) : [...prev, rim],
    )
    setCurrentPage(1)
  }

  const onMinPriceChange = (e) => {
    const v = Number(e.target.value)
    setPriceMin(v)
    setPriceMax((max) => (v > max ? v : max))
    setCurrentPage(1)
  }

  const onMaxPriceChange = (e) => {
    const v = Number(e.target.value)
    setPriceMax(v)
    setPriceMin((min) => (v < min ? v : min))
    setCurrentPage(1)
  }

  const onSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const formatPrice = (n) => formatByn(n)

  const pageNumbers = useMemo(
    () =>
      totalPages > 0 ? Array.from({ length: totalPages }, (_, i) => i + 1) : [],
    [totalPages],
  )

  return (
    <section className="page page--catalog catalog">
      <h1>Каталог</h1>
      <div className="catalog__layout">
        <aside className="catalog__filters" aria-label="Фильтры каталога">
          <h2>Фильтры</h2>

          <fieldset className="catalog__fieldset">
            <legend className="catalog__legend">Бренд</legend>
            <ul className="catalog__checkbox-list">
              {BRANDS.map((brand) => (
                <li key={brand}>
                  <label className="catalog__check-label">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                    />
                    {brand}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>

          <fieldset className="catalog__fieldset">
            <legend className="catalog__legend">Диаметр (обод)</legend>
            <ul className="catalog__checkbox-list">
              {RIM_OPTIONS.map((rim) => (
                <li key={rim}>
                  <label className="catalog__check-label">
                    <input
                      type="checkbox"
                      checked={selectedRims.includes(rim)}
                      onChange={() => toggleRim(rim)}
                    />
                    {rim}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>

          <fieldset className="catalog__fieldset">
            <legend className="catalog__legend">Сезон</legend>
            <ul className="catalog__radio-list">
              <li>
                <label className="catalog__radio-label">
                  <input
                    type="radio"
                    name="catalog-season"
                    checked={season === ''}
                    onChange={() => {
                      setSeason('')
                      setCurrentPage(1)
                    }}
                  />
                  Любой
                </label>
              </li>
              {SEASONS.map((s) => (
                <li key={s}>
                  <label className="catalog__radio-label">
                    <input
                      type="radio"
                      name="catalog-season"
                      checked={season === s}
                      onChange={() => {
                        setSeason(s)
                        setCurrentPage(1)
                      }}
                    />
                    {s}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>

          <fieldset className="catalog__fieldset">
            <legend className="catalog__legend">Цена</legend>
            <div className="catalog__price-row">
              <p className="catalog__price-values">
                От {formatPrice(priceMin)} — до {formatPrice(priceMax)}
              </p>
              <div>
                <span className="catalog__range-label" id="catalog-min-label">
                  Минимум
                </span>
                <input
                  type="range"
                  className="catalog__range"
                  min={ABS_MIN_PRICE}
                  max={ABS_MAX_PRICE}
                  step={1}
                  value={priceMin}
                  onChange={onMinPriceChange}
                  aria-labelledby="catalog-min-label"
                />
              </div>
              <div>
                <span className="catalog__range-label" id="catalog-max-label">
                  Максимум
                </span>
                <input
                  type="range"
                  className="catalog__range"
                  min={ABS_MIN_PRICE}
                  max={ABS_MAX_PRICE}
                  step={1}
                  value={priceMax}
                  onChange={onMaxPriceChange}
                  aria-labelledby="catalog-max-label"
                />
              </div>
            </div>
          </fieldset>

          <button type="button" className="catalog__reset" onClick={resetFilters}>
            Сбросить фильтры
          </button>
        </aside>

        <div className="catalog__main">
          <div className="catalog__toolbar">
            <div className="catalog__toolbar-left">
              <p className="catalog__count">Найдено товаров: {totalCount}</p>
              <label className="catalog__search-label" htmlFor="catalog-search">
                Поиск
              </label>
              <input
                id="catalog-search"
                type="search"
                className="catalog__search-input"
                placeholder="Бренд или модель шины"
                value={searchQuery}
                onChange={onSearchChange}
                autoComplete="off"
              />
            </div>
            <div className="catalog__sort">
              <label htmlFor="catalog-sort">Сортировка</label>
              <select
                id="catalog-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!loading && totalCount > 0 && totalPages === 1 && (
            <p className="catalog__range-summary" aria-live="polite">
              Показано {rangeFrom}–{rangeTo} из {totalCount} товаров
            </p>
          )}

          {loading ? (
            <p className="catalog__loading" role="status">
              Loading...
            </p>
          ) : totalCount === 0 ? (
            <div className="catalog__empty-wrap">
              <p className="catalog__empty">Товары не найдены</p>
              <button type="button" className="button" onClick={resetFilters}>
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="catalog__grid catalog-grid">
              {pageItems.map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
          )}

          {!loading && totalCount > 0 && totalPages > 1 && (
            <nav className="catalog__pagination" aria-label="Страницы каталога">
              <p className="catalog__pagination-summary">
                Показано {rangeFrom}–{rangeTo} из {totalCount} товаров
              </p>
              <div className="catalog__pagination-row">
                <button
                  type="button"
                  className="catalog__page-btn"
                  disabled={safePage <= 1}
                  onClick={() => goToPage(Math.max(1, safePage - 1))}
                >
                  Назад
                </button>
                {pageNumbers.map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`catalog__page-btn${num === safePage ? ' catalog__page-btn--active' : ''}`}
                    onClick={() => goToPage(num)}
                    aria-current={num === safePage ? 'page' : undefined}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  className="catalog__page-btn"
                  disabled={safePage >= totalPages}
                  onClick={() => goToPage(Math.min(totalPages, safePage + 1))}
                >
                  Вперёд
                </button>
              </div>
            </nav>
          )}
        </div>
      </div>
    </section>
  )
}
