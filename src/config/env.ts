import 'dotenv/config'

function required(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing environment variable: ${key}`)
  return value
}

export const env = {
  port: parseInt(process.env.PORT ?? '3333'),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isDev: process.env.NODE_ENV !== 'production',

  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  jwtRefreshSecret: required('JWT_REFRESH_SECRET'),
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',

  otpExpiresMinutes: parseInt(process.env.OTP_EXPIRES_MINUTES ?? '10'),

  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',

  // ── Email — Nodemailer ────────────────────────────────
  mail: {
    host: process.env.MAIL_HOST ?? 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT ?? '587'),
    secure: process.env.MAIL_SECURE === 'true', // false = TLS/587, true = SSL/465
    user: process.env.MAIL_USER ?? '',
    pass: process.env.MAIL_PASS ?? '',
    from: process.env.MAIL_FROM ?? 'Instituto Mirabilis <noreply@mai.ao>',
  },
} as const
