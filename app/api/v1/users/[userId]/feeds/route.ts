import db from "@/lib/db";
import { feed } from "@/lib/db/schema";
import { getLimitOffset, resourceNotFound } from "@/lib/utils/api";
import { getCount } from "@/lib/utils/db";
import { and, eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { limit, offset } = getLimitOffset(req);

  // Confirm user exists
  const userExists = await getCount("user", "id", params.userId);

  if (!userExists) {
    return resourceNotFound("user", params.userId);
  }

  const feeds = await db
    .select()
    .from(feed)
    .where(and(eq(feed.userId, params.userId), eq(feed.active, true)))
    .limit(limit)
    .offset(offset);

  return NextResponse.json(feeds);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  let body = { ...(await req.json()), userId: params.userId };
  const validator = createInsertSchema(feed).safeParse(body);

  if (validator.success === false) {
    return NextResponse.json(validator.error, { status: 400 });
  }

  // Confirm user exists
  const userExists = await getCount("user", "id", params.userId);

  if (!userExists) {
    return resourceNotFound("user", params.userId);
  }

  const res = await db.insert(feed).values(body).returning({ id: feed.id });

  return NextResponse.json(res[0], { status: 201 });
}
