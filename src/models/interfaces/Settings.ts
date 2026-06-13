// ══════════════════════════════════════════════════════════
//  SETTINGS TYPES  (SiteSettings singleton)
// ══════════════════════════════════════════════════════════

// ── Modelo (espelha Prisma SiteSettings) ─────────────────

export interface SiteSettingsModel {
  id: string
  siteName: string
  tagline: string
  address: string
  phone: string
  whatsapp: string
  email: string
  linkedin: string | null
  facebook: string | null
  instagram: string | null
  youtube: string | null
  googleMapsEmbed: string | null
  updatedAt: Date
}

// ── Request body ──────────────────────────────────────────

export interface UpdateSettingsBody {
  siteName?: string
  tagline?: string
  address?: string
  phone?: string
  whatsapp?: string
  email?: string
  linkedin?: string
  facebook?: string
  instagram?: string
  youtube?: string
  googleMapsEmbed?: string
}

// ── API Responses ─────────────────────────────────────────

export interface SettingsResponse {
  success: boolean
  message?: string
  data: SiteSettingsModel
}
