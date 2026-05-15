import { Link } from 'react-router-dom'
import { FaBalanceScale } from 'react-icons/fa'
import { useCompare } from '../contexts/comparecontext'
import './compare-bar.css'

export default function CompareBar() {
  const { compareItems } = useCompare()

  if (compareItems.length === 0) {
    return null
  }

  return (
    <aside className="compare-bar" aria-label="Быстрое сравнение">
      <FaBalanceScale className="compare-bar__icon" aria-hidden />
      <span className="compare-bar__text">
        В сравнении: <strong>{compareItems.length}</strong>
      </span>
      <Link
        to="/compare"
        className="button compare-bar__btn"
        aria-disabled={compareItems.length < 2}
      >
        {compareItems.length < 2
          ? 'Добавьте ещё один товар'
          : 'Открыть сравнение'}
      </Link>
    </aside>
  )
}
