import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import type {
  JwtPayload,
  RefreshPayload,
  AuthTokens,
} from '../models/interfaces/user/auth/AuthRequest'
import { Role } from '@prisma/client'

export function signAccessToken(
  payload: Omit<JwtPayload, 'iat' | 'exp'>,
): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  })
}

export function signRefreshToken(sub: string): string {
  return jwt.sign({ sub }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn as jwt.SignOptions['expiresIn'],
  })
}

export function buildTokens(user: {
  id: string
  email: string
  role: Role
}): AuthTokens {
  const accessToken = signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  })
  const refreshToken = signRefreshToken(user.id)
  const decoded = jwt.decode(accessToken) as JwtPayload
  return {
    accessToken,
    refreshToken,
    expiresIn: decoded.exp! - decoded.iat!,
  }
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload
}

export function verifyRefreshToken(token: string): RefreshPayload {
  return jwt.verify(token, env.jwtRefreshSecret) as RefreshPayload
}
