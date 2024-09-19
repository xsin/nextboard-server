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

async function createDefaultUsers(): Promise<void> {
  const users = [
    {
      id: 'ckv4j6z1e0003h7y5e7k8b9c0',
      name: 'Admin',
      displayName: 'Admin',
      email: 'nextboard@qq.com',
      password: '$2b$10$HrDsrhHNsQ/7zgWRDv4L/u7nEzW7TWWmnA8hlcVau16zvk09sB48W',
      emailVerifiedAt: new Date(),
    },
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    })
  }

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: 'ckv4j6z1e0003h7y5e7k8b9c0', roleId: 'ckv4j6z1e0002h7y5e7k8b9c2' } },
    update: {},
    create: { userId: 'ckv4j6z1e0003h7y5e7k8b9c0', roleId: 'ckv4j6z1e0002h7y5e7k8b9c2' },
  })
}

async function createDefaultAccountForAdmin(): Promise<void> {
  const admin = await prisma.user.findUnique({ where: { id: 'ckv4j6z1e0003h7y5e7k8b9c0' } })
  if (!admin) {
    throw new Error('Admin user not found')
  }

  await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: 'localPwd',
        providerAccountId: admin.email,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      provider: 'localPwd',
      providerAccountId: admin.email,
      type: 'local',
    },
  })
}

async function createDefaultPermissions(): Promise<void> {
  const permissions = [
    { id: 'ckv4j6z1e0003h7y5e7k8b9c3', name: 'user.select', displayName: 'User Select' },
    { id: 'ckv4j6z1e0004h7y5e7k8b9c4', name: 'user.create', displayName: 'User Create' },
    { id: 'ckv4j6z1e0005h7y5e7k8b9c5', name: 'user.update', displayName: 'User Update' },
    { id: 'ckv4j6z1e0006h7y5e7k8b9c6', name: 'user.delete', displayName: 'User Delete' },
    { id: 'ckv4j6z1e0007h7y5e7k8b9c7', name: 'role.select', displayName: 'Role Select' },
    { id: 'ckv4j6z1e0008h7y5e7k8b9c8', name: 'role.create', displayName: 'Role Create' },
    { id: 'ckv4j6z1e0009h7y5e7k8b9c9', name: 'role.update', displayName: 'Role Update' },
    { id: 'ckv4j6z1e000ah7y5e7k8b9ca', name: 'role.delete', displayName: 'Role Delete' },
    { id: 'ckv4j6z1e000bh7y5e7k8b9cb', name: 'permission.select', displayName: 'Permission Select' },
    { id: 'ckv4j6z1e000ch7y5e7k8b9cc', name: 'permission.create', displayName: 'Permission Create' },
    { id: 'ckv4j6z1e000dh7y5e7k8b9cd', name: 'permission.update', displayName: 'Permission Update' },
    { id: 'ckv4j6z1e000eh7y5e7k8b9ce', name: 'permission.delete', displayName: 'Permission Delete' },
    { id: 'ckv4j6z1e000fh7y5e7k8b9cf', name: 'resource.select', displayName: 'Resource Select' },
    { id: 'ckv4j6z1e000gh7y5e7k8b9cg', name: 'resource.create', displayName: 'Resource Create' },
    { id: 'ckv4j6z1e000hh7y5e7k8b9ch', name: 'resource.update', displayName: 'Resource Update' },
    { id: 'ckv4j6z1e000ih7y5e7k8b9ci', name: 'resource.delete', displayName: 'Resource Delete' },
    { id: 'ckv4j6z1e000jh7y5e7k8b9cj', name: 'dic.select', displayName: 'Dic Select' },
    { id: 'ckv4j6z1e000kh7y5e7k8b9ck', name: 'dic.create', displayName: 'Dic Create' },
    { id: 'ckv4j6z1e000lh7y5e7k8b9cl', name: 'dic.update', displayName: 'Dic Update' },
    { id: 'ckv4j6z1e000mh7y5e7k8b9cm', name: 'dic.delete', displayName: 'Dic Delete' },
    { id: 'ckv4j6z1e000nh7y5e7k8b9cn', name: 'log.select', displayName: 'Log Select' },
    { id: 'ckv4j6z1e000oh7y5e7k8b9co', name: 'log.delete', displayName: 'Log Delete' },
  ]

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { id: permission.id },
      update: {},
      create: permission,
    })
  }
}

async function createAdminRolePermissions(): Promise<void> {
  const adminRole = await prisma.role.findUnique({ where: { id: 'ckv4j6z1e0002h7y5e7k8b9c2' } })
  if (!adminRole) {
    throw new Error('Admin role not found')
  }

  const permissions = await prisma.permission.findMany()
  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
        createdBy: 'ckv4j6z1e0003h7y5e7k8b9c0',
      },
    })
  }
}

async function main(): Promise<void> {
  await createDefaultRoles()
  await createDefaultUsers()
  await createDefaultAccountForAdmin()
  await createDefaultPermissions()
  await createAdminRolePermissions()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
