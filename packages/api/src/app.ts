import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { tripRoutes } from "./routes/trips.js";

const app = new Hono()
  .use("*", logger())
  .use("*", cors())
  .get("/health", (c) =>
    c.json({ status: "ok", timestamp: new Date().toISOString() }),
  )
  .route("/api/trips", tripRoutes);

export default app;
export type AppType = typeof app;
