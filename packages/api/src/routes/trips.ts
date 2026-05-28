import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { trips, itineraryDays, itineraryItems } from "../db/schema.js";
import {
  createTripSchema,
  updateTripSchema,
  createDaySchema,
  createItemSchema,
} from "../validators.js";

// Hardcoded for now
const TEMP_USER_ID = "00000000-0000-0000-0000-000000000001";

export const tripRoutes = new Hono()

  // List all trips
  .get("/", async (c) => {
    const allTrips = await db.query.trips.findMany({
      where: eq(trips.ownerId, TEMP_USER_ID),
      orderBy: (trips, { desc }) => [desc(trips.createdAt)],
    });
    return c.json(allTrips);
  })

  // Get single trip with days and items
  .get("/:id", async (c) => {
    const tripId = c.req.param("id");

    const trip = await db.query.trips.findFirst({
      where: eq(trips.id, tripId),
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

    if (!trip) {
      return c.json({ error: "Trip not found" }, 404);
    }

    return c.json(trip);
  })

  // Create trip
  .post("/", async (c) => {
    const body = await c.req.json();
    const parsed = createTripSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const [newTrip] = await db
      .insert(trips)
      .values({ ...parsed.data, ownerId: TEMP_USER_ID })
      .returning();

    return c.json(newTrip, 201);
  })

  // Update trip
  .patch("/:id", async (c) => {
    const tripId = c.req.param("id");
    const body = await c.req.json();
    const parsed = updateTripSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const [updated] = await db
      .update(trips)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(trips.id, tripId))
      .returning();

    if (!updated) {
      return c.json({ error: "Trip not found" }, 404);
    }

    return c.json(updated);
  })

  // Delete trip
  .delete("/:id", async (c) => {
    const tripId = c.req.param("id");

    const [deleted] = await db
      .delete(trips)
      .where(eq(trips.id, tripId))
      .returning();

    if (!deleted) {
      return c.json({ error: "Trip not found" }, 404);
    }

    return c.json({ message: "Trip deleted" });
  })

  // Add day to trip
  .post("/:id/days", async (c) => {
    const tripId = c.req.param("id");
    const body = await c.req.json();
    const parsed = createDaySchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const [newDay] = await db
      .insert(itineraryDays)
      .values({ ...parsed.data, tripId })
      .returning();

    return c.json(newDay, 201);
  })

  // Add item to day
  .post("/:id/days/:dayId/items", async (c) => {
    const dayId = c.req.param("dayId");
    const body = await c.req.json();
    const parsed = createItemSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const [newItem] = await db
      .insert(itineraryItems)
      .values({ ...parsed.data, dayId })
      .returning();

    return c.json(newItem, 201);
  });
