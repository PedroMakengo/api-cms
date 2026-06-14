// import { prisma } from '../prisma/client'
import prisma from '../../prisma'
import type {
  CreateJobBody,
  UpdateJobBody,
  JobQuery,
} from '../../models/interfaces/Job'
import { JobStatus, JobType, JobLocation } from '@prisma/client'

export class JobService {
  async list(query: JobQuery) {
    const where: Record<string, any> = {}
    if (query.status) where.status = query.status
    if (query.type) where.type = query.type
    if (query.location) where.location = query.location
    if (query.featured !== undefined) where.featured = query.featured === 'true'
    if (query.search)
      where.OR = [
        { title: { contains: query.search } },
        { department: { contains: query.search } },
        { area: { contains: query.search } },
      ]
    return prisma.job.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      include: { _count: { select: { applications: true } } },
    })
  }

  async getOne(id: string) {
    const job = await prisma.job.findUnique({
      where: { id },
      include: { _count: { select: { applications: true } } },
    })
    if (!job) throw { status: 404, message: 'Vaga não encontrada' }
    return job
  }

  async create(data: CreateJobBody) {
    return prisma.job.create({
      data: {
        title: data.title,
        department: data.department,
        location: (data.location ?? 'PRESENCIAL') as JobLocation,
        type: (data.type ?? 'FULL_TIME') as JobType,
        area: data.area,
        description: data.description,
        requirements: data.requirements as any,
        benefits: data.benefits as any,
        salary: data.salary ?? null,
        deadline: data.deadline ?? null,
        featured: data.featured ?? false,
        status: (data.status ?? 'OPEN') as JobStatus,
      },
    })
  }

  async update(id: string, data: UpdateJobBody) {
    await this.getOne(id)
    return prisma.job.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.department !== undefined && { department: data.department }),
        ...(data.location !== undefined && {
          location: data.location as JobLocation,
        }),
        ...(data.type !== undefined && { type: data.type as JobType }),
        ...(data.area !== undefined && { area: data.area }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.requirements !== undefined && {
          requirements: data.requirements as any,
        }),
        ...(data.benefits !== undefined && { benefits: data.benefits as any }),
        ...(data.salary !== undefined && { salary: data.salary }),
        ...(data.deadline !== undefined && { deadline: data.deadline }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.status !== undefined && { status: data.status as JobStatus }),
      },
    })
  }

  async updateStatus(id: string, status: JobStatus) {
    await this.getOne(id)
    return prisma.job.update({
      where: { id },
      data: { status },
      select: { id: true, status: true },
    })
  }

  async delete(id: string) {
    await this.getOne(id)
    await prisma.job.delete({ where: { id } })
  }

  async stats() {
    const [total, open, closed, paused, featured] = await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { status: 'OPEN' } }),
      prisma.job.count({ where: { status: 'CLOSED' } }),
      prisma.job.count({ where: { status: 'PAUSED' } }),
      prisma.job.count({ where: { featured: true } }),
    ])
    return { total, open, closed, paused, featured }
  }
}

export const jobService = new JobService()
