import { Request, Response } from 'express'
import { z } from 'zod'
import { areaService } from '../../services/area/area.service'
import { ok, created, noContent, serverError } from '../../utils/response'

// ── Schemas de validação ──────────────────────────────────

export const createAreaSchema = z.object({
  icon: z.string().min(1, 'Ícone obrigatório'),
  title: z.string().min(2, 'Título mínimo 2 caracteres'),
  description: z.string().min(10, 'Descrição mínimo 10 caracteres'),
  order: z.coerce.number().int().positive().optional(),
  active: z.boolean().optional(),
})

export const updateAreaSchema = createAreaSchema.partial()

export const reorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, 'IDs obrigatórios'),
})

export const createProgramSchema = z.object({
  name: z.string().min(2, 'Nome mínimo 2 caracteres'),
  duration: z.string().min(1),
  mode: z.string().min(1),
  price: z.string().min(1),
  startDate: z.string().min(1),
  description: z.string().min(1),
  active: z.boolean().optional(),
})

export const updateProgramSchema = createProgramSchema.partial()

// ── Controller ────────────────────────────────────────────

export class AreaController {
  // ─── AREAS ──────────────────────────────────────────────

  /** GET /areas */
  async list(req: Request, res: Response) {
    try {
      const areas = await areaService.listAreas({
        active: req.query.active as 'true' | 'false' | undefined,
        search: req.query.search as string | undefined,
      })
      return ok(res, areas)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** GET /areas/:id */
  async getOne(req: Request, res: Response) {
    try {
      const area = await areaService.getArea(req.params.id)
      return ok(res, area)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** POST /areas */
  async create(req: Request, res: Response) {
    try {
      const area = await areaService.createArea(req.body)
      return created(res, area, 'Área criada com sucesso')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** PUT /areas/:id */
  async update(req: Request, res: Response) {
    try {
      const area = await areaService.updateArea(req.params.id, req.body)
      return ok(res, area, 'Área actualizada com sucesso')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** PATCH /areas/:id/toggle */
  async toggle(req: Request, res: Response) {
    try {
      const result = await areaService.toggleArea(req.params.id)
      return ok(res, result)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** PATCH /areas/reorder */
  async reorder(req: Request, res: Response) {
    try {
      const areas = await areaService.reorderAreas(req.body.ids)
      return ok(res, areas)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** DELETE /areas/:id */
  async remove(req: Request, res: Response) {
    try {
      await areaService.deleteArea(req.params.id)
      return noContent(res)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  // ─── PROGRAMS ───────────────────────────────────────────

  /** GET /areas/:areaId/programs */
  async listPrograms(req: Request, res: Response) {
    try {
      const programs = await areaService.listPrograms(req.params.areaId, {
        active: req.query.active as 'true' | 'false' | undefined,
        search: req.query.search as string | undefined,
        mode: req.query.mode as string | undefined,
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

  /** GET /areas/:areaId/programs/:programId */
  async getProgram(req: Request, res: Response) {
    try {
      const program = await areaService.getProgram(
        req.params.areaId,
        req.params.programId,
      )
      return ok(res, program)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** POST /areas/:areaId/programs */
  async createProgram(req: Request, res: Response) {
    try {
      const program = await areaService.createProgram(
        req.params.areaId,
        req.body,
      )
      return created(res, program, 'Programa criado com sucesso')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** PUT /areas/:areaId/programs/:programId */
  async updateProgram(req: Request, res: Response) {
    try {
      const program = await areaService.updateProgram(
        req.params.areaId,
        req.params.programId,
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

  /** PATCH /areas/:areaId/programs/:programId/toggle */
  async toggleProgram(req: Request, res: Response) {
    try {
      const result = await areaService.toggleProgram(
        req.params.areaId,
        req.params.programId,
      )
      return ok(res, result)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** DELETE /areas/:areaId/programs/:programId */
  async removeProgram(req: Request, res: Response) {
    try {
      await areaService.deleteProgram(req.params.areaId, req.params.programId)
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

export const areaController = new AreaController()
