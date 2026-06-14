// ── Base layout ───────────────────────────────────────────
function base(content: string): string {
  return `
  <!DOCTYPE html>
  <html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Instituto Mirabilis</title>
  </head>
  <body style="margin:0;padding:0;background:#080D09;font-family:'DM Sans',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#080D09;padding:40px 20px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0D1510;border:1px solid rgba(237,244,239,0.08);border-radius:12px;overflow:hidden;">

            <!-- Header -->
            <tr>
              <td style="background:#03582b;padding:28px 36px;">
                <p style="margin:0;font-size:13px;font-weight:700;color:#5DB87A;letter-spacing:0.20em;text-transform:uppercase;font-family:'Poppins',Arial,sans-serif;">
                  Instituto Mirabilis
                </p>
                <p style="margin:4px 0 0;font-size:10px;color:rgba(255,255,255,0.55);letter-spacing:0.12em;text-transform:uppercase;">
                  Administração & Negócios
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:36px 36px 28px;">
                ${content}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 36px 28px;border-top:1px solid rgba(237,244,239,0.07);">
                <p style="margin:0;font-size:11px;color:rgba(237,244,239,0.25);line-height:1.6;text-align:center;">
                  Este e-mail foi enviado automaticamente pelo sistema CMS do Instituto Mirabilis.<br/>
                  Por favor não responda a este e-mail.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
}

// ── Helpers de estilo ─────────────────────────────────────
const h1 = (text: string) =>
  `<h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#EDF4EF;letter-spacing:-0.02em;font-family:'Poppins',Arial,sans-serif;">${text}</h1>`

const p = (text: string) =>
  `<p style="margin:0 0 16px;font-size:14px;color:rgba(237,244,239,0.65);line-height:1.75;">${text}</p>`

const divider = () =>
  `<div style="margin:24px 0;height:1px;background:rgba(237,244,239,0.07);"></div>`

const btn = (label: string, href: string) => `
  <a href="${href}" style="display:inline-block;background:#03582b;color:#ffffff;font-family:'Poppins',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;text-decoration:none;padding:13px 28px;border-radius:6px;margin-top:8px;">
    ${label}
  </a>
`

// ── OTP box ───────────────────────────────────────────────
const otpBox = (otp: string) => `
  <div style="margin:24px 0;padding:20px;background:rgba(3,88,43,0.12);border:1px solid rgba(3,88,43,0.35);border-radius:8px;text-align:center;">
    <p style="margin:0 0 6px;font-size:11px;font-weight:600;color:rgba(237,244,239,0.35);letter-spacing:0.16em;text-transform:uppercase;font-family:'Poppins',Arial,sans-serif;">
      Código de verificação
    </p>
    <div style="font-family:'Courier New',monospace;font-size:38px;font-weight:900;color:#5DB87A;letter-spacing:0.25em;line-height:1;">
      ${otp}
    </div>
  </div>
`

// ════════════════════════════════════════════════════════
// TEMPLATES EXPORTADOS
// ════════════════════════════════════════════════════════

// ── 1. Welcome — nova conta criada ────────────────────────
export function welcomeTemplate(opts: {
  name: string
  email: string
  password: string
  role: string
  loginUrl?: string
}): string {
  const roleLabel = opts.role === 'SUPERADMIN' ? 'Superadministrador' : 'Editor'

  return base(`
    ${h1(`Bem-vindo, ${opts.name}!`)}
    ${p('A sua conta de acesso ao CMS do Instituto Mirabilis foi criada com sucesso.')}
    ${divider()}

    <p style="margin:0 0 8px;font-size:11px;font-weight:600;color:rgba(237,244,239,0.35);letter-spacing:0.16em;text-transform:uppercase;font-family:'Poppins',Arial,sans-serif;">
      Os seus dados de acesso
    </p>

    <table style="width:100%;margin:8px 0 24px;border-collapse:collapse;">
      ${[
        ['E-mail', opts.email],
        ['Password', opts.password],
        ['Função', roleLabel],
      ]
        .map(
          ([label, value]) => `
        <tr>
          <td style="padding:10px 14px;background:rgba(255,255,255,0.03);border-bottom:1px solid rgba(237,244,239,0.06);font-size:11px;font-weight:600;color:rgba(237,244,239,0.35);letter-spacing:0.10em;text-transform:uppercase;font-family:'Poppins',Arial,sans-serif;width:120px;">
            ${label}
          </td>
          <td style="padding:10px 14px;background:rgba(255,255,255,0.03);border-bottom:1px solid rgba(237,244,239,0.06);font-size:13px;color:#EDF4EF;font-weight:500;font-family:'Courier New',monospace;">
            ${value}
          </td>
        </tr>
      `,
        )
        .join('')}
    </table>

    <p style="margin:0 0 20px;font-size:13px;color:rgba(237,244,239,0.45);line-height:1.65;">
      Por razões de segurança, recomendamos que altere a sua password após o primeiro acesso.
    </p>

    ${btn('Aceder ao CMS', opts.loginUrl ?? 'http://localhost:3000/admin/login')}
  `)
}

// ── 2. OTP — recuperação de password ─────────────────────
export function otpTemplate(opts: {
  name: string
  email: string
  otp: string
  expiresIn: number // minutos
}): string {
  return base(`
    ${h1('Recuperação de password')}
    ${p(`Olá, <strong style="color:#EDF4EF;">${opts.name}</strong>. Recebemos um pedido de recuperação de password para a sua conta.`)}
    ${p(`Utilize o código abaixo para redefinir a sua password. O código expira em <strong style="color:#EDF4EF;">${opts.expiresIn} minutos</strong>.`)}

    ${otpBox(opts.otp)}

    <p style="margin:16px 0 0;font-size:12px;color:rgba(237,244,239,0.30);line-height:1.6;">
      Se não solicitou esta recuperação, pode ignorar este e-mail em segurança. 
      A sua password não será alterada.
    </p>
  `)
}

// ── 3. Password alterada — confirmação ────────────────────
export function passwordChangedTemplate(opts: {
  name: string
  email: string
}): string {
  return base(`
    ${h1('Password alterada')}
    ${p(`Olá, <strong style="color:#EDF4EF;">${opts.name}</strong>.`)}
    ${p('A sua password foi alterada com sucesso. Pode agora iniciar sessão com as novas credenciais.')}
    ${divider()}
    <p style="margin:0 0 20px;font-size:13px;color:rgba(237,244,239,0.45);line-height:1.65;">
      Se não foi você a alterar a password, contacte o administrador do sistema imediatamente.
    </p>
    ${btn('Ir para o login', 'http://localhost:3000/admin/login')}
  `)
}
