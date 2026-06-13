import prisma from '../../prisma'
import { deleteFile } from '../../utils/upload'
import path from 'path'
import type {
  CreateSlideBody,
  UpdateSlideBody,
} from '../../models/interfaces/Slide'

export class SlideService {
  // ── LIST SLIDES ────────────────────────────────────────
  async listSlides(activeOnly?: boolean) {
    const where = activeOnly ? { active: true } : {}

    return prisma.heroSlide.findMany({
      where,
      orderBy: { order: 'asc' },
    })
  }

  // ── GET SLIDE ──────────────────────────────────────────
  async getSlide(id: string) {
    const slide = await prisma.heroSlide.findUnique({ where: { id } })

    if (!slide) throw { status: 404, message: 'Slide não encontrado' }

    return slide
  }

  // ── CREATE SLIDE ───────────────────────────────────────
  async createSlide(data: CreateSlideBody, imageUrl: string) {
    if (data.order === undefined) {
      const last = await prisma.heroSlide.findFirst({
        orderBy: { order: 'desc' },
      })
      data.order = (last?.order ?? 0) + 1
    }

    return prisma.heroSlide.create({
      data: {
        badge: data.badge,
        title: data.title,
        description: data.description,
        ctaPrimaryLabel: data.ctaPrimaryLabel ?? 'Explorar Programas',
        ctaPrimaryHref: data.ctaPrimaryHref ?? '#areas',
        ctaSecondaryLabel: data.ctaSecondaryHref ?? 'Saber Mais',
        ctaSecondaryHref: data.ctaSecondaryHref ?? '#sobre',
        imageUrl,
        order: data.order,
        active: data.active ?? true,
      },
    })
  }

  // ── UPDATE SLIDE (campos de texto) ────────────────────
  async updateSlide(id: string, data: UpdateSlideBody) {
    await this.getSlide(id)

    return prisma.heroSlide.update({
      where: { id },
      data: {
        ...(data.badge !== undefined && { badge: data.badge }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.ctaPrimaryLabel !== undefined && {
          ctaPrimaryLabel: data.ctaPrimaryLabel,
        }),
        ...(data.ctaPrimaryHref !== undefined && {
          ctaPrimaryHref: data.ctaPrimaryHref,
        }),
        ...(data.ctaSecondaryLabel !== undefined && {
          ctaSecondaryLabel: data.ctaSecondaryLabel,
        }),
        ...(data.ctaSecondaryHref !== undefined && {
          ctaSecondaryHref: data.ctaSecondaryHref,
        }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.active !== undefined && { active: data.active }),
      },
    })
  }

  // ── UPDATE IMAGE ───────────────────────────────────────
  /**
   * Substitui a imagem do slide.
   * Remove o ficheiro antigo da pasta /tmp/uploads se for local.
   */
  async updateImage(id: string, newImageUrl: string) {
    const slide = await this.getSlide(id)

    // Apagar ficheiro antigo se for local (não uma URL externa)
    if (slide.imageUrl && !slide.imageUrl.startsWith('http')) {
      const oldFilename = path.basename(slide.imageUrl)
      deleteFile(oldFilename)
    }

    return prisma.heroSlide.update({
      where: { id },
      data: { imageUrl: newImageUrl },
    })
  }

  // ── TOGGLE ACTIVE ──────────────────────────────────────
  async toggleSlide(id: string) {
    const slide = await this.getSlide(id)

    return prisma.heroSlide.update({
      where: { id },
      data: { active: !slide.active },
      select: { id: true, active: true },
    })
  }

  // ── REORDER SLIDES ─────────────────────────────────────
  async reorderSlides(ids: string[]) {
    const updates = ids.map((id, index) =>
      prisma.heroSlide.update({ where: { id }, data: { order: index + 1 } }),
    )
    await prisma.$transaction(updates)

    return this.listSlides()
  }

  // ── DELETE SLIDE ───────────────────────────────────────
  async deleteSlide(id: string) {
    const slide = await this.getSlide(id)

    // Apagar imagem local se existir
    if (slide.imageUrl && !slide.imageUrl.startsWith('http')) {
      deleteFile(path.basename(slide.imageUrl))
    }

    await prisma.heroSlide.delete({ where: { id } })
  }
}

export const slideService = new SlideService()
