import { Link } from 'react-router-dom'
import { useCompare } from '../contexts/comparecontext'
import { formatByn } from '../utils/currency'
import type { Tire } from '../types/tire'
import { usePageTitle } from '../hooks/usePageTitle'
import './compare.css'

type CompareRow = {
  key: string
  label: string
  get: (p: Tire) => string | number
}

const ROWS: CompareRow[] = [
  { key: 'name', label: 'Название', get: (p) => p.name },
  { key: 'brand', label: 'Бренд', get: (p) => p.brand },
  { key: 'size', label: 'Размер', get: (p) => p.size },
  { key: 'season', label: 'Сезон', get: (p) => p.season },
  { key: 'price', label: 'Цена', get: (p) => formatByn(p.price) },
  { key: 'description', label: 'Описание', get: (p) => p.description ?? '—' },
]

export default function Compare() {
  usePageTitle('Сравнение шин')
  const { compareItems, removeFromCompare, clearCompare } = useCompare()
  const n = compareItems.length
  const labelPct = 18
  const productPct = n > 0 ? (100 - labelPct) / n : 0

  if (n === 0) {
    return (
      <section className="page compare-page">
        <h1>Сравнение товаров</h1>
        <p>
          Вы пока не добавили товары к сравнению.{' '}
          <Link to="/catalog">Перейти в каталог</Link>
        </p>
      </section>
    )
  }

  return (
    <section className="page compare-page">
      <div className="compare-page__header">
        <h1>Сравнение товаров</h1>
        <button
          type="button"
          className="button secondary"
          onClick={clearCompare}
        >
          Очистить сравнение
        </button>
      </div>

      <div className="compare-page__table-wrap">
        <table className="compare-page__table">
          <colgroup>
            <col style={{ width: `${labelPct}%` }} />
            {compareItems.map((item) => (
              <col key={item.id} style={{ width: `${productPct}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th>Характеристика</th>
              {compareItems.map((item) => (
                <th key={item.id}>
                  <div className="compare-page__col-head">
                    <span>
                      {item.brand} {item.name}
                    </span>
                    <button
                      type="button"
                      className="compare-page__remove"
                      onClick={() => removeFromCompare(item.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.key}>
                <td className="compare-page__cell-label">{row.label}</td>
                {compareItems.map((item) => (
                  <td key={`${row.key}-${item.id}`}>{row.get(item)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
