import { z } from "zod";
import { router, protectedProcedure } from "./init.js";
import { createTripService } from "../services/trips.js";
import {
  createTripSchema,
  updateTripSchema,
  createDaySchema,
  createItemSchema,
} from "../validators.js";

export const appRouter = router({
  trips: router({
    list: protectedProcedure.query(({ ctx }) => {
      return createTripService(ctx.db, ctx.userId).list();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(({ ctx, input }) => {
        return createTripService(ctx.db, ctx.userId).getById(input.id);
      }),

    create: protectedProcedure
      .input(createTripSchema)
      .mutation(({ ctx, input }) => {
        return createTripService(ctx.db, ctx.userId).create(input);
      }),

    update: protectedProcedure
      .input(z.object({ id: z.string().uuid(), data: updateTripSchema }))
      .mutation(({ ctx, input }) => {
        return createTripService(ctx.db, ctx.userId).update(input.id, input.data);
      }),

    remove: protectedProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(({ ctx, input }) => {
        return createTripService(ctx.db, ctx.userId).remove(input.id);
      }),

    addDay: protectedProcedure
      .input(z.object({ tripId: z.string().uuid(), data: createDaySchema }))
      .mutation(({ ctx, input }) => {
        return createTripService(ctx.db, ctx.userId).addDay(input.tripId, input.data);
      }),

    addItem: protectedProcedure
      .input(z.object({ dayId: z.string().uuid(), data: createItemSchema }))
      .mutation(({ ctx, input }) => {
        return createTripService(ctx.db, ctx.userId).addItem(input.dayId, input.data);
      }),
  }),
});

export type AppRouter = typeof appRouter;
