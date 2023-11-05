import db from "@/lib/db";
import { feed } from "@/lib/db/schema";
import { resourceNotFound } from "@/lib/utils/api";
import { getUserToken } from "@/lib/utils/authOptions";
import { getCount } from "@/lib/utils/db";
import { and, eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { feedId: string } }
) {
  const feed_one = await db.query.feed.findFirst({
    where: (feed, { eq }) => and(eq(feed.id, params.feedId)),
  });

  if (!feed_one) {
    return resourceNotFound("feed", params.feedId);
  }

  return NextResponse.json(feed_one);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { feedId: string } }
) {
  const token = await getUserToken(req);
  const userId = token?.sub;

  let body = { ...(await req.json()) };
  const validator = createInsertSchema(feed)
    .omit({ userId: true })
    .safeParse(body);

  if (validator.success === false) {
    return NextResponse.json(validator.error, { status: 400 });
  }

  // Confirm user exists
  const feedExists = await getCount("feed", "id", params.feedId);

  if (!feedExists) {
    return resourceNotFound("feed", params.feedId);
  }

  const res = await db
    .update(feed)
    .set({ ...body })
    .where(and(eq(feed.userId, userId!), eq(feed.id, params.feedId)))
    .returning({ id: feed.id });

  return NextResponse.json(res[0]);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { feedId: string } }
) {
  const token = await getUserToken(req);
  const userId = token?.sub;

  // Confirm user exists
  const feedExists = await getCount("feed", "id", params.feedId);

  if (!feedExists) {
    return resourceNotFound("feed", params.feedId);
  }

  const res = await db
    .update(feed)
    .set({ active: false })
    .where(and(eq(feed.userId, userId!), eq(feed.id, params.feedId)))
    .returning({ id: feed.id });

  return NextResponse.json(res[0]);
}
