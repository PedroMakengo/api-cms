import { Request, Response } from 'express'
import { z } from 'zod'
import { slideService } from '../../services/slide/slide.service'
import { fileUrl } from '../../utils/upload'
import {
  ok,
  created,
  noContent,
  badRequest,
  serverError,
} from '../../utils/response'

// ── Schemas de validação ──────────────────────────────────

export const createSlideSchema = z.object({
  badge: z.string().min(1, 'Badge obrigatório'),
  title: z.string().min(2, 'Título obrigatório'),
  description: z.string().min(5, 'Descrição obrigatória'),
  ctaPrimaryLabel: z.string().optional(),
  ctaPrimaryHref: z.string().optional(),
  ctaSecondaryLabel: z.string().optional(),
  ctaSecondaryHref: z.string().optional(),
  order: z.coerce.number().int().positive().optional(),
  active: z.coerce.boolean().optional(),
})

export const updateSlideSchema = createSlideSchema.partial()

export const reorderSchema = z.object({
  ids: z.array(z.string().cuid()).min(1),
})

// ── Controller ────────────────────────────────────────────

export class SlideController {
  /** GET /slides */
  async list(req: Request, res: Response) {
    try {
      const activeOnly = req.query.active === 'true'
      const slides = await slideService.listSlides(activeOnly || undefined)
      return ok(res, slides)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** GET /slides/:id */
  async getOne(req: Request, res: Response) {
    try {
      const slide = await slideService.getSlide(req.params.id)
      return ok(res, slide)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * POST /slides
   * multipart/form-data — campo "image" (obrigatório) + campos do body
   */
  async create(req: Request, res: Response) {
    try {
      // Multer já processou o ficheiro antes de chegar aqui
      if (!req.file) {
        return badRequest(res, 'Imagem obrigatória para criar um slide')
      }

      // Validar campos de texto
      const parsed = createSlideSchema.safeParse(req.body)
      if (!parsed.success) {
        return badRequest(res, 'Dados inválidos', parsed.error.errors)
      }

      const imageUrl = fileUrl(req, req.file.filename)
      const slide = await slideService.createSlide(parsed.data, imageUrl)

      return created(res, slide, 'Slide criado com sucesso')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * PUT /slides/:id
   * JSON — actualiza apenas campos de texto (sem imagem)
   */
  async update(req: Request, res: Response) {
    try {
      const slide = await slideService.updateSlide(req.params.id, req.body)
      return ok(res, slide, 'Slide actualizado com sucesso')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /**
   * PATCH /slides/:id/image
   * multipart/form-data — campo "image" — substitui só a imagem
   */
  async updateImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return badRequest(res, 'Ficheiro de imagem obrigatório')
      }

      const imageUrl = fileUrl(req, req.file.filename)
      const slide = await slideService.updateImage(req.params.id, imageUrl)

      return ok(res, slide, 'Imagem actualizada com sucesso')
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** PATCH /slides/:id/toggle */
  async toggle(req: Request, res: Response) {
    try {
      const result = await slideService.toggleSlide(req.params.id)
      return ok(res, result)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** PATCH /slides/reorder */
  async reorder(req: Request, res: Response) {
    try {
      const slides = await slideService.reorderSlides(req.body.ids)
      return ok(res, slides)
    } catch (err: any) {
      if (err.status)
        return res
          .status(err.status)
          .json({ success: false, message: err.message })
      return serverError(res, err)
    }
  }

  /** DELETE /slides/:id */
  async remove(req: Request, res: Response) {
    try {
      await slideService.deleteSlide(req.params.id)
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

export const slideController = new SlideController()
