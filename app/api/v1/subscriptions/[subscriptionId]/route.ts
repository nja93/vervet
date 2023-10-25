import db from "@/lib/db";
import { notification, subscription } from "@/lib/db/schema";
import { resourceNotFound } from "@/lib/utils/api";
import { getCount } from "@/lib/utils/db";
import { subscribe } from "diagnostics_channel";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { subscriptionId: string } }
) {
  const subscription_one = await db.query.subscription.findFirst({
    where: (subscription, { eq }) => eq(subscription.id, params.subscriptionId),
  });

  if (!subscription_one) {
    return resourceNotFound("subscription", params.subscriptionId);
  }
  return NextResponse.json(subscription_one);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { subscriptionId: string } }
) {
  const res = await db
    .delete(subscription)
    .where(eq(subscription.id, params.subscriptionId))
    .returning({ id: subscription.id });

  return NextResponse.json(res);
}
