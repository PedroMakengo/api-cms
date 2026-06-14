import { Request, Response } from 'express'
import { z } from 'zod'
import { ok, created, noContent, serverError } from '../../utils/response'
import {
  CreateEnrollmentBody,
  EnrollmentQuery,
  UpdateEnrollmentStatusBody,
} from '../../models/interfaces/Enrollment'
import { enrollmentService } from '../../services/enrollment/enrollment.service'

// ── Zod schemas ───────────────────────────────────────────

export const createEnrollmentSchema = z.object({
  programId: z.string().cuid('programId inválido').optional(),
  programName: z.string().min(2, 'Nome do programa obrigatório'),
  areaName: z.string().min(2, 'Nome da área obrigatório'),
  price: z.string().min(1, 'Preço obrigatório'),
  name: z.string().min(2, 'Nome mínimo 2 caracteres'),
  lastname: z.string().min(2, 'Apelido mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(9, 'Telefone inválido'),
  organization: z.string().min(2).optional(),
  role: z.string().min(2).optional(),
})

export const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED'], {
    error: () => ({
      message:
        'Estado inválido. Valores aceites: PENDING, CONFIRMED, CANCELLED',
    }),
  }),
  statusNote: z.string().min(1).max(500).optional(),
})

// ── Controller ────────────────────────────────────────────

export class EnrollmentController {
  /**
   * GET /enrollments
   * Query: ?status=PENDING|CONFIRMED|CANCELLED  ?search=texto
   * Requer: authenticate
   */
  async list(req: Request, res: Response) {
    try {
      const query: EnrollmentQuery = {
        status: req.query.status as EnrollmentQuery['status'],
        search: req.query.search as string | undefined,
      }
      const enrollments = await enrollmentService.list(query)
      return ok(res, enrollments)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * GET /enrollments/stats
   * Devolve: { total, pending, confirmed, cancelled }
   * Requer: authenticate
   */
  async stats(_req: Request, res: Response) {
    try {
      const data = await enrollmentService.stats()
      return ok(res, data)
    } catch (err: any) {
      return serverError(res, err)
    }
  }

  /**
   * GET /enrollments/:id
   * Devolve inscrição com program + area incluídos
   * Requer: authenticate
   */
  async getOne(req: Request, res: Response) {
    try {
      const enrollment = await enrollmentService.getOne(req.params.id)
      return ok(res, enrollment)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * POST /enrollments
   * Público — sheet de inscrição do website
   * Body: CreateEnrollmentBody
   */
  async create(req: Request, res: Response) {
    try {
      const body: CreateEnrollmentBody = req.body
      const enrollment = await enrollmentService.create(body)
      return created(res, enrollment, 'Inscrição recebida com sucesso')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * PATCH /enrollments/:id/status
   * Body: { status: EnrollmentStatus, statusNote?: string }
   * Requer: authenticate + EDITOR+
   */
  async updateStatus(req: Request, res: Response) {
    try {
      const body: UpdateEnrollmentStatusBody = req.body
      const enrollment = await enrollmentService.updateStatus(
        req.params.id,
        body,
      )

      const messages: Record<string, string> = {
        PENDING: 'Inscrição marcada como pendente',
        CONFIRMED: 'Inscrição confirmada com sucesso',
        CANCELLED: 'Inscrição cancelada',
      }

      return ok(res, enrollment, messages[body.status])
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * DELETE /enrollments/:id
   * Requer: authenticate + SUPERADMIN
   */
  async remove(req: Request, res: Response) {
    try {
      await enrollmentService.delete(req.params.id)
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

export const enrollmentController = new EnrollmentController()
