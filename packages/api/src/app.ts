import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./trpc/router.js";
import { createDb } from "./db/index.js";
import { tripRoutes } from "./routes/trips.js";

type Env = { Bindings: { DATABASE_URL: string } };

const app = new Hono<Env>()
  .use("*", logger())
  .use("*", cors({ origin: "*" }))
  .get("/health", (c) =>
    c.json({ status: "ok", timestamp: new Date().toISOString() }),
  )
  .use("/trpc/*", async (c, next) => {
    const middleware = trpcServer({
      router: appRouter,
      createContext: () => ({ db: createDb(c.env.DATABASE_URL) }),
    });
    return middleware(c, next);
  })
  .route("/api/trips", tripRoutes);

export default app;
export type AppType = typeof app;
