import './catalog-skeleton.css'

type CatalogSkeletonProps = {
  count?: number
}

export default function CatalogSkeleton({ count = 9 }: CatalogSkeletonProps) {
  return (
    <div className="catalog-skeleton" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="catalog-skeleton__card">
          <div className="catalog-skeleton__image" />
          <div className="catalog-skeleton__line catalog-skeleton__line--title" />
          <div className="catalog-skeleton__line catalog-skeleton__line--price" />
          <div className="catalog-skeleton__line catalog-skeleton__line--btn" />
        </div>
      ))}
    </div>
  )
}
