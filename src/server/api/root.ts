import { createTRPCRouter } from "./trpc";
import { todoRouter } from "./routers/todo";
import { surveyRouter } from "./routers/survey";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  todo: todoRouter,
  survey: surveyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
