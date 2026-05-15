import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { carsData, tireSizesByCar } from '../data/carsData'
import './car-selector.css'

type CarSelectorProps = {
  title?: string
  fieldsLayout?: 'row' | 'column'
}

export default function CarSelector({
  title = 'Подбор шин по автомобилю',
  fieldsLayout = 'row',
}: CarSelectorProps) {
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [result, setResult] = useState<string[] | null>(null)

  const brands = useMemo(() => Object.keys(carsData), [])

  const modelOptions = useMemo(() => {
    if (!brand) return []
    return Object.keys(carsData[brand] ?? {})
  }, [brand])

  const yearOptions = useMemo(() => {
    if (!brand || !model) return []
    return carsData[brand]?.[model] ?? []
  }, [brand, model])

  const handleSubmit = () => {
    const matched = tireSizesByCar.find(
      (item) => item.brand === brand && item.model === model && item.year === year,
    )
    setResult(matched ? matched.sizes : [])
  }

  const catalogLink = useMemo(() => {
    if (!result || result.length === 0) return ''
    const params = new URLSearchParams({
      brand,
      model,
      year,
      sizes: result.join(','),
    })
    return `/catalog?${params.toString()}`
  }, [brand, model, year, result])

  return (
    <section
      className={`car-selector${fieldsLayout === 'column' ? ' car-selector--column' : ''}`}
      aria-label={title || 'Подбор шин по автомобилю'}
    >
      {title ? <h3 className="car-selector__title">{title}</h3> : null}

      <div className="car-selector__fields">
        <div className="car-selector__field">
          <label htmlFor="car-selector-brand">Марка</label>
          <select
            id="car-selector-brand"
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value)
              setModel('')
              setYear('')
              setResult(null)
            }}
          >
            <option value="">Выберите марку</option>
            {brands.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="car-selector__field">
          <label htmlFor="car-selector-model">Модель</label>
          <select
            id="car-selector-model"
            value={model}
            onChange={(e) => {
              setModel(e.target.value)
              setYear('')
              setResult(null)
            }}
            disabled={!brand}
          >
            <option value="">{brand ? 'Выберите модель' : 'Сначала марку'}</option>
            {modelOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="car-selector__field">
          <label htmlFor="car-selector-year">Год</label>
          <select
            id="car-selector-year"
            value={year}
            onChange={(e) => {
              setYear(e.target.value)
              setResult(null)
            }}
            disabled={!model}
          >
            <option value="">{model ? 'Выберите год' : 'Сначала модель'}</option>
            {yearOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="car-selector__actions">
        <button
          type="button"
          className="button"
          onClick={handleSubmit}
          disabled={!brand || !model || !year}
        >
          Подобрать шины
        </button>

        {Array.isArray(result) &&
          (result.length > 0 ? (
            <p className="car-selector__result">
              Размеры: <strong>{result.join(', ')}</strong>
              {catalogLink ? (
                <>
                  {' '}
                  —{' '}
                  <Link to={catalogLink} className="car-selector__catalog-link">
                    открыть в каталоге
                  </Link>
                </>
              ) : null}
            </p>
          ) : (
            <p className="car-selector__result error-message">
              Нет данных для выбранного автомобиля
            </p>
          ))}
      </div>
    </section>
  )
}
