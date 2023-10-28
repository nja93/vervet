import db from "@/lib/db";
import { feed } from "@/lib/db/schema";
import { getLimitOffset } from "@/lib/utils/api";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { limit, offset } = getLimitOffset(req);

  const feed_many = await db
    .select()
    .from(feed)
    .where(eq(feed.active, true))
    .limit(limit)
    .offset(offset);

  return NextResponse.json(feed_many);
}
