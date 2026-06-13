import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'
import prisma from '../../prisma'
import { CreateUserBody, UpdateUserBody } from '../../models/interfaces/User'

const SAFE_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  active: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
}

export class UserService {
  async list() {
    return prisma.adminUser.findMany({
      orderBy: { createdAt: 'asc' },
      select: SAFE_SELECT,
    })
  }

  async getOne(id: string) {
    const user = await prisma.adminUser.findUnique({
      where: { id },
      select: SAFE_SELECT,
    })
    if (!user) throw { status: 404, message: 'Utilizador não encontrado' }
    return user
  }

  async create(data: CreateUserBody) {
    const exists = await prisma.adminUser.findUnique({
      where: { email: data.email },
    })
    if (exists) throw { status: 409, message: 'E-mail já está em uso' }

    const hashed = await bcrypt.hash(data.password, 12)
    return prisma.adminUser.create({
      data: {
        email: data.email,
        password: hashed,
        name: data.name,
        role: (data.role ?? 'EDITOR') as Role,
        active: data.active ?? true,
      },
      select: SAFE_SELECT,
    })
  }

  async update(id: string, data: UpdateUserBody) {
    await this.getOne(id)

    if (data.email) {
      const exists = await prisma.adminUser.findFirst({
        where: { email: data.email, NOT: { id } },
      })
      if (exists) throw { status: 409, message: 'E-mail já está em uso' }
    }

    const updateData: Record<string, any> = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email
    if (data.role !== undefined) updateData.role = data.role
    if (data.active !== undefined) updateData.active = data.active
    if (data.password !== undefined)
      updateData.password = await bcrypt.hash(data.password, 12)

    return prisma.adminUser.update({
      where: { id },
      data: updateData,
      select: SAFE_SELECT,
    })
  }

  async toggleActive(id: string) {
    const user = await this.getOne(id)
    return prisma.adminUser.update({
      where: { id },
      data: { active: !user.active },
      select: { id: true, active: true },
    })
  }

  async delete(id: string) {
    await this.getOne(id)
    await prisma.adminUser.delete({ where: { id } })
  }
}

export const userService = new UserService()
