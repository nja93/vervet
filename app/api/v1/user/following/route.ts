import db from "@/lib/db";
import { getLimitOffset } from "@/lib/utils/api";
import { getUserToken } from "@/lib/utils/authOptions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getUserToken(req);
  const userId = token?.sub;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 404 });
  }
  const { limit, offset } = getLimitOffset(req);
  const feeds = (
    await db.query.userFeed.findMany({
      columns: {},
      with: { feed: true },
      where: (userFeed, { eq }) => eq(userFeed.userId, userId),
      limit: limit,
      offset: offset,
    })
  ).map((obj) => obj.feed);

  return NextResponse.json(feeds);
}
