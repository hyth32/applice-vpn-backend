import { Key, Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { HttpError } from '../lib/errors/http-error'

export class KeyRepository {
  async store(payload: Prisma.KeyUncheckedCreateInput) {
    return prisma.key.create({ data: payload })
  }

  async findByIdOrThrow(
    id: number
  ): Promise<{ id: number; configName: string; expirationDate: string; regionName: string; isExpired: boolean; free: boolean }> {
    const key = await prisma.key.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, configName: true, expirationDate: true, free: true, region: { select: { name: true } }, isExpired: true },
    })
    if (!key) {
      throw new HttpError('Key not found', 404)
    }
    return {
      id: key.id,
      configName: key.configName,
      regionName: key.region.name,
      expirationDate: key.expirationDate.toISOString(),
      isExpired: key.isExpired,
      free: key.free,
    }
  }

  async existsByUserId(keyId: number, userId: number): Promise<boolean> {
    const key = await prisma.key.findFirst({
      where: { id: keyId, userId, deletedAt: null },
      select: { id: true },
    })

    return Boolean(key)
  }

  async listByUserId(userId: number): Promise<Array<{ id: number; configName: string; regionName: string }>> {
    const keys = await prisma.key.findMany({
      where: { userId, deletedAt: null },
      select: {
        id: true,
        configName: true,
        region: { select: { name: true } },
      },
    })

    return keys.map((key) => ({
      id: key.id,
      configName: key.configName,
      regionName: key.region.name,
    }))
  }
}
