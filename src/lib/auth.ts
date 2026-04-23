import { db } from "@/lib/db";
import { betterAuth } from "better-auth";
import * as schema from "@/lib/db/schema";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  database: drizzleAdapter(db, { schema, provider: "pg" }),
});
