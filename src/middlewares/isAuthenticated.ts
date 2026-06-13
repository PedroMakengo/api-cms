import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import { unauthorized, forbidden } from '../utils/response'
import { Role } from '@prisma/client'
import { JwtPayload } from '../models/interfaces/user/auth/AuthRequest'

// Extender o tipo Request do Express com o user autenticado
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

/** Verifica o Bearer token e injeta req.user */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    return unauthorized(res, 'Token não fornecido')
  }

  const token = header.split(' ')[1]

  try {
    req.user = verifyAccessToken(token)
    next()
  } catch {
    return unauthorized(res, 'Token inválido ou expirado')
  }
}

/** Restringe acesso a roles específicas */
export function authorize(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return unauthorized(res)

    if (!roles.includes(req.user.role)) {
      return forbidden(res, `Acesso restrito a: ${roles.join(', ')}`)
    }

    next()
  }
}
