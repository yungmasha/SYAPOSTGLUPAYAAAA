/**
 * Форматирование цен в белорусских рублях (BYN).
 * Исходные значения в данных — в BYN (пересчитаны из ₽ по курсу 1 BYN ≈ 30 ₽).
 */
export function formatByn(value) {
  const n = Math.round(Number(value))
  if (!Number.isFinite(n)) return '—'
  return `${n.toLocaleString('be-BY')} BYN`
}
