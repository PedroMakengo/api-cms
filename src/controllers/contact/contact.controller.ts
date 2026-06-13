import { Request, Response } from 'express'
import { z } from 'zod'
import type {
  CreateContactBody,
  ContactQuery,
  MarkReadBody,
} from '../../models/interfaces/Contact'
import {
  ok,
  created,
  noContent,
  badRequest,
  serverError,
} from '../../utils/response'
import { contactService } from '../../services/contact/contact.service'

// ── Zod schemas ───────────────────────────────────────────

export const createContactSchema = z.object({
  name: z.string().min(2, 'Nome mínimo 2 caracteres'),
  lastname: z.string().min(2, 'Apelido mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(9, 'Telefone inválido').optional(),
  organization: z.string().min(2).optional(),
  area: z.string().min(1).optional(),
  message: z.string().min(5, 'Mensagem mínimo 5 caracteres').optional(),
})

export const markReadSchema = z.object({
  read: z.boolean(),
})

// ── Controller ────────────────────────────────────────────

export class ContactController {
  /**
   * GET /contacts
   * Query: ?read=true|false  ?search=texto  ?area=Banca
   * Requer: authenticate
   */
  async list(req: Request, res: Response) {
    try {
      const query: ContactQuery = {
        read: req.query.read as 'true' | 'false' | undefined,
        search: req.query.search as string | undefined,
        area: req.query.area as string | undefined,
      }
      const contacts = await contactService.list(query)
      return ok(res, contacts)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * GET /contacts/stats
   * Devolve: total, unread, read, today
   * Requer: authenticate
   */
  async stats(_req: Request, res: Response) {
    try {
      const data = await contactService.stats()
      return ok(res, data)
    } catch (err: any) {
      return serverError(res, err)
    }
  }

  /**
   * GET /contacts/:id
   * Requer: authenticate
   */
  async getOne(req: Request, res: Response) {
    try {
      const contact = await contactService.getOne(req.params.id)
      return ok(res, contact)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * POST /contacts
   * Público — formulário de contacto do website
   * Body: CreateContactBody
   */
  async create(req: Request, res: Response) {
    try {
      const body: CreateContactBody = req.body
      const contact = await contactService.create(body)
      return created(res, contact, 'Mensagem recebida com sucesso')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * PATCH /contacts/:id/read
   * Body: { read: boolean }
   * Requer: authenticate + EDITOR+
   */
  async markRead(req: Request, res: Response) {
    try {
      const body: MarkReadBody = req.body
      const result = await contactService.markRead(req.params.id, body.read)
      return ok(
        res,
        result,
        body.read ? 'Marcado como lido' : 'Marcado como não lido',
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
   * PATCH /contacts/mark-all-read
   * Marca todas as mensagens não lidas como lidas
   * Requer: authenticate + EDITOR+
   */
  async markAllRead(_req: Request, res: Response) {
    try {
      const result = await contactService.markAllRead()
      return ok(
        res,
        result,
        `${result.updated} mensagem(s) marcadas como lidas`,
      )
    } catch (err: any) {
      return serverError(res, err)
    }
  }

  /**
   * DELETE /contacts/:id
   * Requer: authenticate + SUPERADMIN
   */
  async remove(req: Request, res: Response) {
    try {
      await contactService.delete(req.params.id)
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

export const contactController = new ContactController()
