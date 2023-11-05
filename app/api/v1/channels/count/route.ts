import db from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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
    })
  ).filter((user) => user.feeds.length).length;

  return NextResponse.json({ count: user_many, __class__: "feed" });
}
