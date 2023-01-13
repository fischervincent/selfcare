import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const to2Digits = (num: number) => {
  return num.toString().padStart(2, "0");
};

const formatDateForDB = (date: Date) => {
  const year = to2Digits(date.getFullYear());
  const month = to2Digits(date.getMonth() + 1);
  const day = to2Digits(date.getDate());
  return `${year}-${month}-${day}`;
};

export const todoRouter = createTRPCRouter({
  getByToday: protectedProcedure
    .input(z.object({
      date: z.date(),
    }))
    .query(async ({ ctx, input }) => {
      const todoList = await ctx.prisma.todoList.findFirst({
        where: {
          day: formatDateForDB(input.date),
          userId: ctx.session.user.id,
        },
        include: {
          todoItems: {
            select: {
              id: true,
              text: true,
            },
          },
        }
      });
      return todoList;
    }),

  new: protectedProcedure
    .input(z.object({
      date: z.date(),
      todos: z.array(z.string())
    }))
    .mutation(async ({ ctx, input }) => {
      const todoListDB = await ctx.prisma.todoList.create({
        data: {
          day: formatDateForDB(input.date),
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
