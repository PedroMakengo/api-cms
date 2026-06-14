/**
 * Seed de DESENVOLVIMENTO — Instituto Mirabilis (MAI) CMS
 *
 * Insere utilizadores de teste e simula o fluxo completo de email:
 *   - Criação de conta → email de boas-vindas
 *   - Token OTP pré-gerado para testar recuperação de password
 *
 * NÃO usar em produção.
 *
 * Executar:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.dev.ts
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'
import { sendMail } from '../src/utils/mailer'
import { verifyMailConnection } from '../src/utils/mailer'
import {
  welcomeTemplate,
  otpTemplate,
  passwordChangedTemplate,
} from '../src/utils/email-templates'

const prisma = new PrismaClient()
const APP_URL = process.env.APP_URL ?? 'http://localhost:3000'
const OTP_MIN = parseInt(process.env.OTP_EXPIRES_MINUTES ?? '10')

// ── Utilizadores de teste ─────────────────────────────────
const DEV_USERS = [
  {
    name: 'Administrador MAI',
    email: 'admin@mai.ao',
    password: 'Admin@MAI2025!',
    role: 'SUPERADMIN' as const,
  },
  {
    name: 'Editor de Conteúdo',
    email: 'editor@mai.ao',
    password: 'Editor@MAI2025!',
    role: 'EDITOR' as const,
  },
]

// OTP fixo para facilitar testes no Swagger / Postman
const DEV_OTP = '123456'

async function main() {
  console.log('\n🌱 Seed de desenvolvimento — MAI CMS\n')

  // ── 0. Verificar ligação SMTP ─────────────────────────
  console.log('── Verificação SMTP ' + '─'.repeat(28))
  const smtpOk = await verifyMailConnection()
  if (smtpOk) {
    console.log('✓ Ligação SMTP estabelecida — emails serão enviados')
  } else {
    console.warn('⚠  SMTP não disponível — emails NÃO serão enviados')
    console.warn('   Verifique MAIL_HOST, MAIL_USER e MAIL_PASS no .env\n')
  }

  // ── 1. Limpar dados de auth ───────────────────────────
  console.log('\n── Limpeza ' + '─'.repeat(35))
  await prisma.passwordResetToken.deleteMany()
  await prisma.adminUser.deleteMany()
  console.log('✓ AdminUsers e PasswordResetTokens limpos')

  // ── 2. Criar utilizadores ─────────────────────────────
  console.log('\n── Utilizadores ' + '─'.repeat(30))
  const created = []

  for (const u of DEV_USERS) {
    const hashed = await bcrypt.hash(u.password, 12)
    const user = await prisma.adminUser.create({
      data: {
        email: u.email,
        password: hashed,
        name: u.name,
        role: u.role,
        active: true,
        lastLogin: u.role === 'SUPERADMIN' ? new Date() : null,
      },
    })
    created.push({ ...user, plainPassword: u.password })
    console.log(`✓ ${user.role.padEnd(12)} ${user.email}`)
  }

  // ── 3. Enviar emails de boas-vindas ───────────────────
  if (smtpOk) {
    console.log('\n── Emails de boas-vindas ' + '─'.repeat(21))
    for (const u of created) {
      try {
        await sendMail({
          to: u.email,
          subject: '[MAI CMS] A sua conta foi criada — Dados de acesso',
          html: welcomeTemplate({
            name: u.name,
            email: u.email,
            password: u.plainPassword,
            role: u.role === 'SUPERADMIN' ? 'Superadministrador' : 'Editor',
            loginUrl: `${APP_URL}/admin/login`,
          }),
        })
        console.log(`  ✉  Welcome email enviado → ${u.email}`)
      } catch (err: any) {
        console.warn(`  ✗  Falhou para ${u.email}: ${err.message}`)
      }
    }
  }

  // ── 4. Criar token OTP fixo para testes ──────────────
  console.log('\n── Token OTP de teste ' + '─'.repeat(24))
  const otpExpires = new Date(Date.now() + OTP_MIN * 60 * 1000)

  await prisma.passwordResetToken.create({
    data: {
      email: DEV_USERS[0].email,
      token: DEV_OTP,
      otp: DEV_OTP,
      expires: otpExpires,
      used: false,
    },
  })
  console.log(`✓ Token OTP criado para ${DEV_USERS[0].email}`)
  console.log(`  OTP:     ${DEV_OTP}`)
  console.log(
    `  Expira:  ${otpExpires.toLocaleTimeString('pt-AO')} (${OTP_MIN} min)`,
  )

  // Enviar email de OTP se SMTP disponível
  if (smtpOk) {
    try {
      await sendMail({
        to: DEV_USERS[0].email,
        subject: `[MAI CMS] Código de verificação: ${DEV_OTP}`,
        html: otpTemplate({
          name: DEV_USERS[0].name,
          email: DEV_USERS[0].email,
          otp: DEV_OTP,
          expiresIn: OTP_MIN,
        }),
      })
      console.log(`  ✉  OTP email enviado → ${DEV_USERS[0].email}`)
    } catch (err: any) {
      console.warn(`  ✗  Falhou: ${err.message}`)
    }
  }

  // ── 5. Simular email de password alterada ─────────────
  if (smtpOk) {
    console.log('\n── Email: Password alterada (simulação) ' + '─'.repeat(6))
    try {
      await sendMail({
        to: DEV_USERS[0].email,
        subject: '[MAI CMS] Password alterada com sucesso',
        html: passwordChangedTemplate({
          name: DEV_USERS[0].name,
          email: DEV_USERS[0].email,
        }),
      })
      console.log(`  ✉  Password changed email enviado → ${DEV_USERS[0].email}`)
    } catch (err: any) {
      console.warn(`  ✗  Falhou: ${err.message}`)
    }
  }

  // ── 6. Resumo final ───────────────────────────────────
  console.log('\n' + '═'.repeat(47))
  console.log('✅ Seed concluído!\n')
  console.log('  Credenciais de teste:')
  console.log('  ┌' + '─'.repeat(45) + '┐')
  for (const u of DEV_USERS) {
    const role = u.role === 'SUPERADMIN' ? 'Superadmin' : 'Editor'
    console.log(`  │  ${role.padEnd(12)} ${u.email.padEnd(20)} │`)
    console.log(`  │  Password:  ${u.password.padEnd(32)} │`)
    if (u !== DEV_USERS[DEV_USERS.length - 1])
      console.log('  │' + '─'.repeat(45) + '│')
  }
  console.log('  └' + '─'.repeat(45) + '┘')
  console.log('\n  Fluxo de recuperação de password:')
  console.log(
    `  1. POST /api/v1/auth/forgot-password  { email: "${DEV_USERS[0].email}" }`,
  )
  console.log(
    `  2. POST /api/v1/auth/verify-otp       { email: "${DEV_USERS[0].email}", otp: "${DEV_OTP}" }`,
  )
  console.log(
    `  3. POST /api/v1/auth/reset-password   { email: "${DEV_USERS[0].email}", otp: "${DEV_OTP}", newPassword: "NovaPass@123" }`,
  )
  console.log(
    `\n  Swagger: http://localhost:${process.env.PORT ?? 4000}/api-docs\n`,
  )
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
