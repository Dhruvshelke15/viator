import { z } from "zod";
import { router, publicProcedure } from "./init.js";
import { createTripService } from "../services/trips.js";
import {
  createTripSchema,
  updateTripSchema,
  createDaySchema,
  createItemSchema,
} from "../validators.js";

export const appRouter = router({
  trips: router({
    list: publicProcedure.query(({ ctx }) => {
      return createTripService(ctx.db).list();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(({ ctx, input }) => {
        return createTripService(ctx.db).getById(input.id);
      }),

    create: publicProcedure
      .input(createTripSchema)
      .mutation(({ ctx, input }) => {
        return createTripService(ctx.db).create(input);
      }),

    update: publicProcedure
      .input(z.object({ id: z.string().uuid(), data: updateTripSchema }))
      .mutation(({ ctx, input }) => {
        return createTripService(ctx.db).update(input.id, input.data);
      }),

    remove: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(({ ctx, input }) => {
        return createTripService(ctx.db).remove(input.id);
      }),

    addDay: publicProcedure
      .input(z.object({ tripId: z.string().uuid(), data: createDaySchema }))
      .mutation(({ ctx, input }) => {
        return createTripService(ctx.db).addDay(input.tripId, input.data);
      }),

    addItem: publicProcedure
      .input(z.object({ dayId: z.string().uuid(), data: createItemSchema }))
      .mutation(({ ctx, input }) => {
        return createTripService(ctx.db).addItem(input.dayId, input.data);
      }),
  }),
});

export type AppRouter = typeof appRouter;
