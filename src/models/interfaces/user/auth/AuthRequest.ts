import { Role } from '@prisma/client'

// ── JWT payloads ──────────────────────────────────────────
export interface JwtPayload {
  sub: string // AdminUser.id
  email: string
  role: Role
  iat?: number
  exp?: number
}

export interface RefreshPayload {
  sub: string // AdminUser.id
  iat?: number
  exp?: number
}

// ── Request bodies ────────────────────────────────────────
export interface LoginBody {
  email: string
  password: string
}

export interface ForgotPasswordBody {
  email: string
}

export interface VerifyOtpBody {
  email: string
  otp: string
}

export interface ResetPasswordBody {
  email: string
  otp: string
  newPassword: string
}

export interface RefreshTokenBody {
  refreshToken: string
}

// ── Responses ─────────────────────────────────────────────
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number // seconds
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  lastLogin: Date | null
}
