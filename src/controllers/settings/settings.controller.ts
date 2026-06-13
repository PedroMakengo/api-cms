import { Request, Response } from 'express'
import { z } from 'zod'
import { settingsService } from '../../services/settings/settings.service'
// import type { UpdateSettingsBody } from '../types/settings'
import { ok, serverError } from '../../utils/response'
import { UpdateSettingsBody } from '../../models/interfaces/Settings'

// ── Zod schema ────────────────────────────────────────────

export const updateSettingsSchema = z.object({
  siteName: z.string().min(2, 'Nome do site mínimo 2 caracteres').optional(),
  tagline: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email('E-mail inválido').optional(),
  linkedin: z.string().url('URL inválido').optional().or(z.literal('')),
  facebook: z.string().url('URL inválido').optional().or(z.literal('')),
  instagram: z.string().url('URL inválido').optional().or(z.literal('')),
  youtube: z.string().url('URL inválido').optional().or(z.literal('')),
  googleMapsEmbed: z.string().optional(),
})

// ── Controller ────────────────────────────────────────────

export class SettingsController {
  /**
   * GET /settings
   * Público — website usa para morada, telefone, redes sociais, mapa
   */
  async get(_req: Request, res: Response) {
    try {
      const settings = await settingsService.get()
      return ok(res, settings)
    } catch (err: any) {
      return serverError(res, err)
    }
  }

  /**
   * PUT /settings
   * Body: UpdateSettingsBody (todos os campos opcionais — PATCH semântico)
   * Requer: authenticate + SUPERADMIN
   */
  async update(req: Request, res: Response) {
    try {
      const body: UpdateSettingsBody = req.body
      const settings = await settingsService.update(body)
      return ok(res, settings, 'Definições actualizadas com sucesso')
    } catch (err: any) {
      return serverError(res, err)
    }
  }
}

export const settingsController = new SettingsController()
