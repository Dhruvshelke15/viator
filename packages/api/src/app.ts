import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./trpc/router.js";
import { tripRoutes } from "./routes/trips.js";

const app = new Hono()
  .use("*", logger())
  .use("*", cors())
  .get("/health", (c) =>
    c.json({ status: "ok", timestamp: new Date().toISOString() }),
  )
  .use("/trpc/*", trpcServer({ router: appRouter }))
  .route("/api/trips", tripRoutes);

export default app;
export type AppType = typeof app;
