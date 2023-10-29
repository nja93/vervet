import db from "@/lib/db";
import { getLimitOffset } from "@/lib/utils/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { limit, offset } = getLimitOffset(req);
  const feeds = (
    await db.query.userFeed.findMany({
      columns: {},
      with: { feed: true },
      where: (userFeed, { eq }) => eq(userFeed.userId, params.userId),
      limit: limit,
      offset: offset,
    })
  ).map((obj) => obj.feed);

  return NextResponse.json(feeds);
}
