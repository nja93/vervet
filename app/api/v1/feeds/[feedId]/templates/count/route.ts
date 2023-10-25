import db from "@/lib/db";
import { feedTemplate } from "@/lib/db/schema";
import { getCount } from "@/lib/utils/db";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { feedId: string } }
) {
  // const template_count = await db
  //   .select({
  //     count: sql<number>`count(*)`,
  //   })
  //   .from(feedTemplate)
  //   .where(eq(feedTemplate.feedId, params.feedId));

  const count = await getCount("feed_template", "feed_id", params.feedId);
  return NextResponse.json({ count, __class__: "template" });
}
