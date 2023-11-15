import db from "@/lib/db";
import { notification, subscription, userFeed } from "@/lib/db/schema";
import { resourceNotFound } from "@/lib/utils/api";
import { getCount } from "@/lib/utils/db";
import webPush from "@/lib/utils/webPush";
import { eq, and } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest, NextResponse } from "next/server";

// Add notification event
export async function POST(req: NextRequest) {
  const body: { templateId: string; feedId: string } = await req.json();
  const validator = createInsertSchema(notification).safeParse(body);
  let totalSubscribers = 0;

  if (validator.success === false) {
    return NextResponse.json(validator.error, { status: 400 });
  }

  // Confirm template exists
  const templateExists = await getCount("template", "id", body.templateId);
  if (!templateExists) {
    return resourceNotFound("template", body.templateId);
  }

  // Confirm feed exists
  const feedExists = await getCount("feed", "id", body.feedId);
  if (!feedExists) {
    return resourceNotFound("feed", body.feedId);
  }

  const triggerPushMsg = function (
    subId: string,
    sub: webPush.PushSubscription,
    dataToSend: string
  ) {
    return webPush.sendNotification(sub, dataToSend).catch(async (err) => {
      if (err.statusCode === 404 || err.statusCode === 410) {
        totalSubscribers -= 1;
        await db
          .delete(subscription)
          .where(eq(subscription.id, subId))
          .returning({ id: subscription.id });
      }
    });
  };

  const template_one = await db.query.template.findFirst({
    where: (template, { eq }) => eq(template.id, body.templateId),
  });

  const notif = await db
    .insert(notification)
    .values({ feedId: body.feedId, templateId: body.templateId })
    .returning({ id: notification.id });

  const notificationId = notif[0].id;

  const notificationChain = await db
    .select({
      id: subscription.id,
      userId: subscription.userId,
      subscription: subscription.subscription,
    })
    .from(userFeed)
    .leftJoin(subscription, eq(subscription.userId, userFeed.userId))
    .where(and(eq(userFeed.feedId, body.feedId), eq(userFeed.active, true)))
    .then(function (subscriptions) {
      totalSubscribers = subscriptions.length;
      Promise.resolve() as Promise<void | webPush.SendResult>;

      let dataToSend = JSON.stringify({
        id: notificationId,
        title: template_one?.name,
        body: template_one?.content,
        renotify: template_one?.renotify,
        requireInteraction: template_one?.requireInteraction,
        actions: [
          {
            action: "positive-action",
            title: template_one?.positiveAction || "👍 Yay",
            type: "button",
          },
          {
            action: "negative-action",
            title: template_one?.negativeAction || "👎 Nay",
            type: "button",
          },
          {
            action: "dismiss-action",
            title: template_one?.dismissAction || "Ignore",
            type: "button",
          },
        ],
      });

      return Promise.all<void | webPush.SendResult>(
        subscriptions.map(async (sub) =>
          triggerPushMsg(
            sub.id!,
            sub.subscription as webPush.PushSubscription,
            dataToSend
          )
        )
      );
    })
    .then(async (results) => {
      const stats = {
        requested: totalSubscribers,
        delivered: results.filter((result) => result?.statusCode === 201)
          .length,
      };

      const res = await db
        .update(notification)
        .set(stats)
        .where(eq(notification.id, notificationId))
        .returning({ id: notification.id });

      return NextResponse.json(res[0], { status: 201 });
    })
    .catch(function (err) {
      return NextResponse.json(
        {
          error: {
            id: "unable-to-send-messages",
            message: `We were unable to send messages to all subscriptions : '${err.message}'`,
          },
        },
        { status: 500 }
      );
    });

  return NextResponse.json({}, { status: 201 });
}
