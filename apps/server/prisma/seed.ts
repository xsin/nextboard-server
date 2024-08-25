import process from 'node:process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createDefaultRoles(): Promise<void> {
  const roles = [
    { id: 'ckv4j6z1e0001h7y5e7k8b9c1', name: 'Visitor', displayName: 'Visitor', isSystem: true },
    { id: 'ckv4j6z1e0002h7y5e7k8b9c2', name: 'Admin', displayName: 'Admin', isSystem: true },
  ]

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: {},
      create: role,
    })
  }
}

async function main(): Promise<void> {
  await createDefaultRoles()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
