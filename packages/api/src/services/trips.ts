import { eq } from "drizzle-orm";
import { trips, itineraryDays, itineraryItems } from "../db/schema.js";
import type { Database } from "../db/index.js";
import type {
  CreateTrip,
  UpdateTrip,
  CreateDay,
  CreateItem,
} from "../validators.js";

const TEMP_USER_ID = "00000000-0000-0000-0000-000000000001";

export function createTripService(db: Database) {
  return {
    async list() {
      return db.query.trips.findMany({
        where: eq(trips.ownerId, TEMP_USER_ID),
        orderBy: (trips, { desc }) => [desc(trips.createdAt)],
      });
    },

    async getById(id: string) {
      return db.query.trips.findFirst({
        where: eq(trips.id, id),
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
        .values({ ...data, ownerId: TEMP_USER_ID })
        .returning();
      return newTrip;
    },

    async update(id: string, data: UpdateTrip) {
      const [updated] = await db
        .update(trips)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(trips.id, id))
        .returning();
      return updated;
    },

    async remove(id: string) {
      const [deleted] = await db
        .delete(trips)
        .where(eq(trips.id, id))
        .returning();
      return deleted;
    },

    async addDay(tripId: string, data: CreateDay) {
      const [newDay] = await db
        .insert(itineraryDays)
        .values({ ...data, tripId })
        .returning();
      return newDay;
    },

    async addItem(dayId: string, data: CreateItem) {
      const [newItem] = await db
        .insert(itineraryItems)
        .values({ ...data, dayId })
        .returning();
      return newItem;
    },
  };
}
