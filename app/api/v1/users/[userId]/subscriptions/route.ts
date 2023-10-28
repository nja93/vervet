import db from "@/lib/db";
import { subscription } from "@/lib/db/schema";
import { getLimitOffset } from "@/lib/utils/api";
import webPush from "@/lib/utils/webPush";
import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

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
  const body = await req.json();

  const notification = {
    title: faker.company.name(),
    body: faker.company.catchPhraseDescriptor(),
    icon: "https://www.vervet.info/vercel.svg",
  };

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

  webPush.sendNotification(body, JSON.stringify(notification));

  return NextResponse.json(notification, { status: 201 });
}
