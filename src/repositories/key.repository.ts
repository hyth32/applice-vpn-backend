import { prisma } from '../lib/prisma'

export class KeyRepository {
  async store(payload: any) {
    return prisma.key.create({
      data: payload,
    })
  }
}
