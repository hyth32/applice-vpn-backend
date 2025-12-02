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
}
