import { basePrisma } from './prisma/base'
import { orderExtension } from './prisma/extensions/order'
import { userExtension } from './prisma/extensions/user'

export const prisma = basePrisma
  .$extends(orderExtension(basePrisma))
  .$extends(userExtension(basePrisma))
