/**
 * Adds seed data to your db
 *
 * @link https://www.prisma.io/docs/guides/database/seed-database
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main () {
  const firstId = 1
  const user = await prisma.user.upsert(
    {
      where: {
        id: firstId
      },
      create:
        {
          email: 'a.esmaeili.sut@gmail.com',
          name: 'ali esmaeili'
        },
      update: {}
    })
  await prisma.post.upsert(
    {
      where: {
        id: firstId
      },
      create:
        {
          title: 'First Post',
          content: 'This is an example post generated from `prisma/seed.ts`',
          authorId: user.id
        },
      update: {}
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
