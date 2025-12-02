import { Region } from '@prisma/client'
import { RegionRepository } from '../repositories/region.repository'

const regionRepository = new RegionRepository()

export class RegionService {
  async list(): Promise<Array<Pick<Region, 'id' | 'name'>>> {
    return regionRepository.findMany()
  }
}
