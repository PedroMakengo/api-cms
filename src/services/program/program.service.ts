import type {
  CreateProgramBody,
  UpdateProgramBody,
  ProgramQuery,
} from '../../models/interfaces/area'
import prisma from '../../prisma'

export class ProgramService {
  // ── LIST — todos os programas (com dados da área) ─────
  async listPrograms(query: ProgramQuery) {
    const where: Record<string, any> = {}

    if (query.active !== undefined) {
      where.active = query.active === 'true'
    }
    if (query.areaId) {
      where.areaId = query.areaId
    }
    if (query.mode) {
      where.mode = { contains: query.mode }
    }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { description: { contains: query.search } },
      ]
    }

    return prisma.program.findMany({
      where,
      orderBy: [{ area: { order: 'asc' } }, { name: 'asc' }],
      include: {
        area: {
          select: { id: true, title: true, icon: true },
        },
      },
    })
  }

  // ── GET BY ID ─────────────────────────────────────────
  async getProgram(id: string) {
    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        area: {
          select: { id: true, title: true, icon: true },
        },
      },
    })

    if (!program) throw { status: 404, message: 'Programa não encontrado' }

    return program
  }

  // ── CREATE ────────────────────────────────────────────
  async createProgram(data: CreateProgramBody) {
    // Verificar se a área existe
    const area = await prisma.area.findUnique({ where: { id: data?.areaId } })
    if (!area) throw { status: 404, message: 'Área não encontrada' }

    return prisma.program.create({
      data: {
        areaId: data.areaId as string,
        name: data.name,
        duration: data.duration,
        mode: data.mode,
        price: data.price,
        startDate: data.startDate,
        description: data.description,
        active: data.active ?? true,
      },
      include: {
        area: { select: { id: true, title: true, icon: true } },
      },
    })
  }

  // ── UPDATE ────────────────────────────────────────────
  async updateProgram(id: string, data: UpdateProgramBody) {
    await this.getProgram(id)

    // Se mudar de área, verificar que a nova área existe
    if (data.areaId) {
      const area = await prisma.area.findUnique({ where: { id: data.areaId } })
      if (!area) throw { status: 404, message: 'Área destino não encontrada' }
    }

    return prisma.program.update({
      where: { id },
      data: {
        ...(data.areaId !== undefined && { areaId: data.areaId }),
        ...(data.name !== undefined && { name: data.name }),
        ...(data.duration !== undefined && { duration: data.duration }),
        ...(data.mode !== undefined && { mode: data.mode }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.startDate !== undefined && { startDate: data.startDate }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.active !== undefined && { active: data.active }),
      },
      include: {
        area: { select: { id: true, title: true, icon: true } },
      },
    })
  }

  // ── TOGGLE ACTIVE ──────────────────────────────────────
  async toggleProgram(id: string) {
    const program = await this.getProgram(id)

    return prisma.program.update({
      where: { id },
      data: { active: !program.active },
      select: { id: true, active: true },
    })
  }

  // ── DELETE ────────────────────────────────────────────
  async deleteProgram(id: string) {
    await this.getProgram(id)

    await prisma.program.delete({ where: { id } })
  }

  // ── BULK TOGGLE — activar/desactivar todos de uma área ─
  async bulkToggleByArea(areaId: string, active: boolean) {
    const area = await prisma.area.findUnique({ where: { id: areaId } })

    if (!area) throw { status: 404, message: 'Área não encontrada' }

    await prisma.program.updateMany({
      where: { areaId },
      data: { active },
    })

    return prisma.program.findMany({
      where: { areaId },
      orderBy: { name: 'asc' },
      select: { id: true, active: true, name: true },
    })
  }
}

export const programService = new ProgramService()
