import { Request, Response } from 'express'
import { z } from 'zod'
import { jobService } from '../../services/job/job.service'
import type {
  CreateJobBody,
  UpdateJobBody,
  UpdateJobStatusBody,
  JobQuery,
} from '../../models/interfaces/Job'
import { ok, created, noContent, serverError } from '../../utils/response'

// ── Zod schemas ───────────────────────────────────────────

export const createJobSchema = z.object({
  title: z.string().min(5, 'Título mínimo 5 caracteres'),
  department: z.string().min(2, 'Departamento obrigatório'),
  location: z.enum(['PRESENCIAL', 'REMOTO', 'HIBRIDO']).optional(),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']).optional(),
  area: z.string().min(2, 'Área obrigatória'),
  description: z.string().min(20, 'Descrição mínimo 20 caracteres'),
  requirements: z
    .array(z.string().min(1))
    .min(1, 'Pelo menos um requisito obrigatório'),
  benefits: z
    .array(z.string().min(1))
    .min(1, 'Pelo menos um benefício obrigatório'),
  salary: z.string().optional(),
  deadline: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['OPEN', 'CLOSED', 'PAUSED']).optional(),
})

export const updateJobSchema = createJobSchema.partial()

export const updateJobStatusSchema = z.object({
  status: z.enum(['OPEN', 'CLOSED', 'PAUSED'], {
    errorMap: () => ({
      message: 'Estado inválido. Valores aceites: OPEN, CLOSED, PAUSED',
    }),
  }),
})

// ── Controller ────────────────────────────────────────────

export class JobController {
  /**
   * GET /jobs
   * Query: ?status=OPEN|CLOSED|PAUSED  ?type=FULL_TIME|...
   *        ?location=PRESENCIAL|...  ?featured=true|false  ?search=texto
   * Público — página de recrutamento
   */
  async list(req: Request, res: Response) {
    try {
      const query: JobQuery = {
        status: req.query.status as JobQuery['status'],
        type: req.query.type as JobQuery['type'],
        location: req.query.location as JobQuery['location'],
        featured: req.query.featured as 'true' | 'false' | undefined,
        search: req.query.search as string | undefined,
      }
      const jobs = await jobService.list(query)
      return ok(res, jobs)
    } catch (err: any) {
      return serverError(res, err)
    }
  }

  /**
   * GET /jobs/stats
   * Devolve: { total, open, closed, paused, featured }
   * Requer: authenticate + EDITOR+
   */
  async stats(_req: Request, res: Response) {
    try {
      const data = await jobService.stats()
      return ok(res, data)
    } catch (err: any) {
      return serverError(res, err)
    }
  }

  /**
   * GET /jobs/:id
   * Público — detalhe da vaga com contagem de candidaturas
   */
  async getOne(req: Request, res: Response) {
    try {
      const job = await jobService.getOne(req.params.id)
      return ok(res, job)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * POST /jobs
   * Body: CreateJobBody
   * Requer: authenticate + EDITOR+
   */
  async create(req: Request, res: Response) {
    try {
      const body: CreateJobBody = req.body
      const job = await jobService.create(body)
      return created(res, job, 'Vaga criada com sucesso')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * PUT /jobs/:id
   * Body: UpdateJobBody (todos os campos opcionais)
   * Requer: authenticate + EDITOR+
   */
  async update(req: Request, res: Response) {
    try {
      const body: UpdateJobBody = req.body
      const job = await jobService.update(req.params.id, body)
      return ok(res, job, 'Vaga actualizada com sucesso')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * PATCH /jobs/:id/status
   * Body: { status: JobStatus }
   * Requer: authenticate + EDITOR+
   */
  async updateStatus(req: Request, res: Response) {
    try {
      const body: UpdateJobStatusBody = req.body
      const result = await jobService.updateStatus(req.params.id, body.status)

      const messages: Record<string, string> = {
        OPEN: 'Vaga aberta para candidaturas',
        CLOSED: 'Vaga encerrada',
        PAUSED: 'Vaga pausada temporariamente',
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
   * DELETE /jobs/:id
   * Requer: authenticate + SUPERADMIN
   */
  async remove(req: Request, res: Response) {
    try {
      await jobService.delete(req.params.id)
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

export const jobController = new JobController()
