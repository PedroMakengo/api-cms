import bcrypt from 'bcryptjs'
import { generateOtp, otpExpiresAt, sendOtpEmail } from '../../utils/otp'
import { buildTokens, verifyRefreshToken } from '../../utils/jwt'

import type {
  LoginBody,
  ForgotPasswordBody,
  VerifyOtpBody,
  ResetPasswordBody,
  RefreshTokenBody,
  AuthTokens,
  AuthUser,
} from '../../models/interfaces/user/auth/AuthRequest'
import prisma from '../../prisma'

export class AuthService {
  // ── Login ───────────────────────────────────────────────
  async login(
    body: LoginBody,
  ): Promise<{ tokens: AuthTokens; user: AuthUser }> {
    const { email, password } = body

    const user = await prisma.adminUser.findUnique({ where: { email } })

    if (!user || !user.active) {
      throw { status: 401, message: 'Credenciais inválidas' }
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      throw { status: 401, message: 'Credenciais inválidas' }
    }

    // Actualizar lastLogin
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    const tokens: AuthTokens = buildTokens(user)

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
    }

    return { tokens, user: authUser }
  }

  // ── Refresh token ───────────────────────────────────────
  async refresh(body: RefreshTokenBody): Promise<AuthTokens> {
    const { refreshToken } = body

    let payload
    try {
      payload = verifyRefreshToken(refreshToken)
    } catch {
      throw { status: 401, message: 'Refresh token inválido ou expirado' }
    }

    const user = await prisma.adminUser.findUnique({
      where: { id: payload.sub },
    })

    if (!user || !user.active) {
      throw { status: 401, message: 'Utilizador não encontrado ou inactivo' }
    }

    return buildTokens(user)
  }

  // ── Forgot password — enviar OTP ────────────────────────
  async forgotPassword(body: ForgotPasswordBody): Promise<void> {
    const { email } = body

    const user = await prisma.adminUser.findUnique({ where: { email } })

    // Não revelar se o email existe — resposta sempre igual
    if (!user || !user.active) return

    // Invalidar tokens anteriores do mesmo email
    await prisma.passwordResetToken.updateMany({
      where: { email, used: false },
      data: { used: true },
    })

    const otp = generateOtp()
    const expires = otpExpiresAt()

    await prisma.passwordResetToken.create({
      data: { email, token: otp, otp, expires },
    })

    await sendOtpEmail(email, otp)
  }

  // ── Verificar OTP (opcional — para validar antes do step de nova password) ──
  async verifyOtp(body: VerifyOtpBody): Promise<void> {
    const { email, otp } = body

    const record = await prisma.passwordResetToken.findFirst({
      where: {
        email,
        otp,
        used: false,
        expires: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!record) {
      throw { status: 400, message: 'Código OTP inválido ou expirado' }
    }
  }

  // ── Reset password ──────────────────────────────────────
  async resetPassword(body: ResetPasswordBody): Promise<void> {
    const { email, otp, newPassword } = body

    const record = await prisma.passwordResetToken.findFirst({
      where: {
        email,
        otp,
        used: false,
        expires: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!record) {
      throw { status: 400, message: 'Código OTP inválido ou expirado' }
    }

    const hashed = await bcrypt.hash(newPassword, 12)

    // Actualizar password + marcar token como usado (transacção)
    await prisma.$transaction([
      prisma.adminUser.update({
        where: { email },
        data: { password: hashed },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { used: true },
      }),
    ])
  }

  // ── Me — dados do utilizador autenticado ─────────────────
  async me(userId: string): Promise<AuthUser> {
    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        lastLogin: true,
        active: true,
      },
    })

    if (!user || !user.active) {
      throw { status: 401, message: 'Utilizador não encontrado' }
    }

    return user
  }
}

export const authService = new AuthService()
