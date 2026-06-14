import { Request, Response } from 'express'
import { z } from 'zod'
import { ok, created, noContent, serverError } from '../../utils/response'
import { solutionService } from '../../services/solution/solution.service'

// ── Schemas Zod ───────────────────────────────────────────

export const createSolutionSchema = z.object({
  icon: z.string().min(1, 'Ícone obrigatório'),
  title: z.string().min(2, 'Título mínimo 2 caracteres'),
  description: z.string().min(1, 'Descrição obrigatória'), // ← era min(10), relaxado
  order: z.coerce.number().int().positive().optional(), // ← coerce: aceita string "1"
  active: z.boolean().optional(),
  wide: z.boolean().optional(),
})

export const updateSolutionSchema = createSolutionSchema.partial()

export const reorderSchema = z.object({
  // ← removido .cuid() — aceita qualquer string não vazia
  ids: z.array(z.string().min(1)).min(1, 'Array de IDs obrigatório'),
})

// ── Controller ────────────────────────────────────────────

export class SolutionController {
  /** GET /solutions */
  async list(req: Request, res: Response) {
    try {
      const solutions = await solutionService.listSolutions({
        active: req.query.active as 'true' | 'false' | undefined,
        search: req.query.search as string | undefined,
      })
      return ok(res, solutions)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** GET /solutions/:id */
  async getOne(req: Request, res: Response) {
    try {
      const solution = await solutionService.getSolution(req.params.id)
      return ok(res, solution)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** POST /solutions */
  async create(req: Request, res: Response) {
    try {
      const solution = await solutionService.createSolution(req.body)
      return created(res, solution, 'Solução criada com sucesso')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** PUT /solutions/:id */
  async update(req: Request, res: Response) {
    try {
      const solution = await solutionService.updateSolution(
        req.params.id,
        req.body,
      )
      return ok(res, solution, 'Solução actualizada com sucesso')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** PATCH /solutions/:id/toggle */
  async toggle(req: Request, res: Response) {
    try {
      const result = await solutionService.toggleSolution(req.params.id)
      return ok(res, result)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** PATCH /solutions/:id/wide */
  async toggleWide(req: Request, res: Response) {
    try {
      const result = await solutionService.toggleWide(req.params.id)
      return ok(res, result)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** PATCH /solutions/reorder */
  async reorder(req: Request, res: Response) {
    try {
      const solutions = await solutionService.reorderSolutions(req.body.ids)
      return ok(res, solutions)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** DELETE /solutions/:id */
  async remove(req: Request, res: Response) {
    try {
      await solutionService.deleteSolution(req.params.id)
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

export const solutionController = new SolutionController()
