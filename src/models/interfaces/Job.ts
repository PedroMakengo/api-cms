// ══════════════════════════════════════════════════════════
//  JOB TYPES
// ══════════════════════════════════════════════════════════

// ── Enums ─────────────────────────────────────────────────

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP'
export type JobLocation = 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO'
export type JobStatus = 'OPEN' | 'CLOSED' | 'PAUSED'

// ── Modelo base (espelha Prisma Job) ──────────────────────

export interface JobModel {
  id: string
  title: string
  department: string
  location: JobLocation
  type: JobType
  area: string
  description: string
  requirements: string[] // JSON no MySQL, deserializado como array
  benefits: string[] // JSON no MySQL, deserializado como array
  salary: string | null
  deadline: string | null
  featured: boolean
  status: JobStatus
  createdAt: Date
  updatedAt: Date
}

// Com contagem de candidaturas
export interface JobWithCount extends JobModel {
  _count: {
    applications: number
  }
}

// ── Request bodies ────────────────────────────────────────

export interface CreateJobBody {
  title: string
  department: string
  location?: JobLocation
  type?: JobType
  area: string
  description: string
  requirements: string[]
  benefits: string[]
  salary?: string
  deadline?: string
  featured?: boolean
  status?: JobStatus
}

export interface UpdateJobBody extends Partial<CreateJobBody> {}

export interface UpdateJobStatusBody {
  status: JobStatus
}

// ── Query params ──────────────────────────────────────────

export interface JobQuery {
  status?: JobStatus
  type?: JobType
  location?: JobLocation
  search?: string
  featured?: 'true' | 'false'
}

// ── Stats ─────────────────────────────────────────────────

export interface JobStats {
  total: number
  open: number
  closed: number
  paused: number
  featured: number
}

// ── Status update result ──────────────────────────────────

export interface JobStatusResult {
  id: string
  status: JobStatus
}

// ── API Responses ─────────────────────────────────────────

export interface JobResponse {
  success: boolean
  message?: string
  data: JobWithCount
}

export interface JobListResponse {
  success: boolean
  data: JobWithCount[]
}

export interface JobStatsResponse {
  success: boolean
  data: JobStats
}
