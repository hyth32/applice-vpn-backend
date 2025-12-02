import { Region } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { HttpError } from '../lib/errors/http-error'

export class RegionRepository {
  async findByIdOrThrow(id: number): Promise<Region> {
    const region = await prisma.region.findUnique({ where: { id } })
    if (!region) {
      throw new HttpError('Region not found', 404)
    }
    return region
  }

  async findMany(): Promise<Array<Pick<Region, 'id' | 'name'>>> {
    return prisma.region.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    })
  }
}
