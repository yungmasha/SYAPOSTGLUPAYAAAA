import { useEffect } from 'react'

const DEFAULT_TITLE = 'MotoHunters — шинный центр'
const DEFAULT_DESCRIPTION =
  'Шинный центр MotoHunters в Минске: летние и зимние шины, подбор по авто, доставка, бронирование без оплаты.'

export function usePageTitle(
  title: string,
  description?: string,
) {
  useEffect(() => {
    const prevTitle = document.title
    const metaDesc = document.querySelector('meta[name="description"]')
    const prevDesc = metaDesc?.getAttribute('content') ?? null

    document.title = title.includes('MotoHunters')
      ? title
      : `${title} — MotoHunters`

    if (metaDesc && description) {
      metaDesc.setAttribute('content', description)
    }

    return () => {
      document.title = prevTitle
      if (metaDesc && prevDesc !== null) {
        metaDesc.setAttribute('content', prevDesc)
      } else if (metaDesc) {
        metaDesc.setAttribute('content', DEFAULT_DESCRIPTION)
      }
    }
  }, [title, description])
}

export { DEFAULT_TITLE, DEFAULT_DESCRIPTION }
