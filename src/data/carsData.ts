export type TireSizeByCar = {
  brand: string
  model: string
  year: string
  sizes: string[]
}

const SIZE_PRESETS = [
  ['185/65 R15', '195/55 R16'],
  ['205/55 R16', '215/60 R17'],
  ['215/55 R17', '225/45 R17'],
  ['225/60 R17', '235/55 R18'],
  ['235/55 R18', '255/45 R19'],
] as const

/** Размеры из подбора по авто — в каталоге должны быть шины с этими size для фильтра по URL */
export const CAR_SELECTOR_TIRE_SIZES = Array.from(
  new Set(SIZE_PRESETS.flat() as readonly string[]),
)

const MODELS_BY_BRAND: Record<string, string[]> = {
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Land Cruiser', 'C-HR'],
  Hyundai: ['Solaris', 'Creta', 'Elantra', 'Tucson', 'Santa Fe'],
  Kia: ['Rio', 'Sportage', 'Cerato', 'Sorento', 'K5'],
  Renault: ['Logan', 'Duster', 'Kaptur', 'Arkana', 'Sandero'],
  Volkswagen: ['Polo', 'Golf', 'Tiguan', 'Passat', 'Touareg'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5', 'X1'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE', 'A-Class'],
  Skoda: ['Octavia', 'Rapid', 'Kodiaq', 'Superb', 'Karoq'],
  Nissan: ['Qashqai', 'X-Trail', 'Almera', 'Murano', 'Juke'],
  Mazda: ['CX-5', 'CX-9', 'Mazda 3', 'Mazda 6', 'CX-30'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V'],
  Ford: ['Focus', 'Mondeo', 'Kuga', 'Explorer', 'Fiesta'],
  Chevrolet: ['Cruze', 'Malibu', 'Equinox', 'Tahoe', 'Aveo'],
  Mitsubishi: ['Outlander', 'ASX', 'Pajero Sport', 'Eclipse Cross', 'L200'],
  Subaru: ['Outback', 'Forester', 'Impreza', 'XV', 'Legacy'],
  Lexus: ['RX', 'NX', 'ES', 'GX', 'UX'],
  Audi: ['A4', 'A6', 'Q5', 'Q7', 'A3'],
  Volvo: ['XC60', 'XC90', 'S60', 'V90', 'XC40'],
  Porsche: ['Cayenne', 'Macan', '911', 'Panamera', 'Taycan'],
  Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X'],
}

const YEARS = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']

function buildTireSizesByCar(): TireSizeByCar[] {
  const rows: TireSizeByCar[] = []
  let presetIndex = 0

  Object.entries(MODELS_BY_BRAND).forEach(([brand, models]) => {
    models.forEach((model, modelIndex) => {
      const sizes = SIZE_PRESETS[(presetIndex + modelIndex) % SIZE_PRESETS.length]
      YEARS.forEach((year) => {
        rows.push({ brand, model, year, sizes: [...sizes] })
      })
    })
    presetIndex += 1
  })

  return rows
}

export const tireSizesByCar = buildTireSizesByCar()

export const carsData: Record<string, Record<string, string[]>> = Object.entries(
  MODELS_BY_BRAND,
).reduce<Record<string, Record<string, string[]>>>((acc, [brand, models]) => {
  acc[brand] = models.reduce<Record<string, string[]>>((modelAcc, model) => {
    modelAcc[model] = tireSizesByCar
      .filter((row) => row.brand === brand && row.model === model)
      .map((row) => row.year)
      .sort((a, b) => Number(b) - Number(a))
    return modelAcc
  }, {})
  return acc
}, {})

export const carBrands = Object.keys(carsData).sort((a, b) => a.localeCompare(b, 'ru'))
