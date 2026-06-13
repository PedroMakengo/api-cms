import prisma from '../../prisma'
import type {
  CreateEnrollmentBody,
  UpdateEnrollmentStatusBody,
  EnrollmentQuery,
} from '../../models/interfaces/Enrollment'
import { EnrollmentStatus } from '@prisma/client'

export class EnrollmentService {
  async list(query: EnrollmentQuery) {
    const where: Record<string, any> = {}
    if (query.status) where.status = query.status
    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { lastname: { contains: query.search } },
        { email: { contains: query.search } },
        { programName: { contains: query.search } },
      ]
    }
    return prisma.enrollmentSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { program: { select: { id: true, name: true } } },
    })
  }

  async getOne(id: string) {
    const enrollment = await prisma.enrollmentSubmission.findUnique({
      where: { id },
      include: {
        program: {
          select: { id: true, name: true, area: { select: { title: true } } },
        },
      },
    })
    if (!enrollment) throw { status: 404, message: 'Inscrição não encontrada' }
    return enrollment
  }

  async create(data: CreateEnrollmentBody) {
    if (data.programId) {
      const prog = await prisma.program.findUnique({
        where: { id: data.programId },
      })
      if (!prog) throw { status: 404, message: 'Programa não encontrado' }
    }
    return prisma.enrollmentSubmission.create({
      data: {
        programId: data.programId ?? null,
        programName: data.programName,
        areaName: data.areaName,
        price: data.price,
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        organization: data.organization ?? null,
        role: data.role ?? null,
        status: 'PENDING',
      },
    })
  }

  async updateStatus(id: string, body: UpdateEnrollmentStatusBody) {
    await this.getOne(id)
    return prisma.enrollmentSubmission.update({
      where: { id },
      data: {
        status: body.status as EnrollmentStatus,
        statusNote: body.statusNote ?? null,
      },
    })
  }

  async delete(id: string) {
    await this.getOne(id)
    await prisma.enrollmentSubmission.delete({ where: { id } })
  }

  async stats() {
    const [total, pending, confirmed, cancelled] = await Promise.all([
      prisma.enrollmentSubmission.count(),
      prisma.enrollmentSubmission.count({ where: { status: 'PENDING' } }),
      prisma.enrollmentSubmission.count({ where: { status: 'CONFIRMED' } }),
      prisma.enrollmentSubmission.count({ where: { status: 'CANCELLED' } }),
    ])
    return { total, pending, confirmed, cancelled }
  }
}

export const enrollmentService = new EnrollmentService()
