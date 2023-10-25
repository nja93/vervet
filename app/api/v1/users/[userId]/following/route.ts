import db from "@/lib/db";
import { feed, user } from "@/lib/db/schema";
import { getLimitOffset, resourceNotFound } from "@/lib/utils/api";
import { getCount } from "@/lib/utils/db";
import { eq, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
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

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  let body = { ...(await req.json()), userId: params.userId };
  const validator = createInsertSchema(feed).safeParse({
    ...body,
  });

  if (validator.success === false) {
    return NextResponse.json(validator.error, { status: 400 });
  }

  // Confirm user exists
  const userExists = await getCount("user", "id", params.userId);

  if (!userExists) {
    return resourceNotFound("user", params.userId);
  }

  const res = await db
    .insert(feed)
    .values({ ...body })
    .returning({ id: feed.id });

  return NextResponse.json(res, { status: 201 });
}
