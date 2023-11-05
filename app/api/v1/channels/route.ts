import { canSendRequest } from "@/app/api/config/limiter";
import db from "@/lib/db";
import { getLimitOffset } from "@/lib/utils/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { limit, offset } = getLimitOffset(req);

  if (!(await canSendRequest("/channels"))) {
    return NextResponse.json(null, { status: 429 });
  }

  const user_many = (
    await db.query.user.findMany({
      columns: {
        id: true,
        name: true,
        image: true,
      },
      with: {
        feeds: {
          columns: {
            id: true,
            title: true,
          },
          where: (feed, { eq }) => eq(feed.active, true),
        },
      },
      limit: limit,
      offset: offset,
    })
  )
    .filter((user) => user.feeds.length)
    .slice(offset, limit ? offset + limit : undefined);

  return NextResponse.json(user_many);
}
