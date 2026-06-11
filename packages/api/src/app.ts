import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./trpc/router.js";
import { createDb } from "./db/index.js";
import { createAuth } from "./auth.js";
import { tripRoutes } from "./routes/trips.js";

type Env = {
  Bindings: {
    DATABASE_URL: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    TRUSTED_ORIGIN: string;
  };
};

const app = new Hono<Env>()
  .use("*", logger())
  .use("*", async (c, next) => {
    return cors({
      origin: c.env.TRUSTED_ORIGIN,
      credentials: true,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
    })(c, next);
  })
  .get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }))
  .on(["POST", "GET"], "/api/auth/*", (c) => {
    const auth = createAuth(c.env);
    return auth.handler(c.req.raw);
  })
  .use("/trpc/*", async (c, next) => {
    const auth = createAuth(c.env);
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    const middleware = trpcServer({
      router: appRouter,
      createContext: () => ({
        db: createDb(c.env.DATABASE_URL),
        userId: session?.user?.id ?? null,
      }),
    });
    return middleware(c, next);
  })
  .route("/api/trips", tripRoutes);

export default app;
export type AppType = typeof app;
