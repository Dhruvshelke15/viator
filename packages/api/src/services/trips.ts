import { eq, and } from "drizzle-orm";
import { trips, itineraryDays, itineraryItems } from "../db/schema.js";
import type { Database } from "../db/index.js";
import type { CreateTrip, UpdateTrip, CreateDay, CreateItem } from "../validators.js";

export function createTripService(db: Database, userId: string) {
  return {
    async list() {
      return db.query.trips.findMany({
        where: eq(trips.ownerId, userId),
        orderBy: (trips, { desc }) => [desc(trips.createdAt)],
      });
    },

    async getById(id: string) {
      return db.query.trips.findFirst({
        where: and(eq(trips.id, id), eq(trips.ownerId, userId)),
        with: {
          days: {
            orderBy: (days, { asc }) => [asc(days.dayNumber)],
            with: {
              items: {
                orderBy: (items, { asc }) => [asc(items.sortOrder)],
              },
            },
          },
        },
      });
    },

    async create(data: CreateTrip) {
      const [newTrip] = await db
        .insert(trips)
        .values({ ...data, ownerId: userId })
        .returning();
      return newTrip;
    },

    async update(id: string, data: UpdateTrip) {
      const [updated] = await db
        .update(trips)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(trips.id, id), eq(trips.ownerId, userId)))
        .returning();
      return updated;
    },

    async remove(id: string) {
      const [deleted] = await db
        .delete(trips)
        .where(and(eq(trips.id, id), eq(trips.ownerId, userId)))
        .returning();
      return deleted;
    },

    async addDay(tripId: string, data: CreateDay) {
      const trip = await db.query.trips.findFirst({
        where: and(eq(trips.id, tripId), eq(trips.ownerId, userId)),
      });
      if (!trip) return null;

      const [newDay] = await db
        .insert(itineraryDays)
        .values({ ...data, tripId })
        .returning();
      return newDay;
    },

    async addItem(dayId: string, data: CreateItem) {
      const day = await db.query.itineraryDays.findFirst({
        where: eq(itineraryDays.id, dayId),
        with: { trip: true },
      });
      if (!day || day.trip.ownerId !== userId) return null;

      const [newItem] = await db
        .insert(itineraryItems)
        .values({ ...data, dayId })
        .returning();
      return newItem;
    },
  };
}
