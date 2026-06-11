import { serve } from "@hono/node-server";
import "dotenv/config";
import app from "./app.js";

const port = Number(process.env.PORT) || 3000;

const fetch = (req: Request) => {
  return app.fetch(req, {
    DATABASE_URL: process.env.DATABASE_URL!,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
    TRUSTED_ORIGIN: process.env.TRUSTED_ORIGIN!,
  });
};

console.log(`Viator API running at http://localhost:${port}`);

serve({ fetch, port });
