import { UpdateSettingsBody } from '../../models/interfaces/Settings'
import prisma from '../../prisma'

export class SettingsService {
  async get() {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'singleton' },
    })
    if (!settings) {
      // Criar o singleton se não existir
      settings = await prisma.siteSettings.create({
        data: { id: 'singleton' },
      })
    }
    return settings
  }

  async update(data: UpdateSettingsBody) {
    return prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', ...data },
      update: data,
    })
  }
}

export const settingsService = new SettingsService()
