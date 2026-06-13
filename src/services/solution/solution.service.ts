// import { prisma } from '../prisma/client'
import type {
  CreateSolutionBody,
  UpdateSolutionBody,
  SolutionQuery,
} from '../../models/interfaces/Solution'

import prisma from '../../prisma'

export class SolutionService {
  // ── LIST ──────────────────────────────────────────────
  async listSolutions(query: SolutionQuery) {
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

    return prisma.solution.findMany({
      where,
      orderBy: { order: 'asc' },
    })
  }

  // ── GET BY ID ─────────────────────────────────────────
  async getSolution(id: string) {
    const solution = await prisma.solution.findUnique({ where: { id } })

    if (!solution) throw { status: 404, message: 'Solução não encontrada' }

    return solution
  }

  // ── CREATE ────────────────────────────────────────────
  async createSolution(data: CreateSolutionBody) {
    if (data.order === undefined) {
      const last = await prisma.solution.findFirst({
        orderBy: { order: 'desc' },
      })
      data.order = (last?.order ?? 0) + 1
    }

    return prisma.solution.create({
      data: {
        icon: data.icon,
        title: data.title,
        description: data.description,
        order: data.order,
        active: data.active ?? true,
        wide: data.wide ?? false,
      },
    })
  }

  // ── UPDATE ────────────────────────────────────────────
  async updateSolution(id: string, data: UpdateSolutionBody) {
    await this.getSolution(id)

    return prisma.solution.update({
      where: { id },
      data: {
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.active !== undefined && { active: data.active }),
        ...(data.wide !== undefined && { wide: data.wide }),
      },
    })
  }

  // ── TOGGLE ACTIVE ──────────────────────────────────────
  async toggleSolution(id: string) {
    const solution = await this.getSolution(id)

    return prisma.solution.update({
      where: { id },
      data: { active: !solution.active },
      select: { id: true, active: true },
    })
  }

  // ── TOGGLE WIDE ────────────────────────────────────────
  async toggleWide(id: string) {
    const solution = await this.getSolution(id)

    return prisma.solution.update({
      where: { id },
      data: { wide: !solution.wide },
      select: { id: true, wide: true },
    })
  }

  // ── REORDER ───────────────────────────────────────────
  async reorderSolutions(ids: string[]) {
    const updates = ids.map((id, index) =>
      prisma.solution.update({ where: { id }, data: { order: index + 1 } }),
    )
    await prisma.$transaction(updates)

    return this.listSolutions({})
  }

  // ── DELETE ────────────────────────────────────────────
  async deleteSolution(id: string) {
    await this.getSolution(id)

    await prisma.solution.delete({ where: { id } })
  }
}

export const solutionService = new SolutionService()
