import { Region } from '@prisma/client'
import { prisma } from '../lib/prisma'

export class RegionRepository {
  async findByIdOrThrow(id: number): Promise<Region> {
    const region = await prisma.region.findUnique({ where: { id } })
    if (!region) {
      throw new Error('Region not found')
    }
    return region
  }
}
