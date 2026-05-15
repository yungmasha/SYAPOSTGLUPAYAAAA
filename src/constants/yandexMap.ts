/** Адрес шоурума MotoHunters — единый для всех карт */
export const STORE_ADDRESS = 'г. Минск, ул. Суворова, д. 13'
export const STORE_ADDRESS_FULL = '223040, г. Минск, ул. Суворова, д. 13'

/** Координаты: ул. Суворова, 13, Минск */
const MAP_LON = 27.559289
const MAP_LAT = 53.907234

export const YANDEX_MAP_EMBED_URL =
  `https://yandex.ru/map-widget/v1/?ll=${MAP_LON}%2C${MAP_LAT}&z=16&l=map&pt=${MAP_LON}%2C${MAP_LAT}%2Cpm2rdm`

export const YANDEX_MAP_OPEN_URL =
  `https://yandex.ru/maps/?pt=${MAP_LON}%2C${MAP_LAT}&z=16&l=map`
