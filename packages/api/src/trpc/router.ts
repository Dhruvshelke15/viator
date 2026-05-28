import { z } from "zod";
import { router, publicProcedure } from "./init.js";
import { tripService } from "../services/trips.js";
import {
  createTripSchema,
  updateTripSchema,
  createDaySchema,
  createItemSchema,
} from "../validators.js";

export const appRouter = router({
  trips: router({
    list: publicProcedure.query(() => {
      return tripService.list();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(({ input }) => {
        return tripService.getById(input.id);
      }),

    create: publicProcedure.input(createTripSchema).mutation(({ input }) => {
      return tripService.create(input);
    }),

    update: publicProcedure
      .input(z.object({ id: z.string().uuid(), data: updateTripSchema }))
      .mutation(({ input }) => {
        return tripService.update(input.id, input.data);
      }),

    remove: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .mutation(({ input }) => {
        return tripService.remove(input.id);
      }),

    addDay: publicProcedure
      .input(z.object({ tripId: z.string().uuid(), data: createDaySchema }))
      .mutation(({ input }) => {
        return tripService.addDay(input.tripId, input.data);
      }),

    addItem: publicProcedure
      .input(z.object({ dayId: z.string().uuid(), data: createItemSchema }))
      .mutation(({ input }) => {
        return tripService.addItem(input.dayId, input.data);
      }),
  }),
});

export type AppRouter = typeof appRouter;
