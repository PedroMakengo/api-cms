// ══════════════════════════════════════════════════════════
//  CONTACT TYPES
// ══════════════════════════════════════════════════════════

// ── Modelo (espelha Prisma ContactSubmission) ─────────────

export interface ContactModel {
  id: string
  name: string
  lastname: string
  email: string
  phone: string | null
  organization: string | null
  area: string | null
  message: string | null
  read: boolean
  readAt: Date | null
  createdAt: Date
}

// ── Request bodies ────────────────────────────────────────

export interface CreateContactBody {
  name: string
  lastname: string
  email: string
  phone?: string
  organization?: string
  area?: string
  message?: string
}

export interface MarkReadBody {
  read: boolean
}

// ── Query params ──────────────────────────────────────────

export interface ContactQuery {
  read?: 'true' | 'false'
  search?: string
  area?: string
}

// ── Stats ─────────────────────────────────────────────────

export interface ContactStats {
  total: number
  unread: number
  read: number
  today: number
}

// ── Mark read result ──────────────────────────────────────

export interface MarkReadResult {
  id: string
  read: boolean
  readAt: Date | null
}

// ── API Responses ─────────────────────────────────────────

export interface ContactResponse {
  success: boolean
  message?: string
  data: ContactModel
}

export interface ContactListResponse {
  success: boolean
  data: ContactModel[]
}

export interface ContactStatsResponse {
  success: boolean
  data: ContactStats
}
