import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../swagger.json'
import { env } from './config/env'
// import routes from './routes'
import { TMP_DIR } from './utils/upload'
import { routes } from './routes'

const app = express()

// ── Middlewares globais ───────────────────────────────────
app.use(
  cors({
    origin: (requestOrigin, callback) => {
      // Permite requisições sem origin (ex: Postman, curl, mobile apps)
      if (!requestOrigin) return callback(null, true)

      const allowed = [
        env.corsOrigin,
        // Garante variantes com e sem protocolo
        env.corsOrigin.replace('http://', 'https://'),
        'http://localhost:3000',
        'http://localhost:3001',
      ]

      if (allowed.includes(requestOrigin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS: origem não permitida — ${requestOrigin}`))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200, // Alguns browsers (IE11) retornam 204 como erro
  }),
)

app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

// Responder explicitamente a preflight OPTIONS em todas as rotas
app.options('*', cors())

// ── Ficheiros estáticos — imagens dos slides ──────────────
// Acesso: GET /uploads/<filename>
app.use('/uploads', express.static(TMP_DIR))

// ── Swagger UI ────────────────────────────────────────────
// Acesso: GET /api-docs
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'MAI API Docs',
    swaggerOptions: {
      persistAuthorization: true, // mantém o Bearer token entre refreshes
      displayRequestDuration: true,
    },
  }),
)

// ── Health check ──────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    env: env.nodeEnv,
    docs: `http://localhost:${env.port}/api-docs`,
    timestamp: new Date().toISOString(),
  })
})

// ── Termos de serviço (exemplo) ───────────────────────────
app.get('/terms', (_req: Request, res: Response) => {
  res.json({ message: 'Termos de serviço do Instituto Mirabilis.' })
})

// ── API routes ────────────────────────────────────────────
app.use('/api/v1', routes)

// ── 404 ───────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Endpoint não encontrado' })
})

// ── Global error handler ──────────────────────────────────
app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction): any => {
    // Erro do Multer
    if (err.name === 'MulterError' || err.message?.includes('suportado')) {
      return res.status(400).json({ success: false, message: err.message })
    }
    // Erro de validação genérico
    if (err instanceof Error) {
      return res.status(400).json({ success: false, message: err.message })
    }
    console.error('[Unhandled Error]', err)
    return res
      .status(500)
      .json({ success: false, message: 'Erro interno do servidor' })
  },
)

// ── Start ─────────────────────────────────────────────────
app.listen(env.port, () => {
  console.log(`\n  MAI API     http://localhost:${env.port}`)
  console.log(`  Swagger UI  http://localhost:${env.port}/api-docs`)
  console.log(`  Uploads     ${TMP_DIR}`)
  console.log(`  Env         ${env.nodeEnv}\n`)
})

export default app
