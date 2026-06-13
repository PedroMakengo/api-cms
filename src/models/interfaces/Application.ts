// ══════════════════════════════════════════════════════════
//  APPLICATION TYPES  (JobApplication)
// ══════════════════════════════════════════════════════════

// ── Enum ──────────────────────────────────────────────────

export type ApplyStatus =
  | 'PENDING'
  | 'REVIEWING'
  | 'INTERVIEW'
  | 'REJECTED'
  | 'HIRED'

// ── Modelo base (espelha Prisma JobApplication) ───────────

export interface ApplicationModel {
  id: string
  jobId: string
  name: string
  lastname: string
  email: string
  phone: string
  linkedin: string | null
  portfolio: string | null
  coverLetter: string
  cvUrl: string | null
  status: ApplyStatus
  statusNote: string | null
  reviewedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

// Com dados da vaga incluídos
export interface ApplicationWithJob extends ApplicationModel {
  job: {
    id: string
    title: string
    department: string
  }
}

// ── Request bodies ────────────────────────────────────────

export interface CreateApplicationBody {
  jobId: string
  name: string
  lastname: string
  email: string
  phone: string
  linkedin?: string
  portfolio?: string
  coverLetter: string
}

export interface UpdateApplicationStatusBody {
  status: ApplyStatus
  statusNote?: string
}

// ── Query params ──────────────────────────────────────────

export interface ApplicationQuery {
  status?: ApplyStatus
  jobId?: string
  search?: string
}

// ── Stats por vaga ────────────────────────────────────────

export interface ApplicationStatsByJob {
  jobId: string
  jobTitle: string
  total: number
  PENDING: number
  REVIEWING: number
  INTERVIEW: number
  REJECTED: number
  HIRED: number
}

// ── Status update result ──────────────────────────────────

export interface ApplicationStatusResult {
  id: string
  status: ApplyStatus
  statusNote: string | null
  updatedAt: Date
  job: {
    id: string
    title: string
    department: string
  }
}

// ── API Responses ─────────────────────────────────────────

export interface ApplicationResponse {
  success: boolean
  message?: string
  data: ApplicationWithJob
}

export interface ApplicationListResponse {
  success: boolean
  data: ApplicationWithJob[]
}

export interface ApplicationStatsResponse {
  success: boolean
  data: ApplicationStatsByJob
}
