import { getCount } from "@/lib/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // const feed_count = await db
  //   .select({ count: sql<number>`count(*)` })
  //   .from(feed);

  const count = await getCount("feed", "", "", { active: true });

  return NextResponse.json({ count, __class__: "feed" });
}
