/** Марки и модели для калькулятора подбора шин на главной */
export const carsData = {
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Land Cruiser'],
  Hyundai: ['Solaris', 'Creta', 'Elantra', 'Tucson'],
  Kia: ['Rio', 'Sportage', 'Cerato', 'Sorento'],
  Renault: ['Logan', 'Duster', 'Kaptur', 'Arkana'],
  Volkswagen: ['Polo', 'Jetta', 'Tiguan', 'Touareg'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE'],
  Skoda: ['Octavia', 'Rapid', 'Kodiaq', 'Superb'],
  Nissan: ['Qashqai', 'X-Trail', 'Almera', 'Murano'],
  Mazda: ['CX-5', 'CX-9', 'Mazda 3', 'Mazda 6'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot'],
  Ford: ['Focus', 'Mondeo', 'Kuga', 'Explorer'],
  Chevrolet: ['Cruze', 'Malibu', 'Equinox', 'Tahoe'],
  Mitsubishi: ['Outlander', 'ASX', 'Pajero Sport', 'Eclipse Cross'],
  Subaru: ['Outback', 'Forester', 'Impreza', 'XV'],
  Lexus: ['RX', 'NX', 'ES', 'GX'],
  Audi: ['A4', 'A6', 'Q5', 'Q7'],
  Volvo: ['XC60', 'XC90', 'S60', 'V90'],
  Porsche: ['Cayenne', 'Macan', '911', 'Panamera'],
  Tesla: ['Model 3', 'Model Y', 'Model S', 'Model X'],
}

export const carBrands = Object.keys(carsData).sort((a, b) =>
  a.localeCompare(b, 'ru'),
)
