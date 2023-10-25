import db from "@/lib/db";
import { notification } from "@/lib/db/schema";
import { resourceNotFound } from "@/lib/utils/api";
import { getCount } from "@/lib/utils/db";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  const notification_one = await db.query.notification.findFirst({
    where: (notification, { eq }) => eq(notification.id, params.notificationId),
  });

  if (!notification_one) {
    return resourceNotFound("notification", params.notificationId);
  }

  return NextResponse.json(notification_one);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { notificationId: string } }
) {
  let body = { ...(await req.json()) };
  const validator = createInsertSchema(notification).safeParse(body);

  if (validator.success === false) {
    return NextResponse.json(validator.error, { status: 400 });
  }

  // Confirm user exists
  const notificationExists = await getCount(
    "notification",
    "id",
    params.notificationId
  );

  if (!notificationExists) {
    return resourceNotFound("notification", params.notificationId);
  }

  const res = await db
    .update(notification)
    .set(body)
    .where(eq(notification.id, params.notificationId))
    .returning({ id: notification.id });

  return NextResponse.json(res);
}
