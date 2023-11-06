import db from "@/lib/db";
import { feed } from "@/lib/db/schema";
import { getUserToken } from "@/lib/utils/authOptions";
import { getCount } from "@/lib/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getUserToken(req);
  const userId = token?.sub;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 404 });
  }

  const feeds = (
    await db.query.feed.findMany({
      columns: {
        id: true,
        title: true,
      },
      with: {
        userFeeds: {
          columns: {
            userId: true,
          },
          where: (fields, { eq }) => eq(fields.active, true),
        },
        notifications: {
          columns: {
            id: true,
          },
        },
      },

      where: (fields, { eq, and }) =>
        and(eq(feed.userId, userId), eq(fields.active, true)),
    })
  ).flatMap((feed) => feed.userFeeds).length;

  return NextResponse.json({ count: feeds, __class__: "feed" });
}
