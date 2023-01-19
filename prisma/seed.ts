/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main () {
  const user = await prisma.user.create(
    {
      data:
        {
          email: 'a.esmaeili.sut@gmail.com',
          name: 'ali esmaeili'
        }
    })
  await prisma.post.create(
    {
      data:
        {
          title: 'First Post',
          content: 'This is an example post generated from `prisma/seed.ts`',
          authorId: user.id
        }
    })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
