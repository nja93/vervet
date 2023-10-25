import db from "@/lib/db";
import { notification, userNotification } from "@/lib/db/schema";
import { getLimitOffset } from "@/lib/utils/api";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { limit, offset } = getLimitOffset(req);
  const notification_many = await db
    .select()
    .from(userNotification)
    .where(eq(userNotification.userId, params.userId))
    .leftJoin(
      notification,
      eq(notification.id, userNotification.notificationId)
    )
    .limit(limit)
    .offset(offset);

  return NextResponse.json(notification_many);
}
