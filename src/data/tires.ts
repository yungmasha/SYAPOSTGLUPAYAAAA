/** Каталог шин: rim — диаметр обода для фильтра (R13–R20). Цены в BYN (пересчёт из ₽ ~1 BYN ≈ 30 ₽). Итоговый список — по 50 уникальных позиций на бренд (сиды + доп. до квоты). */
import type { Tire } from '../types/tire'
import { CAR_SELECTOR_TIRE_SIZES } from './carsData'

const TIRE_IMAGE =
  'https://images.unsplash.com/photo-1617521652343-077e3450da07?auto=format&fit=crop&w=400&q=80'

const tireSeeds: Tire[] = [
  {
    id: 1,
    name: 'Pilot Sport 4',
    brand: 'Michelin',
    size: '225/45 R17',
    rim: 'R17',
    season: 'Лето',
    price: 416,
    image: TIRE_IMAGE,
    description: 'Высокопроизводительная летняя шина с отличным сцеплением на мокрой дороге.',
  },
  {
    id: 2,
    name: 'WinterContact TS 870',
    brand: 'Continental',
    size: '205/55 R16',
    rim: 'R16',
    season: 'Зима',
    price: 330,
    image: TIRE_IMAGE,
    description: 'Фрикционная зимняя резина для городских условий.',
  },
  {
    id: 3,
    name: 'Hakkapeliitta R5',
    brand: 'Nokian',
    size: '195/65 R15',
    rim: 'R15',
    season: 'Зима',
    price: 373,
    image: TIRE_IMAGE,
    description: 'Надёжное сцепление на льду и снегу.',
  },
  {
    id: 4,
    name: 'EfficientGrip Performance 2',
    brand: 'Goodyear',
    size: '215/60 R16',
    rim: 'R16',
    season: 'Лето',
    price: 293,
    image: TIRE_IMAGE,
    description: 'Экономичный расход топлива и длительный пробег.',
  },
  {
    id: 5,
    name: 'Turanza T005',
    brand: 'Bridgestone',
    size: '235/40 R18',
    rim: 'R18',
    season: 'Лето',
    price: 465,
    image: TIRE_IMAGE,
    description: 'Комфорт и стабильность для седанов и кроссоверов.',
  },
  {
    id: 6,
    name: 'Cinturato P7 C2',
    brand: 'Pirelli',
    size: '245/45 R18',
    rim: 'R18',
    season: 'Лето',
    price: 507,
    image: TIRE_IMAGE,
    description: 'Премиальная летняя шина с акцентом на управляемость.',
  },
  {
    id: 7,
    name: 'Kinergy 4S2',
    brand: 'Hankook',
    size: '205/55 R16',
    rim: 'R16',
    season: 'Всесезон',
    price: 255,
    image: TIRE_IMAGE,
    description: 'Универсальный вариант на весну и осень.',
  },
  {
    id: 8,
    name: 'BluEarth-GT AE51',
    brand: 'Yokohama',
    size: '195/55 R16',
    rim: 'R16',
    season: 'Лето',
    price: 233,
    image: TIRE_IMAGE,
    description: 'Тихая и мягкая езда для компакт-класса.',
  },
  {
    id: 9,
    name: 'Observe G3-Ice',
    brand: 'Toyo',
    size: '225/50 R17',
    rim: 'R17',
    season: 'Зима',
    price: 350,
    image: TIRE_IMAGE,
    description: 'Шипуемая зимняя модель для суровых зим.',
  },
  {
    id: 10,
    name: 'Vector 4Seasons Gen-3',
    brand: 'Goodyear',
    size: '215/55 R17',
    rim: 'R17',
    season: 'Всесезон',
    price: 307,
    image: TIRE_IMAGE,
    description: 'Сбалансированные характеристики круглый год.',
  },
  {
    id: 11,
    name: 'Potenza Sport',
    brand: 'Bridgestone',
    size: '255/35 R19',
    rim: 'R19',
    season: 'Лето',
    price: 630,
    image: TIRE_IMAGE,
    description: 'Спортивный протектор для мощных авто.',
  },
  {
    id: 12,
    name: 'Nordman RS2',
    brand: 'Nokian',
    size: '185/65 R14',
    rim: 'R14',
    season: 'Зима',
    price: 183,
    image: TIRE_IMAGE,
    description: 'Доступная зимняя шина для городских машин.',
  },
  {
    id: 13,
    name: 'SP Sport Maxx 050+',
    brand: 'Dunlop',
    size: '235/45 R18',
    rim: 'R18',
    season: 'Лето',
    price: 440,
    image: TIRE_IMAGE,
    description: 'Стабильность на высокой скорости.',
  },
  {
    id: 14,
    name: 'NT555 G2',
    brand: 'Nitto',
    size: '275/35 R20',
    rim: 'R20',
    season: 'Лето',
    price: 727,
    image: TIRE_IMAGE,
    description: 'Ультра-высокая производительность.',
  },
  {
    id: 15,
    name: 'All-Terrain T/A KO2',
    brand: 'BFGoodrich',
    size: '265/70 R17',
    rim: 'R17',
    season: 'Лето',
    price: 583,
    image: TIRE_IMAGE,
    description: 'Для внедорожников и пикапов.',
  },
  {
    id: 16,
    name: 'Ventus Prime3 K125',
    brand: 'Hankook',
    size: '205/60 R16',
    rim: 'R16',
    season: 'Лето',
    price: 207,
    image: TIRE_IMAGE,
    description: 'Сбалансированная городская летняя шина.',
  },
  {
    id: 17,
    name: 'Ecsta PS71',
    brand: 'Kumho',
    size: '225/40 R18',
    rim: 'R18',
    season: 'Лето',
    price: 297,
    image: TIRE_IMAGE,
    description: 'Доступный UHP-сегмент.',
  },
  {
    id: 18,
    name: 'N\'Fera SU1',
    brand: 'Nexen',
    size: '215/50 R17',
    rim: 'R17',
    season: 'Лето',
    price: 237,
    image: TIRE_IMAGE,
    description: 'Тихий протектор и комфорт.',
  },
  {
    id: 19,
    name: 'MP47 Hectorra 3',
    brand: 'Matador',
    size: '195/65 R15',
    rim: 'R15',
    season: 'Лето',
    price: 160,
    image: TIRE_IMAGE,
    description: 'Надёжный бюджетный вариант.',
  },
  {
    id: 20,
    name: 'Bravuris 5HM',
    brand: 'Barum',
    size: '185/60 R14',
    rim: 'R14',
    season: 'Лето',
    price: 130,
    image: TIRE_IMAGE,
    description: 'Долговечность и предсказуемость.',
  },
  {
    id: 21,
    name: 'Bosco A/T V-237',
    brand: 'Viatti',
    size: '215/70 R16',
    rim: 'R16',
    season: 'Всесезон',
    price: 187,
    image: TIRE_IMAGE,
    description: 'Лёгкое бездорожье и асфальт.',
  },
  {
    id: 22,
    name: 'Ice Cross',
    brand: 'Cordiant',
    size: '175/65 R14',
    rim: 'R14',
    season: 'Зима',
    price: 140,
    image: TIRE_IMAGE,
    description: 'Зимняя шина для компактных авто.',
  },
  {
    id: 23,
    name: 'Евро-519',
    brand: 'Kama',
    size: '175/70 R13',
    rim: 'R13',
    season: 'Лето',
    price: 83,
    image: TIRE_IMAGE,
    description: 'Доступная летняя резина.',
  },
  {
    id: 24,
    name: 'BC-48',
    brand: 'Kama',
    size: '185/65 R14',
    rim: 'R14',
    season: 'Зима',
    price: 127,
    image: TIRE_IMAGE,
    description: 'Зимняя шина отечественного бренда.',
  },
  {
    id: 25,
    name: 'BC-49',
    brand: 'Rosava',
    size: '195/65 R15',
    rim: 'R15',
    season: 'Лето',
    price: 150,
    image: TIRE_IMAGE,
    description: 'Универсальная летняя модель.',
  },
  {
    id: 26,
    name: 'Latitude Sport 3',
    brand: 'Michelin',
    size: '255/50 R19',
    rim: 'R19',
    season: 'Лето',
    price: 660,
    image: TIRE_IMAGE,
    description: 'Для премиальных кроссоверов.',
  },
  {
    id: 27,
    name: 'Blizzak LM005',
    brand: 'Bridgestone',
    size: '225/55 R18',
    rim: 'R18',
    season: 'Зима',
    price: 473,
    image: TIRE_IMAGE,
    description: 'Премиальная зимняя фрикция.',
  },
  {
    id: 28,
    name: 'PremiumContact 6',
    brand: 'Continental',
    size: '245/40 R19',
    rim: 'R19',
    season: 'Лето',
    price: 550,
    image: TIRE_IMAGE,
    description: 'Комфорт и управляемость.',
  },
  {
    id: 29,
    name: 'Scorpion Zero',
    brand: 'Pirelli',
    size: '275/40 R20',
    rim: 'R20',
    season: 'Лето',
    price: 833,
    image: TIRE_IMAGE,
    description: 'Для мощных SUV.',
  },
  {
    id: 30,
    name: 'IceGuard G075',
    brand: 'Yokohama',
    size: '215/70 R16',
    rim: 'R16',
    season: 'Зима',
    price: 327,
    image: TIRE_IMAGE,
    description: 'Зимняя шина для кроссоверов.',
  },
  {
    id: 31,
    name: 'Winter i*cept IZ2',
    brand: 'Hankook',
    size: '205/55 R16',
    rim: 'R16',
    season: 'Зима',
    price: 250,
    image: TIRE_IMAGE,
    description: 'Фрикционная зима с низким шумом.',
  },
  {
    id: 32,
    name: 'WR Snowproof',
    brand: 'Nokian',
    size: '225/45 R17',
    rim: 'R17',
    season: 'Зима',
    price: 393,
    image: TIRE_IMAGE,
    description: 'Стабильность на заснеженной трассе.',
  },
  {
    id: 33,
    name: 'UltraGrip Performance+',
    brand: 'Goodyear',
    size: '225/45 R17',
    rim: 'R17',
    season: 'Зима',
    price: 410,
    image: TIRE_IMAGE,
    description: 'Короткий тормозной путь на мокром и снежном покрытии.',
  },
  {
    id: 34,
    name: 'Primacy 4+',
    brand: 'Michelin',
    size: '215/55 R17',
    rim: 'R17',
    season: 'Лето',
    price: 520,
    image: TIRE_IMAGE,
    description: 'Премиальная комфортная резина для седанов и кроссоверов.',
  },
  {
    id: 35,
    name: 'AllSeasonContact 2',
    brand: 'Continental',
    size: '205/55 R16',
    rim: 'R16',
    season: 'Всесезон',
    price: 340,
    image: TIRE_IMAGE,
    description: 'Сбалансированное сцепление круглый год.',
  },
  {
    id: 36,
    name: 'EcoContact 6',
    brand: 'Continental',
    size: '195/65 R15',
    rim: 'R15',
    season: 'Лето',
    price: 270,
    image: TIRE_IMAGE,
    description: 'Низкое сопротивление качению и износостойкость.',
  },
  {
    id: 37,
    name: 'Scorpion Verde',
    brand: 'Pirelli',
    size: '235/60 R18',
    rim: 'R18',
    season: 'Лето',
    price: 560,
    image: TIRE_IMAGE,
    description: 'Комфортная SUV-модель с точной управляемостью.',
  },
  {
    id: 38,
    name: 'Wintrac Pro',
    brand: 'Vredestein',
    size: '245/45 R18',
    rim: 'R18',
    season: 'Зима',
    price: 440,
    image: TIRE_IMAGE,
    description: 'Зимняя шина с акцентом на устойчивость на скорости.',
  },
  {
    id: 39,
    name: 'RainSport 5',
    brand: 'Uniroyal',
    size: '225/40 R18',
    rim: 'R18',
    season: 'Лето',
    price: 305,
    image: TIRE_IMAGE,
    description: 'Усиленная защита от аквапланирования.',
  },
  {
    id: 40,
    name: 'Snowproof C',
    brand: 'Nokian',
    size: '215/65 R16',
    rim: 'R16',
    season: 'Зима',
    price: 360,
    image: TIRE_IMAGE,
    description: 'Надёжная зимняя модель для минивэнов и фургонов.',
  },
  {
    id: 41,
    name: 'Advan Sport V107',
    brand: 'Yokohama',
    size: '255/40 R19',
    rim: 'R19',
    season: 'Лето',
    price: 640,
    image: TIRE_IMAGE,
    description: 'Спортивная шина для динамичного стиля вождения.',
  },
  {
    id: 42,
    name: 'Open Country A/T III',
    brand: 'Toyo',
    size: '265/65 R17',
    rim: 'R17',
    season: 'Всесезон',
    price: 495,
    image: TIRE_IMAGE,
    description: 'Универсальная A/T шина для города и грунтовых дорог.',
  },
]

const EXTRA_BRANDS = [
  'Triangle',
  'Sailun',
  'Laufenn',
  'Falken',
  'Federal',
  'Nexen',
  'Kumho',
  'Cooper',
  'General',
  'Maxxis',
  'Gislaved',
  'Fulda',
  'Tigar',
  'Kleber',
  'Debica',
] as const

const EXTRA_SEASONS = ['Лето', 'Зима', 'Всесезон'] as const

/** Дополнительные типоразмеры для покрытия фильтров R13–R20 и разнообразия каталога */
const EXTRA_SIZE_VARIANTS = [
  '175/70 R13',
  '185/70 R13',
  '185/60 R14',
  '185/65 R14',
  '195/60 R15',
  '195/65 R15',
  '205/50 R15',
  '215/55 R16',
  '215/60 R16',
  '215/65 R16',
  '215/70 R16',
  '225/55 R16',
  '225/50 R17',
  '235/50 R17',
  '235/55 R17',
  '245/45 R18',
  '235/60 R18',
  '255/55 R18',
  '265/50 R20',
  '275/40 R20',
  '255/35 R19',
  '255/45 R19',
  '255/50 R19',
  '265/70 R17',
  '245/70 R16',
] as const

const SIZE_POOL = Array.from(
  new Set<string>([...CAR_SELECTOR_TIRE_SIZES, ...EXTRA_SIZE_VARIANTS]),
).sort((a, b) => a.localeCompare(b, 'ru'))

function rimFromSize(size: string): string {
  const m = size.match(/R\d{2}$/)
  return m ? m[0] : 'R16'
}

const EXTRA_MODEL_LINES = [
  'RoadComfort',
  'CityGrip',
  'SnowAce',
  'TrailPro',
  'EcoTour',
  'SportLine',
  'WinterMax',
  'AllTour',
  'GripPlus',
  'QuietRide',
  'IceControl',
  'RainSport',
  'HighLoad',
  'Touring+',
  '4x4Grip',
] as const

const TIRES_PER_BRAND = 50

function makeSyntheticTire(
  id: number,
  brand: string,
  size: string,
  season: string,
  variant: number,
): Tire {
  const rim = rimFromSize(size)
  const line = EXTRA_MODEL_LINES[variant % EXTRA_MODEL_LINES.length]
  const price = 120 + ((variant * 53 + id * 7) % 601)
  return {
    id,
    name: `${brand} ${line} · ${size}`,
    brand,
    season,
    rim,
    size,
    price,
    image: TIRE_IMAGE,
    description: `${line}: ${season.toLowerCase()} шина ${size} для легковых автомобилей.`,
    quantity: 8,
  }
}

/** Ровно TIRES_PER_BRAND уникальных (размер+сезон) шин на каждый бренд; сиды сохраняют свои id. */
function buildCatalogByBrandQuota(): Tire[] {
  const brandList = [
    ...new Set<string>([
      ...tireSeeds.map((t) => t.brand),
      ...EXTRA_BRANDS,
    ]),
  ].sort((a, b) => a.localeCompare(b, 'ru'))

  let nextId = Math.max(...tireSeeds.map((t) => t.id)) + 1
  const out: Tire[] = []

  for (const brand of brandList) {
    const seedRows = tireSeeds
      .filter((t) => t.brand === brand)
      .sort((a, b) => a.id - b.id)

    const usedPairs = new Set(
      seedRows.map((t) => `${t.size}\u0000${t.season}`),
    )

    const block: Tire[] = []

    if (seedRows.length >= TIRES_PER_BRAND) {
      block.push(...seedRows.slice(0, TIRES_PER_BRAND))
    } else {
      block.push(...seedRows)
      let variant = 0
      for (const season of EXTRA_SEASONS) {
        if (block.length >= TIRES_PER_BRAND) break
        for (const size of SIZE_POOL) {
          if (block.length >= TIRES_PER_BRAND) break
          const key = `${size}\u0000${season}`
          if (usedPairs.has(key)) continue
          usedPairs.add(key)
          block.push(
            makeSyntheticTire(nextId, brand, size, season, variant),
          )
          nextId += 1
          variant += 1
        }
      }

      if (block.length < TIRES_PER_BRAND) {
        throw new Error(
          `tires: для бренда «${brand}» не хватает уникальных пар размер+сезон: ${block.length} < ${TIRES_PER_BRAND}`,
        )
      }
    }

    out.push(...block)
  }

  return out
}

export const tires: Tire[] = buildCatalogByBrandQuota()
