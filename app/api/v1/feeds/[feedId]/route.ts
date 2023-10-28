import db from "@/lib/db";
import { feed } from "@/lib/db/schema";
import { resourceNotFound } from "@/lib/utils/api";
import { getCount } from "@/lib/utils/db";
import { and, eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { feedId: string } }
) {
  const feed_one = await db.query.feed.findFirst({
    where: (feed, { eq }) =>
      and(eq(feed.id, params.feedId), eq(feed.active, true)),
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
  let body = { ...(await req.json()) };
  const validator = createInsertSchema(feed).safeParse(body);

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
    .where(eq(feed.id, params.feedId))
    .returning({ id: feed.id });

  return NextResponse.json(res);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { feedId: string } }
) {
  let body = { ...(await req.json()) };
  const validator = createInsertSchema(feed).safeParse({
    ...body,
    feedId: params.feedId,
  });

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
    .set({ active: false })
    .where(eq(feed.id, params.feedId))
    .returning({ id: feed.id });

  return NextResponse.json(res);
}