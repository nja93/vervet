import db from "@/lib/db";
import { userNotification } from "@/lib/db/schema";
import { getCount } from "@/lib/utils/db";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  // const notification_count = await db
  //   .select({ count: sql<number>`count(*)` })
  //   .from(userNotification)
  //   .where(eq(userNotification.userId, params.userId));

  const count = await getCount("user_notification", "user_id", params.userId);
  return NextResponse.json({
    count,
    __class__: "notification",
  });
}
