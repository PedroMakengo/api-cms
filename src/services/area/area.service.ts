import prisma from '../../prisma'
import type {
  CreateAreaBody,
  UpdateAreaBody,
  CreateProgramBody,
  UpdateProgramBody,
  AreaQuery,
  ProgramQuery,
} from '../../models/interfaces/area'

export class AreaService {
  // ── LIST AREAS ─────────────────────────────────────────
  async listAreas(query: AreaQuery) {
    const where: Record<string, any> = {}

    if (query.active !== undefined) {
      where.active = query.active === 'true'
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ]
    }

    const areas = await prisma.area.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        programs: {
          orderBy: { name: 'asc' },
          select: {
            id: true,
            name: true,
            duration: true,
            mode: true,
            price: true,
            startDate: true,
            description: true,
            active: true,
          },
        },
      },
    })

    return areas
  }

  // ── GET AREA BY ID ─────────────────────────────────────
  async getArea(id: string) {
    const area = await prisma.area.findUnique({
      where: { id },
      include: {
        programs: { orderBy: { name: 'asc' } },
      },
    })

    if (!area) throw { status: 404, message: 'Área não encontrada' }

    return area
  }

  // ── CREATE AREA ────────────────────────────────────────
  async createArea(data: CreateAreaBody) {
    // Se não vier ordem, colocar no fim
    if (data.order === undefined) {
      const last = await prisma.area.findFirst({ orderBy: { order: 'desc' } })
      data.order = (last?.order ?? 0) + 1
    }

    const area = await prisma.area.create({
      data: {
        icon: data.icon,
        title: data.title,
        description: data.description,
        order: data.order,
        active: data.active ?? true,
      },
      include: { programs: true },
    })

    return area
  }

  // ── UPDATE AREA ────────────────────────────────────────
  async updateArea(id: string, data: UpdateAreaBody) {
    await this.getArea(id) // 404 se não existir

    const area = await prisma.area.update({
      where: { id },
      data: {
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.active !== undefined && { active: data.active }),
      },
      include: { programs: { orderBy: { name: 'asc' } } },
    })

    return area
  }

  // ── TOGGLE ACTIVE ──────────────────────────────────────
  async toggleArea(id: string) {
    const area = await this.getArea(id)

    return prisma.area.update({
      where: { id },
      data: { active: !area.active },
      select: { id: true, active: true },
    })
  }

  // ── REORDER AREAS ──────────────────────────────────────
  async reorderAreas(ids: string[]) {
    const updates = ids.map((id, index) =>
      prisma.area.update({ where: { id }, data: { order: index + 1 } }),
    )
    await prisma.$transaction(updates)

    return this.listAreas({})
  }

  // ── DELETE AREA ────────────────────────────────────────
  async deleteArea(id: string) {
    await this.getArea(id)

    // Cascade deleta os programs (definido no schema)
    await prisma.area.delete({ where: { id } })
  }

  // ════════════════════════════════════════════════════════
  //  PROGRAMS
  // ════════════════════════════════════════════════════════

  // ── LIST PROGRAMS (de uma área) ─────────────────────────
  async listPrograms(areaId: string, query: ProgramQuery) {
    await this.getArea(areaId)

    const where: Record<string, any> = { areaId }

    if (query.active !== undefined) where.active = query.active === 'true'
    if (query.mode) where.mode = { contains: query.mode }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { description: { contains: query.search } },
      ]
    }

    return prisma.program.findMany({
      where,
      orderBy: { name: 'asc' },
    })
  }

  // ── GET PROGRAM ────────────────────────────────────────
  async getProgram(areaId: string, programId: string) {
    const program = await prisma.program.findFirst({
      where: { id: programId, areaId },
    })

    if (!program) throw { status: 404, message: 'Programa não encontrado' }

    return program
  }

  // ── CREATE PROGRAM ─────────────────────────────────────
  async createProgram(areaId: string, data: CreateProgramBody) {
    await this.getArea(areaId)

    return prisma.program.create({
      data: {
        areaId,
        name: data.name,
        duration: data.duration,
        mode: data.mode,
        price: data.price,
        startDate: data.startDate,
        description: data.description,
        active: data.active ?? true,
      },
    })
  }

  // ── UPDATE PROGRAM ─────────────────────────────────────
  async updateProgram(
    areaId: string,
    programId: string,
    data: UpdateProgramBody,
  ) {
    await this.getProgram(areaId, programId)

    return prisma.program.update({
      where: { id: programId },
      data: {
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
    })
  }

  // ── TOGGLE PROGRAM ─────────────────────────────────────
  async toggleProgram(areaId: string, programId: string) {
    const program = await this.getProgram(areaId, programId)

    return prisma.program.update({
      where: { id: programId },
      data: { active: !program.active },
      select: { id: true, active: true },
    })
  }

  // ── DELETE PROGRAM ─────────────────────────────────────
  async deleteProgram(areaId: string, programId: string) {
    await this.getProgram(areaId, programId)

    await prisma.program.delete({ where: { id: programId } })
  }
}

export const areaService = new AreaService()
