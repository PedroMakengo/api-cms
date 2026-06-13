import prisma from '../../prisma'
import type {
  CreateApplicationBody,
  UpdateApplicationStatusBody,
  ApplicationQuery,
} from '../../models/interfaces/Application'
import { ApplyStatus } from '@prisma/client'

export class ApplicationService {
  async list(query: ApplicationQuery) {
    const where: Record<string, any> = {}
    if (query.status) where.status = query.status
    if (query.jobId) where.jobId = query.jobId
    if (query.search)
      where.OR = [
        { name: { contains: query.search } },
        { lastname: { contains: query.search } },
        { email: { contains: query.search } },
      ]
    return prisma.jobApplication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { job: { select: { id: true, title: true, department: true } } },
    })
  }

  async getOne(id: string) {
    const app = await prisma.jobApplication.findUnique({
      where: { id },
      include: { job: { select: { id: true, title: true, department: true } } },
    })
    if (!app) throw { status: 404, message: 'Candidatura não encontrada' }

    // Marcar como reviewedAt na primeira abertura
    if (!app.reviewedAt) {
      await prisma.jobApplication.update({
        where: { id },
        data: { reviewedAt: new Date() },
      })
    }
    return app
  }

  async create(data: CreateApplicationBody) {
    const job = await prisma.job.findUnique({ where: { id: data.jobId } })
    if (!job) throw { status: 404, message: 'Vaga não encontrada' }
    if (job.status !== 'OPEN')
      throw {
        status: 400,
        message: 'Esta vaga não está disponível para candidaturas',
      }

    // Evitar candidatura duplicada para a mesma vaga
    const existing = await prisma.jobApplication.findFirst({
      where: { jobId: data.jobId, email: data.email },
    })
    if (existing)
      throw {
        status: 409,
        message: 'Já existe uma candidatura com este e-mail para esta vaga',
      }

    return prisma.jobApplication.create({
      data: {
        jobId: data.jobId,
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        linkedin: data.linkedin ?? null,
        portfolio: data.portfolio ?? null,
        coverLetter: data.coverLetter,
      },
      include: { job: { select: { id: true, title: true, department: true } } },
    })
  }

  async updateStatus(id: string, body: UpdateApplicationStatusBody) {
    await this.getOne(id)
    return prisma.jobApplication.update({
      where: { id },
      data: {
        status: body.status as ApplyStatus,
        statusNote: body.statusNote ?? null,
      },
      include: { job: { select: { id: true, title: true, department: true } } },
    })
  }

  async delete(id: string) {
    await this.getOne(id)
    await prisma.jobApplication.delete({ where: { id } })
  }

  async statsByJob(jobId: string) {
    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job) throw { status: 404, message: 'Vaga não encontrada' }

    const counts = await prisma.jobApplication.groupBy({
      by: ['status'],
      where: { jobId },
      _count: { status: true },
    })
    const result: Record<string, number> = {
      PENDING: 0,
      REVIEWING: 0,
      INTERVIEW: 0,
      REJECTED: 0,
      HIRED: 0,
    }
    counts.forEach((c) => {
      result[c.status] = c._count.status
    })
    return {
      jobId,
      jobTitle: job.title,
      ...result,
      total: Object.values(result).reduce((a, b) => a + b, 0),
    }
  }
}

export const applicationService = new ApplicationService()
