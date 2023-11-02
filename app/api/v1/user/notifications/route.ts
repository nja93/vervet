import db from "@/lib/db";
import { notification, userNotification } from "@/lib/db/schema";
import { getLimitOffset } from "@/lib/utils/api";
import { getUserToken } from "@/lib/utils/authOptions";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getUserToken(req);
  const userId = token?.sub;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 404 });
  }
  const { limit, offset } = getLimitOffset(req);
  const notification_many = await db
    .select()
    .from(userNotification)
    .where(eq(userNotification.userId, userId))
    .leftJoin(
      notification,
      eq(notification.id, userNotification.notificationId)
    )
    .limit(limit)
    .offset(offset);

  return NextResponse.json(notification_many);
}
