import { serve } from "@hono/node-server";
import "dotenv/config";
import app from "./app.js";

const port = Number(process.env.PORT) || 3000;

const fetch = (req: Request) => {
  return app.fetch(req, { DATABASE_URL: process.env.DATABASE_URL! });
};

console.log(`Viator API running at http://localhost:${port}`);

serve({ fetch, port });
