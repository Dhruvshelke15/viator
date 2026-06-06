import { initTRPC } from "@trpc/server";
import type { Database } from "../db/index.js";

export interface Context {
  db: Database;
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
