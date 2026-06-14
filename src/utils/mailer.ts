import nodemailer from 'nodemailer'
import { env } from '../config/env'

// ── Transporter singleton ─────────────────────────────────
let _transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
  if (_transporter) return _transporter

  _transporter = nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port,
    secure: env.mail.secure, // true = SSL/465, false = TLS/587
    auth: {
      user: env.mail.user,
      pass: env.mail.pass, // Gmail: usar App Password (não a senha normal)
    },
    tls: {
      rejectUnauthorized: false, // Útil em desenvolvimento
    },
  })

  return _transporter
}

// ── Base send ─────────────────────────────────────────────
export async function sendMail(options: {
  to: string
  subject: string
  html: string
  text?: string
}): Promise<void> {
  const transporter = getTransporter()

  await transporter.sendMail({
    from: env.mail.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text ?? options.html.replace(/<[^>]+>/g, ''),
  })
}

// ── Verificar ligação SMTP (útil no startup) ──────────────
export async function verifyMailConnection(): Promise<boolean> {
  try {
    const transporter = getTransporter()
    await transporter.verify()
    return true
  } catch (err) {
    console.warn('[Mailer] SMTP connection failed:', (err as Error).message)
    return false
  }
}
