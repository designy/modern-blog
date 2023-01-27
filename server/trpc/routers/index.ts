import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { publicProcedure, router } from '../trpc'

const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  title: true,
  content: true,
  updatedAt: true
})
export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string().nullish()
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
        time: new Date()
      }
    }),
  posts: publicProcedure.input(
    z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish()
    })
  ).query(async ({ input, ctx }) => {
    const limit = input.limit ?? 50
    const { cursor } = input

    const posts = await ctx.prisma.post.findMany({
      select: defaultPostSelect,
      // get an extra item at the end which we'll use as next cursor
      take: limit + 1,
      where: {},
      cursor: cursor
        ? {
            id: cursor
          }
        : undefined,
      orderBy: {
        createdAt: 'desc'
      }

    })
    let nextCursor: typeof cursor | undefined
    if (posts.length > limit) {
      // Remove the last item and use it as next cursor

      const nextItem = posts.pop()!
      nextCursor = nextItem.id
    }
    return {
      items: posts.reverse(),
      nextCursor
    }
  }

  )
})

// export type definition of API
export type AppRouter = typeof appRouter
