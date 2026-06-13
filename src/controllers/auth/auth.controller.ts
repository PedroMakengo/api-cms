import { Request, Response } from 'express'
import { z } from 'zod'
import { ok, noContent, badRequest, serverError } from '../../utils/response'
import { authService } from '../../services/auth/auth.service'

// ── Validation schemas ────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Password obrigatória'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
})

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z
    .string()
    .length(6, 'OTP deve ter 6 dígitos')
    .regex(/^\d+$/, 'OTP só pode conter números'),
})

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6).regex(/^\d+$/),
  newPassword: z
    .string()
    .min(8, 'Password mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter pelo menos uma maiúscula')
    .regex(/[a-z]/, 'Deve conter pelo menos uma minúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos um número'),
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
})

// ── Controller ────────────────────────────────────────────
export class AuthController {
  /**
   * POST /auth/login
   * Body: { email, password }
   */
  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body)
      return ok(res, result, 'Login efectuado com sucesso')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * POST /auth/refresh
   * Body: { refreshToken }
   */
  async refresh(req: Request, res: Response) {
    try {
      const tokens = await authService.refresh(req.body)
      return ok(res, tokens)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * POST /auth/forgot-password
   * Body: { email }
   * Envia OTP por email — resposta sempre 204 para não revelar se o email existe
   */
  async forgotPassword(req: Request, res: Response) {
    try {
      await authService.forgotPassword(req.body)
      return noContent(res)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * POST /auth/verify-otp
   * Body: { email, otp }
   * Valida o OTP sem redefinir a password (para o step intermédio do frontend)
   */
  async verifyOtp(req: Request, res: Response) {
    try {
      await authService.verifyOtp(req.body)
      return ok(res, null, 'Código OTP válido')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * POST /auth/reset-password
   * Body: { email, otp, newPassword }
   */
  async resetPassword(req: Request, res: Response) {
    try {
      await authService.resetPassword(req.body)
      return ok(res, null, 'Password redefinida com sucesso')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * GET /auth/me
   * Header: Authorization: Bearer <token>
   * Requer: authenticate middleware
   */
  async me(req: Request, res: Response) {
    try {
      const user = await authService.me(req.user!.sub)
      return ok(res, user)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * POST /auth/logout
   * Header: Authorization: Bearer <token>
   * Stateless JWT — apenas sinaliza ao client para limpar o token
   */
  async logout(_req: Request, res: Response) {
    return noContent(res)
  }
}

export const authController = new AuthController()
