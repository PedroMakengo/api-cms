import { ContactQuery } from '../../models/interfaces/Contact'
import prisma from '../../prisma'

export class ContactService {
  async list(query: ContactQuery) {
    const where: Record<string, any> = {}
    if (query.read !== undefined) where.read = query.read === 'true'
    if (query.area) where.area = { contains: query.area }
    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { lastname: { contains: query.search } },
        { email: { contains: query.search } },
        { message: { contains: query.search } },
      ]
    }
    return prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
  }

  async getOne(id: string) {
    const contact = await prisma.contactSubmission.findUnique({ where: { id } })
    if (!contact) throw { status: 404, message: 'Contacto não encontrado' }
    return contact
  }

  async create(data: {
    name: string
    lastname: string
    email: string
    phone?: string
    organization?: string
    area?: string
    message?: string
  }) {
    return prisma.contactSubmission.create({ data })
  }

  async markRead(id: string, read: boolean) {
    await this.getOne(id)
    return prisma.contactSubmission.update({
      where: { id },
      data: { read, readAt: read ? new Date() : null },
      select: { id: true, read: true, readAt: true },
    })
  }

  async markAllRead() {
    const result = await prisma.contactSubmission.updateMany({
      where: { read: false },
      data: { read: true, readAt: new Date() },
    })
    return { updated: result.count }
  }

  async delete(id: string) {
    await this.getOne(id)
    await prisma.contactSubmission.delete({ where: { id } })
  }

  async stats() {
    const [total, unread, today] = await Promise.all([
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { read: false } }),
      prisma.contactSubmission.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
    ])
    return { total, unread, read: total - unread, today }
  }
}

export const contactService = new ContactService()
