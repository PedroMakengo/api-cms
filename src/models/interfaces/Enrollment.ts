// ══════════════════════════════════════════════════════════
//  ENROLLMENT TYPES
// ══════════════════════════════════════════════════════════

// ── Enums ─────────────────────────────────────────────────

export type EnrollmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

// ── Modelo base (espelha Prisma EnrollmentSubmission) ─────

export interface EnrollmentModel {
  id: string
  programId: string | null
  programName: string // snapshot do nome no momento da inscrição
  areaName: string
  price: string
  name: string
  lastname: string
  email: string
  phone: string
  organization: string | null
  role: string | null // cargo do inscrito
  status: EnrollmentStatus
  statusNote: string | null // nota interna ao alterar estado
  createdAt: Date
  updatedAt: Date
}

// Modelo com relação ao program incluída (retorno de list/getOne)
export interface EnrollmentWithProgram extends EnrollmentModel {
  program: {
    id: string
    name: string
    area: {
      title: string
    }
  } | null
}

// Versão de lista (program sem area aninhada)
export interface EnrollmentListItem extends EnrollmentModel {
  program: {
    id: string
    name: string
  } | null
}

// ── Request bodies ────────────────────────────────────────

export interface CreateEnrollmentBody {
  programId?: string // opcional — inscrição espontânea sem programa específico
  programName: string // sempre obrigatório mesmo sem programId (snapshot)
  areaName: string
  price: string
  name: string
  lastname: string
  email: string
  phone: string
  organization?: string
  role?: string
}

export interface UpdateEnrollmentStatusBody {
  status: EnrollmentStatus
  statusNote?: string // nota interna visível só no CMS
}

// ── Query params ──────────────────────────────────────────

export interface EnrollmentQuery {
  status?: EnrollmentStatus
  search?: string // pesquisa em name, lastname, email, programName
}

// ── Stats ─────────────────────────────────────────────────

export interface EnrollmentStats {
  total: number
  pending: number
  confirmed: number
  cancelled: number
}

// ── Update status result ──────────────────────────────────

export interface StatusUpdateResult {
  id: string
  status: EnrollmentStatus
  statusNote: string | null
  updatedAt: Date
}

// ── API Responses ─────────────────────────────────────────

export interface EnrollmentResponse {
  success: boolean
  message?: string
  data: EnrollmentWithProgram
}

export interface EnrollmentListResponse {
  success: boolean
  data: EnrollmentListItem[]
}

export interface EnrollmentStatsResponse {
  success: boolean
  data: EnrollmentStats
}
