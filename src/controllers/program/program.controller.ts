import { Request, Response } from 'express'
import { z } from 'zod'
import { ok, created, noContent, serverError } from '../../utils/response'
import { programService } from '../../services/program/program.service'

// ── Schemas Zod ───────────────────────────────────────────

export const createProgramSchema = z.object({
  areaId: z.string().cuid('areaId deve ser um CUID válido'),
  name: z.string().min(2, 'Nome mínimo 2 caracteres'),
  duration: z.string().min(1, 'Duração obrigatória'),
  mode: z.string().min(1, 'Modalidade obrigatória'),
  price: z.string().min(1, 'Preço obrigatório'),
  startDate: z.string().min(1, 'Data de início obrigatória'),
  description: z.string().min(5, 'Descrição mínimo 5 caracteres'),
  active: z.boolean().optional(),
})

export const updateProgramSchema = z.object({
  areaId: z.string().cuid().optional(),
  name: z.string().min(2).optional(),
  duration: z.string().min(1).optional(),
  mode: z.string().min(1).optional(),
  price: z.string().min(1).optional(),
  startDate: z.string().min(1).optional(),
  description: z.string().min(5).optional(),
  active: z.boolean().optional(),
})

export const bulkToggleSchema = z.object({
  areaId: z.string().cuid('areaId deve ser um CUID válido'),
  active: z.boolean(),
})

// ── Controller ────────────────────────────────────────────

export class ProgramController {
  /**
   * GET /programs
   * Query: ?active=true&search=banca&mode=Presencial&areaId=xxx
   */
  async list(req: Request, res: Response) {
    try {
      const programs = await programService.listPrograms({
        active: req.query.active as 'true' | 'false' | undefined,
        search: req.query.search as string | undefined,
        mode: req.query.mode as string | undefined,
        areaId: req.query.areaId as string | undefined,
      })
      return ok(res, programs)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * GET /programs/:id
   */
  async getOne(req: Request, res: Response) {
    try {
      const program = await programService.getProgram(req.params.id)
      return ok(res, program)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * POST /programs
   * Body: CreateProgramBody (inclui areaId)
   */
  async create(req: Request, res: Response) {
    try {
      const program = await programService.createProgram(req.body)
      return created(res, program, 'Programa criado com sucesso')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * PUT /programs/:id
   * Body: UpdateProgramBody (areaId opcional — permite mover de área)
   */
  async update(req: Request, res: Response) {
    try {
      const program = await programService.updateProgram(
        req.params.id,
        req.body,
      )
      return ok(res, program, 'Programa actualizado com sucesso')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * PATCH /programs/:id/toggle
   * Activa ou desactiva o programa
   */
  async toggle(req: Request, res: Response) {
    try {
      const result = await programService.toggleProgram(req.params.id)
      return ok(res, result)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * PATCH /programs/bulk-toggle
   * Body: { areaId, active }
   * Activa ou desactiva todos os programas de uma área de uma vez
   */
  async bulkToggle(req: Request, res: Response) {
    try {
      const { areaId, active } = req.body as { areaId: string; active: boolean }
      const result = await programService.bulkToggleByArea(areaId, active)
      return ok(res, result, `${result.length} programas actualizados`)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * DELETE /programs/:id
   */
  async remove(req: Request, res: Response) {
    try {
      await programService.deleteProgram(req.params.id)
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

export const programController = new ProgramController()
