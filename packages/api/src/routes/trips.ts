import { Hono } from "hono";
import { createDb } from "../db/index.js";
import { createTripService } from "../services/trips.js";
import {
  createTripSchema,
  updateTripSchema,
  createDaySchema,
  createItemSchema,
} from "../validators.js";

type Env = { Bindings: { DATABASE_URL: string } };

export const tripRoutes = new Hono<Env>()

  .get("/", async (c) => {
    const service = createTripService(createDb(c.env.DATABASE_URL));
    const allTrips = await service.list();
    return c.json(allTrips);
  })

  .get("/:id", async (c) => {
    const service = createTripService(createDb(c.env.DATABASE_URL));
    const trip = await service.getById(c.req.param("id"));
    if (!trip) return c.json({ error: "Trip not found" }, 404);
    return c.json(trip);
  })

  .post("/", async (c) => {
    const body = await c.req.json();
    const parsed = createTripSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    const service = createTripService(createDb(c.env.DATABASE_URL));
    const newTrip = await service.create(parsed.data);
    return c.json(newTrip, 201);
  })

  .patch("/:id", async (c) => {
    const body = await c.req.json();
    const parsed = updateTripSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    const service = createTripService(createDb(c.env.DATABASE_URL));
    const updated = await service.update(c.req.param("id"), parsed.data);
    if (!updated) return c.json({ error: "Trip not found" }, 404);
    return c.json(updated);
  })

  .delete("/:id", async (c) => {
    const service = createTripService(createDb(c.env.DATABASE_URL));
    const deleted = await service.remove(c.req.param("id"));
    if (!deleted) return c.json({ error: "Trip not found" }, 404);
    return c.json({ message: "Trip deleted" });
  })

  .post("/:id/days", async (c) => {
    const body = await c.req.json();
    const parsed = createDaySchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    const service = createTripService(createDb(c.env.DATABASE_URL));
    const newDay = await service.addDay(c.req.param("id"), parsed.data);
    return c.json(newDay, 201);
  })

  .post("/:id/days/:dayId/items", async (c) => {
    const body = await c.req.json();
    const parsed = createItemSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    const service = createTripService(createDb(c.env.DATABASE_URL));
    const newItem = await service.addItem(c.req.param("dayId"), parsed.data);
    return c.json(newItem, 201);
  });
