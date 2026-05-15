const PROMO_REGISTRY_KEY = 'tire-shop-promo-registry'
const PROMO_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export const PROMO_DISCOUNT_RATE = 0.1

export type PromoRegistry = Record<string, string>

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function readPromoRegistry(): PromoRegistry {
  try {
    const raw = localStorage.getItem(PROMO_REGISTRY_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return {}
    const result: PromoRegistry = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'string' && value.length === 8) {
        result[normalizeEmail(key)] = value.toUpperCase()
      }
    }
    return result
  } catch {
    return {}
  }
}

function writePromoRegistry(registry: PromoRegistry) {
  try {
    localStorage.setItem(PROMO_REGISTRY_KEY, JSON.stringify(registry))
  } catch {
    /* ignore */
  }
}

export function generatePromoCode(): string {
  let code = ''
  for (let i = 0; i < 8; i += 1) {
    code += PROMO_CHARS[Math.floor(Math.random() * PROMO_CHARS.length)]
  }
  return code
}

/** Новый уникальный промокод для email (при регистрации). */
export function createPromoForEmail(email: string): string {
  const key = normalizeEmail(email)
  const registry = readPromoRegistry()
  let code = generatePromoCode()
  const existingCodes = new Set(Object.values(registry))
  while (existingCodes.has(code)) {
    code = generatePromoCode()
  }
  registry[key] = code
  writePromoRegistry(registry)
  return code
}

export function getPromoForEmail(email: string): string | null {
  const registry = readPromoRegistry()
  return registry[normalizeEmail(email)] ?? null
}

export function findEmailByPromoCode(code: string): string | null {
  const normalized = code.trim().toUpperCase()
  if (normalized.length !== 8) return null
  const registry = readPromoRegistry()
  for (const [email, stored] of Object.entries(registry)) {
    if (stored === normalized) return email
  }
  return null
}

export function isValidPromoCode(code: string): boolean {
  return findEmailByPromoCode(code) !== null
}
