import db from "@/lib/db";
import { getUserToken } from "@/lib/utils/authOptions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getUserToken(req);
  const userId = token?.sub;
  const query = req.nextUrl.searchParams.get("query");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 404 });
  }

  if (!query) {
    return NextResponse.json({ users: [], feeds: [] });
  }

  const feeds = await db.query.feed.findMany({
    columns: {
      id: true,
      title: true,
    },
    with: {
      userFeeds: {
        columns: {
          feedId: true,
        },
        where: (userFeed, { eq }) => eq(userFeed.active, true),
      },
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    where: (feed, { ilike, and, or, eq }) =>
      and(eq(feed.active, true), ilike(feed.title, `%${query}%`)),
  });

  const users = (
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
          },
          where: (feed, { eq }) => eq(feed.active, true),
        },
      },
      where: (user, { ilike }) => ilike(user.name, `%${query}%`),
    })
  ).filter((user) => user.feeds.length);

  return NextResponse.json({ users, feeds });
}
