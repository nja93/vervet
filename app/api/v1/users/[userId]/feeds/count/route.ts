import db from "@/lib/db";
import { userFeed } from "@/lib/db/schema";
import { getCount } from "@/lib/utils/db";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  // const feed_count = await db
  //   .select({ count: sql<number>`count(*)` })
  //   .from(userFeed)
  //   .where(eq(userFeed.userId, params.userId));

  const count = await getCount("feed", "user_id", params.userId);

  return NextResponse.json({ count, __class__: "feed" });
}
