import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getLimitOffset } from "@/lib/utils/api";
import { subscription, userFeed } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: { feedId: string } }
) {
  const { limit, offset } = getLimitOffset(req);

  const subscription_many = await db
    .select({
      id: subscription.id,
      userId: subscription.userId,
      subscription: subscription.subscription,
      endpoint: subscription.endpoint,
    })
    .from(userFeed)
    .leftJoin(subscription, eq(subscription.userId, userFeed.userId))
    .where(eq(userFeed.feedId, params.feedId))
    .limit(limit)
    .offset(offset);

  return NextResponse.json(subscription_many);
}
