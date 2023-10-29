import db from "@/lib/db";
import { subscription } from "@/lib/db/schema";
import {
  getLimitOffset,
  resourceDuplicate,
  resourceNotFound,
} from "@/lib/utils/api";
import { getCount } from "@/lib/utils/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

type Subscription = {
  endpoint: string;
  expirationTime: string | null;
  keys: {
    auth: string;
    p256dh: string;
  };
};

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

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const body: Subscription = await req.json();

  // Confirm user exists
  const userExists = await getCount("user", "id", params.userId);

  if (!userExists) {
    return resourceNotFound("user", params.userId);
  }

  // Confirm subscription not unique
  const subscriptionExists = await getCount(
    "subscription",
    "endpoint",
    body.endpoint
  );

  if (subscriptionExists) {
    return resourceDuplicate("subscription", "endpoint", body.endpoint);
  }

  // Insert subscription to db
  const _subscription = await db
    .insert(subscription)
    .values({
      userId: params.userId,
      subscription: JSON.stringify(body),
      endpoint: body.endpoint,
      userAgent: req.headers.get("user-agent"),
    })
    .returning({ id: subscription.id, endpoint: subscription.endpoint });

  return NextResponse.json(_subscription[0], { status: 201 });
}
