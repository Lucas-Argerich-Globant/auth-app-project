import { prisma } from '../src/config/prisma.ts'
import { hashPassword } from '../src/utils/auth.utils.ts'

try {
  await prisma.user.create({
    data: {
      first_name: 'Admin',
      last_name: 'Globant',
      email: 'admin@globant.com',
      pass_hash: await hashPassword('admin1234'),
      role: 'admin'
    }
  })

  console.log('✅ Admin user created')
} catch (error) {
  console.error('❌ Failed to create admin user:', error)
} finally {
  await prisma.$disconnect()
  process.exit(0)
}