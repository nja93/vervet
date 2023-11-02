import db from "@/lib/db";
import { subscription } from "@/lib/db/schema";
import {
  getLimitOffset,
  resourceDuplicate,
  resourceNotFound,
} from "@/lib/utils/api";
import { auth, getUserToken } from "@/lib/utils/authOptions";
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

export async function GET(req: NextRequest) {
  const token = await getUserToken(req);
  const userId = token?.sub;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 404 });
  }

  const { limit, offset } = getLimitOffset(req);
  const subscription_many = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, userId))
    .limit(limit)
    .offset(offset);

  return NextResponse.json(subscription_many);
}

export async function POST(req: NextRequest) {
  const token = await getUserToken(req);
  const userId = token?.sub;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 404 });
  }
  const body: Subscription = await req.json();

  // Confirm user exists
  const userExists = await getCount("user", "id", userId);

  if (!userExists) {
    return resourceNotFound("user", userId);
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
      userId: userId,
      subscription: JSON.stringify(body),
      endpoint: body.endpoint,
      userAgent: req.headers.get("user-agent"),
    })
    .returning({ id: subscription.id, endpoint: subscription.endpoint });

  return NextResponse.json(_subscription[0], { status: 201 });
}
