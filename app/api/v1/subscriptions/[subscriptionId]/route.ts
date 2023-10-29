import db from "@/lib/db";
import { subscription } from "@/lib/db/schema";
import { resourceNotFound } from "@/lib/utils/api";
import { getCount } from "@/lib/utils/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { subscriptionId: string } }
) {
  const subscriptionExists = await getCount(
    "subscription",
    "id",
    params.subscriptionId
  );

  if (!subscriptionExists) {
    return resourceNotFound("subscription", params.subscriptionId);
  }

  const subscription_one = await db.query.subscription.findFirst({
    where: (subscription, { eq }) => eq(subscription.id, params.subscriptionId),
  });

  return NextResponse.json(subscription_one);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { subscriptionId: string } }
) {
  // Confirm subscription exists
  const subscriptionExists = await getCount(
    "subscription",
    "id",
    params.subscriptionId
  );

  if (!subscriptionExists) {
    return resourceNotFound("subscription", params.subscriptionId);
  }

  const res = await db
    .delete(subscription)
    .where(eq(subscription.id, params.subscriptionId))
    .returning({ id: subscription.id });

  return NextResponse.json(res[0]);
}
