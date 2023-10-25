import db from "@/lib/db";
import { subscription } from "@/lib/db/schema";
import { getCount } from "@/lib/utils/db";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  // const subscription_count = await db
  //   .select({ count: sql<number>`count(*)` })
  //   .from(subscription)
  //   .where(eq(subscription.userId, params.userId));

  const count = await getCount("subscription", "user_id", params.userId);
  return NextResponse.json({
    count,
    __class__: "subscription",
  });
}
