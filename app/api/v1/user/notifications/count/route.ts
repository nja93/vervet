import db from "@/lib/db";
import { userFeed } from "@/lib/db/schema";
import { getUserToken } from "@/lib/utils/authOptions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getUserToken(req);
  const userId = token?.sub;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 404 });
  }

  let filter: string[] = [];
  let notificationCount = (
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
    }, [] as any[]).length;

  return NextResponse.json({
    count: notificationCount,
    __class__: "notification",
  });
}
