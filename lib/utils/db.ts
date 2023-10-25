import db from "@/lib/db";
import { feed, user } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function getCount(
  model: string,
  key: string = "",
  value: string = ""
) {
  //   const count = await db.select({ count: sql<number>`count(*)` }).from(_model).where((key && value) ? eq(_model.[key], value));
  const query = `select count(*) from "${model}" ${
    key && value ? `where "${model}"."${key}" = '${value}'` : ""
  }`;

  const count = await db.execute(sql.raw(query));

  if (count.rows[0].count) {
    return parseInt(count.rows[0].count as string);
  }

  return 0;
}
