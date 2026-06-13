import { env } from '../config/env'

/** Gera um código OTP numérico de 6 dígitos */
export function generateOtp(): string {
  return String(Math.floor(100_000 + Math.random() * 900_000))
}

/** Devolve o Date de expiração do OTP */
export function otpExpiresAt(): Date {
  const d = new Date()
  d.setMinutes(d.getMinutes() + env.otpExpiresMinutes)
  return d
}

/**
 * Simula o envio de email.
 * Substituir pelo serviço real (Nodemailer, Resend, SendGrid, etc.)
 */
export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  // TODO: integrar serviço de email
  console.log(
    `[OTP] Para: ${email} | Código: ${otp} | Expira em ${env.otpExpiresMinutes} min`,
  )
}
