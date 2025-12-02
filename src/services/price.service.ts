import { PriceRepository } from '../repositories/price.repository'
import { RegionRepository } from '../repositories/region.repository'
import { PeriodRepository } from '../repositories/period.repository'

const priceRepository = new PriceRepository()
const regionRepository = new RegionRepository()
const periodRepository = new PeriodRepository()

export class PriceService {
  async list(regionId: number, periodId: number): Promise<Array<{ quantity: number; price: number }>> {
    await regionRepository.findByIdOrThrow(regionId)
    await periodRepository.findByIdOrThrow(periodId)

    return priceRepository.findByRegionAndPeriod(regionId, periodId)
  }
}
