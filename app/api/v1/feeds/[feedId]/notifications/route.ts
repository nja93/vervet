import db from "@/lib/db";
import { getLimitOffset, resourceNotFound } from "@/lib/utils/api";
import { getCount } from "@/lib/utils/db";
import { NextRequest, NextResponse } from "next/server";

// Add notification event
export async function GET(
  req: NextRequest,
  { params }: { params: { feedId: string } }
) {
  let { limit, offset } = getLimitOffset(req);
  // Confirm feed exists
  const feedExists = await getCount("feed", "id", params.feedId);
  if (!feedExists) {
    return resourceNotFound("feed", params.feedId);
  }

  const notifications = (
    await db.query.feed.findMany({
      columns: {
        id: true,
      },
      with: {
        notifications: {
          columns: {
            createdAt: false,
            templateId: false,
          },
        },
      },
    })
  )
    .flatMap((_feed) => _feed.notifications)
    .slice(offset, limit ? offset + limit : undefined);

  return NextResponse.json(notifications, { status: 200 });
}
