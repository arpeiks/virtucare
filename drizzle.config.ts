import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();
dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Add it to .env.local (or .env) before running drizzle-kit.");
}

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/lib/db/schema.ts",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
