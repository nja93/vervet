import db from "@/lib/db";
import { sql } from "drizzle-orm";

export async function getCount(
  table: string,
  key: string = "",
  value: string = "",
  options?: { active?: boolean }
) {
  let query = `select count(*) from "${table}" ${
    key && value ? `where "${table}"."${key}" = '${value}'` : ""
  }`;
  if (options?.active) {
    query += ` ${key && value ? " and " : " where "} "${table}"."active" = ${
      options?.active
    }`;
  }

  const count = await db.execute(sql.raw(query));

  if (count.rows[0].count) {
    return parseInt(count.rows[0].count as string);
  }

  return 0;
}
