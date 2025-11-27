import { basePrisma } from './prisma/base'
import { keyExtension } from './prisma/extensions/key'
import { userExtension } from './prisma/extensions/user'

export const prisma = basePrisma
  .$extends(keyExtension(basePrisma))
  .$extends(userExtension(basePrisma))
