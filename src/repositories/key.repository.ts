import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

export class KeyRepository {
  async store(payload: Prisma.KeyUncheckedCreateInput) {
    return prisma.key.create({ data: payload })
  }
}
