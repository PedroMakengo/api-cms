// ══════════════════════════════════════════════════════════
//  USER TYPES  (AdminUser)
// ══════════════════════════════════════════════════════════

// ── Enum ──────────────────────────────────────────────────

export type Role = 'SUPERADMIN' | 'EDITOR'

// ── Modelo (sem password — nunca exposta) ─────────────────

export interface AdminUserModel {
  id: string
  email: string
  name: string
  role: Role
  active: boolean
  lastLogin: Date | null
  createdAt: Date
  updatedAt: Date
}

// ── Request bodies ────────────────────────────────────────

export interface CreateUserBody {
  email: string
  password: string
  name: string
  role?: Role
  active?: boolean
}

export interface UpdateUserBody {
  email?: string
  name?: string
  role?: Role
  active?: boolean
  password?: string // opcional — só altera se fornecido
}

// ── Toggle result ─────────────────────────────────────────

export interface ToggleActiveResult {
  id: string
  active: boolean
}

// ── API Responses ─────────────────────────────────────────

export interface UserResponse {
  success: boolean
  message?: string
  data: AdminUserModel
}

export interface UserListResponse {
  success: boolean
  data: AdminUserModel[]
}
