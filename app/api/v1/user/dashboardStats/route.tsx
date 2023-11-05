import db from "@/lib/db";
import { resourceNotFound } from "@/lib/utils/api";
import { getUserToken } from "@/lib/utils/authOptions";
import { getCount } from "@/lib/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getUserToken(req);
  const userId = token?.sub;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 404 });
  }

  // Confirm user exists
  const userExists = await getCount("user", "id", userId);

  if (!userExists) {
    return resourceNotFound("user", userId);
  }

  const feeds = await db.query.feed.findMany({
    columns: {
      id: true,
      title: true,
    },
    with: {
      userFeeds: {
        columns: {
          id: true,
        },
        where: (fields, { eq }) => eq(fields.active, true),
      },
      notifications: {
        columns: {
          id: true,
          positiveResponses: true,
          negativeResponses: true,
        },
      },
    },

    where: (fields, { eq, and }) =>
      and(eq(fields.userId, userId), eq(fields.active, true)),
  });

  const stats = feeds.reduce(
    (acc, curr) => {
      acc.totalSubscribers.value.value =
        acc.totalSubscribers.value.value + curr.userFeeds.length;
      acc.numberOfFeeds.value.value = acc.numberOfFeeds.value.value + 1;
      if (curr.userFeeds.length > acc.mostSubscribedFeed.value.value) {
        acc.mostSubscribedFeed.value = {
          id: curr.id,
          name: curr.title,
          value: curr.userFeeds.length,
          href: `/profile/feeds?id=${curr.id}`,
        };
      }
      acc.alertsSent.value.value =
        acc.alertsSent.value.value + curr.notifications.length;
      if (curr.notifications.length > acc.mostAlertedFeed.value.value) {
        acc.mostAlertedFeed.value = {
          id: curr.id,
          name: curr.title,
          value: curr.notifications.length,
          href: `/profile/feeds?id=${curr.id}`,
        };
      }
      return acc;
    },
    {
      totalSubscribers: { key: "Total Subscribers", value: { value: 0 } },
      numberOfFeeds: { key: "Number of Feeds", value: { value: 0 } },
      mostSubscribedFeed: {
        key: "Most Subscribed Feed",
        value: { id: "", name: "", value: 0, href: "" },
      },
      alertsSent: { key: "Total Alerts Sent", value: { value: 0 } },
      mostAlertedFeed: {
        key: "Most Alerted Feed",
        value: { id: "", name: "", value: 0, href: "" },
      },
    }
  );

  return NextResponse.json(Object.values(stats));
}
