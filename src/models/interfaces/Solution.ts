// ══════════════════════════════════════════════════════════
//  SOLUTION TYPES
// ══════════════════════════════════════════════════════════

// ── Modelo (espelha Prisma) ───────────────────────────────

export interface SolutionModel {
  id: string
  icon: string
  title: string
  description: string
  order: number
  active: boolean
  wide: boolean // destaque — largura total na grelha
  createdAt: Date
  updatedAt: Date
}

// ── Request bodies ────────────────────────────────────────

export interface CreateSolutionBody {
  icon: string
  title: string
  description: string
  order?: number
  active?: boolean
  wide?: boolean
}

export interface UpdateSolutionBody extends Partial<CreateSolutionBody> {}

export interface ReorderBody {
  ids: string[]
}

// ── Query params ──────────────────────────────────────────

export interface SolutionQuery {
  active?: 'true' | 'false'
  search?: string
}

// ── API Responses ─────────────────────────────────────────

export interface SolutionResponse {
  success: boolean
  message?: string
  data: SolutionModel
}

export interface SolutionListResponse {
  success: boolean
  data: SolutionModel[]
}

export interface ToggleResponse {
  success: boolean
  data: {
    id: string
    active: boolean
  }
}
