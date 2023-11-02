import db from "@/lib/db";
import { notification, subscription, userFeed } from "@/lib/db/schema";
import { resourceNotFound } from "@/lib/utils/api";
import { getCount } from "@/lib/utils/db";
import webPush from "@/lib/utils/webPush";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest, NextResponse } from "next/server";

// Add notification event
export async function POST(req: NextRequest) {
  const body: { templateId: string; feedId: string } = await req.json();
  const validator = createInsertSchema(notification).safeParse(body);

  if (validator.success === false) {
    return NextResponse.json(validator.error, { status: 400 });
  }

  // Confirm user exists
  const templateExists = await getCount("template", "id", body.templateId);
  if (!templateExists) {
    return resourceNotFound("template", body.templateId);
  }

  // Confirm feed exists
  const feedExists = await getCount("feed", "id", body.feedId);
  if (!feedExists) {
    return resourceNotFound("feed", body.feedId);
  }

  // TODO: Confirm if template and feed belong to same user?

  await db.insert(notification).values(body).returning({ id: notification.id });

  const triggerPushMsg = function (
    subId: string,
    sub: webPush.PushSubscription,
    dataToSend: string
  ) {
    return webPush.sendNotification(sub, dataToSend).catch(async (err) => {
      if (err.statusCode === 404 || err.statusCode === 410) {
        console.log("Subscription has expired or is no longer valid: ", err);
        await db
          .delete(subscription)
          .where(eq(subscription.id, subId))
          .returning({ id: subscription.id });
        return;
      } else {
        throw err;
      }
    });
  };

  const template_one = await db.query.template.findFirst({
    where: (template, { eq }) => eq(template.id, body.templateId),
  });

  const res = await db
    .select({
      id: subscription.id,
      userId: subscription.userId,
      subscription: subscription.subscription,
    })
    .from(userFeed)
    .leftJoin(subscription, eq(subscription.userId, userFeed.userId))
    .where(eq(userFeed.feedId, body.feedId))
    .then(function (subscriptions) {
      let promiseChain =
        Promise.resolve() as Promise<void | webPush.SendResult>;
      let dataToSend = JSON.stringify({
        title: template_one?.name,
        body: template_one?.content,
      });

      for (let i = 0; i < subscriptions.length; i++) {
        const sub = subscriptions[i].subscription as webPush.PushSubscription;
        promiseChain = promiseChain.then(() => {
          return triggerPushMsg(subscriptions[i].id!, sub, dataToSend);
        });
      }

      return promiseChain;
    });

  return NextResponse.json(res, { status: 201 });
}
