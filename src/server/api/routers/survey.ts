import { QuestionType } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";


export const surveyRouter = createTRPCRouter({
  new: protectedProcedure
    .input(z.object({
      questions: z.array(
        z.object({
          text: z.string(),
          title: z.string(),
          type: z.enum([QuestionType.YES_NO, QuestionType.ONE_TO_FIVE]),
        })
      )
    }))
    .mutation(async ({ ctx, input }) => {
      return Promise.all(input.questions.map(async ({ text, title, type }) => {
        await ctx.prisma.surveyQuestion.create({
          data: {
            text,
            title,
            type,
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
      }));
    })
});
