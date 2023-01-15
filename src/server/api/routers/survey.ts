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
    }),
  answerSurvey: protectedProcedure
    .input(z.object({
      date: z.date(),
      answers: z.array(
        z.object({
          questionId: z.string(),
          type: z.enum([QuestionType.YES_NO, QuestionType.ONE_TO_FIVE]),
          answer: z.number(),
        })
      )
    }))
    .mutation(async ({ ctx, input }) => {
      return Promise.all(input.answers.map(async ({ questionId, answer }) => {
        await ctx.prisma.surveyAnswer.create({
          data: {
            day: ctx.utils.formatDateForDB(input.date),
            answer,
            question: {
              connect: {
                id: questionId,
              },
            },
            user: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
      }));
    }),
  get: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.prisma.surveyQuestion.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
          text: true,
          type: true,
        }
      });
    }),
});
