import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "./db/schema.js";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const [user] = await db
  .insert(users)
  .values({
    id: "00000000-0000-0000-0000-000000000001",
    email: "test@viator.dev",
    name: "Dhruv",
  })
  .returning();

console.log("Seeded user:", user);
process.exit(0);
