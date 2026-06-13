// ══════════════════════════════════════════════════════════
//  PROGRAM TYPES  (standalone — acesso directo sem passar pela área)
// ══════════════════════════════════════════════════════════

// ── Modelo completo ───────────────────────────────────────

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

// Com dados da área incluídos
export interface ProgramWithArea extends ProgramModel {
  area: {
    id: string
    title: string
    icon: string
  }
}

// ── Request bodies ────────────────────────────────────────

export interface CreateProgramBody {
  areaId: string // obrigatório — qual área pertence
  name: string
  duration: string
  mode: string
  price: string
  startDate: string
  description: string
  active?: boolean
}

export interface UpdateProgramBody {
  areaId?: string // permite mover programa para outra área
  name?: string
  duration?: string
  mode?: string
  price?: string
  startDate?: string
  description?: string
  active?: boolean
}

// ── Query params ──────────────────────────────────────────

export interface ProgramQuery {
  active?: 'true' | 'false'
  search?: string
  mode?: string
  areaId?: string
}

// ── API Responses ─────────────────────────────────────────

export interface ProgramResponse {
  success: boolean
  message?: string
  data: ProgramWithArea
}

export interface ProgramListResponse {
  success: boolean
  data: ProgramWithArea[]
}

export interface ToggleResponse {
  success: boolean
  data: {
    id: string
    active: boolean
  }
}
