import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getLimitOffset, resourceNotFound } from "@/lib/utils/api";
import { feed } from "@/lib/db/schema";
import { TFeed } from "@/lib/db/types";
import { createInsertSchema } from "drizzle-zod";
import { getCount } from "@/lib/utils/db";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { limit, offset } = getLimitOffset(req);

  const feed_many = await db.select().from(feed).limit(limit).offset(offset);

  return NextResponse.json(feed_many);
}
