import { Request, Response } from 'express'
import { z } from 'zod'
import { userService } from '../../services/users/user.service'
import { ok, created, noContent, serverError } from '../../utils/response'
import { CreateUserBody, UpdateUserBody } from '../../models/interfaces/User'

// ── Zod schemas ───────────────────────────────────────────

export const createUserSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z
    .string()
    .min(8, 'Password mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter pelo menos uma maiúscula')
    .regex(/[a-z]/, 'Deve conter pelo menos uma minúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos um número'),
  name: z.string().min(2, 'Nome mínimo 2 caracteres'),
  role: z.enum(['SUPERADMIN', 'EDITOR']).optional(),
  active: z.boolean().optional(),
})

export const updateUserSchema = z.object({
  email: z.string().email('E-mail inválido').optional(),
  name: z.string().min(2).optional(),
  role: z.enum(['SUPERADMIN', 'EDITOR']).optional(),
  active: z.boolean().optional(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .optional(),
})

// ── Controller ────────────────────────────────────────────

export class UserController {
  /**
   * GET /users
   * Devolve lista sem password
   * Requer: authenticate + SUPERADMIN
   */
  async list(_req: Request, res: Response) {
    try {
      const users = await userService.list()
      return ok(res, users)
    } catch (err: any) {
      return serverError(res, err)
    }
  }

  /**
   * GET /users/:id
   * Requer: authenticate + SUPERADMIN
   */
  async getOne(req: Request, res: Response) {
    try {
      const user = await userService.getOne(req.params.id)
      return ok(res, user)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * POST /users
   * Body: CreateUserBody
   * Requer: authenticate + SUPERADMIN
   */
  async create(req: Request, res: Response) {
    try {
      const body: CreateUserBody = req.body
      const user = await userService.create(body)
      return created(res, user, 'Utilizador criado com sucesso')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * PUT /users/:id
   * Body: UpdateUserBody (password opcional — só altera se fornecida)
   * Requer: authenticate + SUPERADMIN
   */
  async update(req: Request, res: Response) {
    try {
      const body: UpdateUserBody = req.body
      const user = await userService.update(req.params.id, body)
      return ok(res, user, 'Utilizador actualizado com sucesso')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * PATCH /users/:id/toggle
   * Activa ou desactiva a conta
   * Requer: authenticate + SUPERADMIN
   */
  async toggle(req: Request, res: Response) {
    try {
      const result = await userService.toggleActive(req.params.id)
      return ok(
        res,
        result,
        result.active ? 'Conta activada' : 'Conta desactivada',
      )
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * DELETE /users/:id
   * Requer: authenticate + SUPERADMIN
   */
  async remove(req: Request, res: Response) {
    try {
      await userService.delete(req.params.id)
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

export const userController = new UserController()
