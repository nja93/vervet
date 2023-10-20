import type { Config } from "drizzle-kit";
import { cwd } from "node:process";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(cwd());

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL as string,
  },
} satisfies Config;
