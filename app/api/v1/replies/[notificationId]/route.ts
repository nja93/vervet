import db from "@/lib/db";
import { notification } from "@/lib/db/schema";
import { resourceNotFound } from "@/lib/utils/api";
import { getUserToken } from "@/lib/utils/authOptions";
import { eq } from "drizzle-orm";
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
  const token = await getUserToken(req);
  const userId = token?.sub;
  const body = await req.json();

  let data = await db.query.notification.findFirst({
    columns: {
      id: true,
      responses: true,
      negativeResponses: true,
      positiveResponses: true,
    },
  });

  let res;

  if (body.action == "positive-action") {
    res = await db
      .update(notification)
      .set({
        responses: (data?.responses ?? 0) + 1,
        positiveResponses: (data?.positiveResponses ?? 0) + 1,
      })
      .where(eq(notification.id, params.notificationId))
      .returning({ id: notification.id });
  } else if (body.action == "negative-action") {
    res = await db
      .update(notification)
      .set({
        responses: (data?.responses ?? 0) + 1,
        negativeResponses: (data?.negativeResponses ?? 0) + 1,
      })
      .where(eq(notification.id, params.notificationId))
      .returning({ id: notification.id });
  } else {
    res = await db
      .update(notification)
      .set({
        responses: (data?.responses ?? 0) + 1,
      })
      .where(eq(notification.id, params.notificationId))
      .returning({ id: notification.id });
  }

  return NextResponse.json(res[0]);
}
