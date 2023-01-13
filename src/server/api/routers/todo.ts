import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const todoRouter = createTRPCRouter({
  new: protectedProcedure
    .input(z.object({
      date: z.date(),
      todos: z.array(z.string())
    }))
    .mutation(async ({ ctx, input }) => {
      const todoListDB = await ctx.prisma.todoList.create({
        data: {
          day: input.date,
          user: {
            connect: { id: ctx.session.user.id },
          }
        },
      });

      return Promise.all(input.todos.map(async (text) => {
        await ctx.prisma.todoItem.create({
          data: {
            text,
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
            todoList: {
              connect: {
                id: todoListDB.id,
              },
            },
          },
        });
      }));
    })
});
