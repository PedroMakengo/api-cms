// ══════════════════════════════════════════════════════════
//  AREA TYPES
// ══════════════════════════════════════════════════════════

// ── Modelo (espelha Prisma) ───────────────────────────────

export interface ProgramModel {
  id: string
  areaId: string
  name: string
  duration: string
  mode: string
  price: string
  startDate: string
  description: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AreaModel {
  id: string
  icon: string
  title: string
  description: string
  order: number
  active: boolean
  programs: ProgramModel[]
  createdAt: Date
  updatedAt: Date
}

// Sem programas (listagens leves)
export type AreaSummary = Omit<AreaModel, 'programs'>

// ── Request bodies ────────────────────────────────────────

export interface CreateAreaBody {
  icon: string
  title: string
  description: string
  order?: number
  active?: boolean
}

export interface UpdateAreaBody extends Partial<CreateAreaBody> {}

export interface ReorderBody {
  ids: string[]
}

export interface CreateProgramBody {
  areaId?: string
  name: string
  duration: string
  mode: string
  price: string
  startDate: string
  description: string
  active?: boolean
}

export interface UpdateProgramBody extends Partial<CreateProgramBody> {}

// ── Query params ──────────────────────────────────────────

export interface AreaQuery {
  active?: 'true' | 'false'
  search?: string
}

export interface ProgramQuery {
  active?: 'true' | 'false'
  search?: string
  mode?: string
  areaId?: string
}

// ── API Responses ─────────────────────────────────────────

export interface AreaResponse {
  success: boolean
  message?: string
  data: AreaModel
}

export interface AreaListResponse {
  success: boolean
  data: AreaModel[]
}

export interface ProgramResponse {
  success: boolean
  message?: string
  data: ProgramModel
}

export interface ProgramListResponse {
  success: boolean
  data: ProgramModel[]
}

export interface ToggleResponse {
  success: boolean
  data: {
    id: string
    active: boolean
  }
}
