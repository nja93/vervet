import db from "@/lib/db";
import { feed, user, userFeed } from "@/lib/db/schema";
import { resourceNotFound } from "@/lib/utils/api";
import { getUserToken } from "@/lib/utils/authOptions";
import { getCount } from "@/lib/utils/db";
import { desc, eq, inArray, sql, and } from "drizzle-orm";
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

  const mostActiveFeeds = Object.values(
    (
      await db.query.notification.findMany({
        columns: {},
        with: {
          feed: {
            columns: {
              id: true,
              title: true,
            },
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              userFeeds: {
                columns: {
                  id: true,
                },
                where: (fields, { eq }) => eq(fields.active, true),
              },
            },
          },
        },
        limit: 100,
        orderBy: (notification, { desc }) => desc(notification.createdAt),
      })
    ).reduce((acc: any, curr: any) => {
      if (Object.keys(acc).length >= 10 || curr.feed.id in acc) {
        return acc;
      }

      curr.feed.subs = curr.feed.userFeeds.length;
      curr.feed.userName = curr.feed.user.name;
      curr.feed.userImage = curr.feed.user.image;
      curr.feed.userId = curr.feed.user.id;

      delete curr.feed.userFeeds;
      delete curr.feed.user;

      acc[curr.feed.id] = curr.feed;

      return acc;
    }, {})
  );

  const topFeedsCount =
    (
      await db
        .select({
          subs: sql<number>`count(${userFeed.userId})`.as("subs"),
          feedId: userFeed.feedId!,
        })
        .from(userFeed)
        .groupBy(({ feedId }) => [feedId])
        .where(and(eq(userFeed.active, true), eq(feed.active, true)))
        .leftJoin(feed, eq(feed.id, userFeed.feedId))
        .orderBy(desc(sql<number>`count(${userFeed.userId})`))
        .limit(10)
    ).map(({ feedId }) => feedId) ?? [];

  const topFeeds = (
    await db.query.feed.findMany({
      columns: {
        id: true,
        title: true,
      },
      with: {
        user: {
          columns: {
            id: true,
            image: true,
            name: true,
          },
        },
        userFeeds: {
          columns: {
            id: true,
          },
          where: (fields, { eq }) => eq(fields.active, true),
        },
      },
      where: (feed, { inArray }) => inArray(feed.id, topFeedsCount),
    })
  ).map((feed) => ({
    id: feed.id,
    title: feed.title,
    userId: feed.user.id,
    userName: feed.user.name,
    userImage: feed.user.image,
    subs: feed.userFeeds.length,
  }));

  // await db
  //   .select({
  //     id: feed.id,
  //     title: feed.title,
  //     userId: user.id,
  //     userName: user.name,
  //     userImage: user.image,
  //   })
  //   .from(feed)
  //   .where(
  //     inArray(
  //       feed.id,
  //       topFeedsCount.map(({ feedId }) => feedId)
  //     )
  //   )
  //   .rightJoin(user, eq(user.id, userFeed.userId))
  //   .limit(10);

  let filter: string[] = [];
  let recentNotifications = (
    await db.query.userFeed.findMany({
      columns: {
        userId: true,
      },
      with: {
        feed: {
          columns: {
            id: true,
          },
          with: {
            notifications: {
              columns: {
                id: true,
                feedId: true,
                templateId: true,
                createdAt: true,
              },
              limit: 10,
              orderBy: (notification, { desc }) => desc(notification.createdAt),
              with: {
                template: {
                  columns: {
                    id: true,
                    name: true,
                    content: true,
                  },
                },
                feed: {
                  columns: {
                    id: true,
                    title: true,
                  },
                  with: {
                    user: {
                      columns: {
                        id: true,
                        name: true,
                        image: true,
                      },
                    },
                  },
                },
              },
              where: (notification, { eq, and, lte, isNull }) => {
                if (isNull(userFeed.inactiveDate)) {
                  return eq(notification.feedId, userFeed.feedId);
                } else {
                  return and(
                    eq(notification.feedId, userFeed.feedId),
                    lte(notification.createdAt, userFeed.inactiveDate)
                  );
                }
              },
            },
          },
        },
      },
      where: (userFeed, { eq }) => eq(userFeed.userId, userId),
    })
  )
    .flatMap((v) => v.feed.notifications)
    .reduce((acc, curr) => {
      if (filter.includes(curr.id)) {
        return acc;
      }
      filter.push(curr.id);
      return [...acc, curr];
    }, [] as any[])
    .slice(0, 10);

  return NextResponse.json({
    mostActiveFeeds,
    topFeeds,
    recentNotifications,
  });
}
