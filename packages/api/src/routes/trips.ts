import { Hono } from "hono";
import { tripService } from "../services/trips.js";
import {
  createTripSchema,
  updateTripSchema,
  createDaySchema,
  createItemSchema,
} from "../validators.js";

export const tripRoutes = new Hono()

  .get("/", async (c) => {
    const allTrips = await tripService.list();
    return c.json(allTrips);
  })

  .get("/:id", async (c) => {
    const trip = await tripService.getById(c.req.param("id"));
    if (!trip) return c.json({ error: "Trip not found" }, 404);
    return c.json(trip);
  })

  .post("/", async (c) => {
    const body = await c.req.json();
    const parsed = createTripSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    const newTrip = await tripService.create(parsed.data);
    return c.json(newTrip, 201);
  })

  .patch("/:id", async (c) => {
    const body = await c.req.json();
    const parsed = updateTripSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    const updated = await tripService.update(c.req.param("id"), parsed.data);
    if (!updated) return c.json({ error: "Trip not found" }, 404);
    return c.json(updated);
  })

  .delete("/:id", async (c) => {
    const deleted = await tripService.remove(c.req.param("id"));
    if (!deleted) return c.json({ error: "Trip not found" }, 404);
    return c.json({ message: "Trip deleted" });
  })

  .post("/:id/days", async (c) => {
    const body = await c.req.json();
    const parsed = createDaySchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    const newDay = await tripService.addDay(c.req.param("id"), parsed.data);
    return c.json(newDay, 201);
  })

  .post("/:id/days/:dayId/items", async (c) => {
    const body = await c.req.json();
    const parsed = createItemSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
    const newItem = await tripService.addItem(
      c.req.param("dayId"),
      parsed.data,
    );
    return c.json(newItem, 201);
  });
