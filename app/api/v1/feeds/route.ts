import { canSendRequest } from "@/app/api/config/limiter";
import db from "@/lib/db";
import { getLimitOffset } from "@/lib/utils/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { limit, offset } = getLimitOffset(req);

  if (!(await canSendRequest("/feeds"))) {
    return NextResponse.json(null, { status: 429 });
  }

  const feed_many = await db.query.feed.findMany({
    columns: {
      id: true,
      title: true,
    },
    with: {
      userFeeds: {
        columns: {
          userId: true,
        },
      },
    },

    where: (fields, { eq }) => eq(fields.active, true),
    limit: limit,
    offset: offset,
  });

  return NextResponse.json(feed_many);
}
