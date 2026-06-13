import { Request, Response } from 'express'
import { z } from 'zod'
import type {
  CreateApplicationBody,
  UpdateApplicationStatusBody,
  ApplicationQuery,
} from '../../models/interfaces/Application'
import { ok, created, noContent, serverError } from '../../utils/response'
import { applicationService } from '../../services/application/application.service'

// ── Zod schemas ───────────────────────────────────────────

export const createApplicationSchema = z.object({
  jobId: z.string().cuid('jobId inválido'),
  name: z.string().min(2, 'Nome mínimo 2 caracteres'),
  lastname: z.string().min(2, 'Apelido mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(9, 'Telefone inválido'),
  linkedin: z.string().url('URL LinkedIn inválido').optional(),
  portfolio: z.string().url('URL portfólio inválido').optional(),
  coverLetter: z.string().min(50, 'Carta de motivação mínimo 50 caracteres'),
})

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWING', 'INTERVIEW', 'REJECTED', 'HIRED'], {
    errorMap: () => ({
      message:
        'Estado inválido. Valores aceites: PENDING, REVIEWING, INTERVIEW, REJECTED, HIRED',
    }),
  }),
  statusNote: z.string().min(1).max(500).optional(),
})

// ── Controller ────────────────────────────────────────────

export class ApplicationController {
  /**
   * GET /applications
   * Query: ?status=PENDING|...  ?jobId=cuid  ?search=texto
   * Requer: authenticate
   */
  async list(req: Request, res: Response) {
    try {
      const query: ApplicationQuery = {
        status: req.query.status as ApplicationQuery['status'],
        jobId: req.query.jobId as string | undefined,
        search: req.query.search as string | undefined,
      }
      const applications = await applicationService.list(query)
      return ok(res, applications)
    } catch (err: any) {
      return serverError(res, err)
    }
  }

  /**
   * GET /applications/:id
   * Devolve candidatura com dados da vaga incluídos
   * Requer: authenticate
   */
  async getOne(req: Request, res: Response) {
    try {
      const application = await applicationService.getOne(req.params.id)
      return ok(res, application)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * GET /applications/stats/:jobId
   * Devolve contagem de candidaturas por estado para uma vaga
   * Requer: authenticate + EDITOR+
   */
  async statsByJob(req: Request, res: Response) {
    try {
      const data = await applicationService.statsByJob(req.params.jobId)
      return ok(res, data)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * POST /applications
   * Público — página de recrutamento do website
   * Body: CreateApplicationBody
   */
  async create(req: Request, res: Response) {
    try {
      const body: CreateApplicationBody = req.body
      const application = await applicationService.create(body)
      return created(res, application, 'Candidatura enviada com sucesso')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * PATCH /applications/:id/status
   * Body: { status: ApplyStatus, statusNote?: string }
   * Requer: authenticate + EDITOR+
   */
  async updateStatus(req: Request, res: Response) {
    try {
      const body: UpdateApplicationStatusBody = req.body
      const result = await applicationService.updateStatus(req.params.id, body)

      const messages: Record<string, string> = {
        PENDING: 'Candidatura marcada como pendente',
        REVIEWING: 'Candidatura em revisão',
        INTERVIEW: 'Candidato convocado para entrevista',
        REJECTED: 'Candidatura rejeitada',
        HIRED: 'Candidato contratado',
      }

      return ok(res, result, messages[body.status])
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * DELETE /applications/:id
   * Requer: authenticate + SUPERADMIN
   */
  async remove(req: Request, res: Response) {
    try {
      await applicationService.delete(req.params.id)
      return noContent(res)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }
}

export const applicationController = new ApplicationController()
