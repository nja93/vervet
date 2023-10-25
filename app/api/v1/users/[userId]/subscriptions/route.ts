import db from "@/lib/db";
import { subscription } from "@/lib/db/schema";
import { getLimitOffset } from "@/lib/utils/api";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { limit, offset } = getLimitOffset(req);
  const subscription_many = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, params.userId))
    .limit(limit)
    .offset(offset);

  return NextResponse.json(subscription_many);
}
