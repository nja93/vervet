import db from "@/lib/db";
import { subscription, userFeed } from "@/lib/db/schema";
import { getCount } from "@/lib/utils/db";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { feedId: string } }
) {
  const count = await getCount("user_feed", "feed_id", params.feedId);
  return NextResponse.json({
    count,
    __class__: "subscription",
  });
}
