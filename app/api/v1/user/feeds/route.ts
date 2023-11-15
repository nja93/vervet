import db from "@/lib/db";
import { feed } from "@/lib/db/schema";
import { getLimitOffset, resourceNotFound } from "@/lib/utils/api";
import { auth, getUserToken } from "@/lib/utils/authOptions";
import { getCount } from "@/lib/utils/db";
import { and, eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { limit, offset } = getLimitOffset(req);
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
          userId: true,
        },
        where: (fields, { eq }) => eq(fields.active, true),
      },
      feedTemplates: {
        columns: {},
        with: {
          template: {
            columns: {
              active: false,
            },
          },
        },
        where: (fields, { eq }) => eq(fields.active, true),
      },

      notifications: {
        columns: {
          id: true,
        },
      },
    },

    where: (fields, { eq, and }) =>
      and(eq(feed.userId, userId), eq(fields.active, true)),
    limit: limit,
    offset: offset,
  });
  return NextResponse.json(feeds);
}

export async function POST(req: NextRequest) {
  const token = await getUserToken(req);
  const userId = token?.sub;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 404 });
  }
  let body = { ...(await req.json()), userId: userId };
  const validator = createInsertSchema(feed).safeParse(body);

  if (validator.success === false) {
    return NextResponse.json(validator.error, { status: 400 });
  }

  // Confirm user exists
  const userExists = await getCount("user", "id", userId);

  if (!userExists) {
    return resourceNotFound("user", userId);
  }

  const res = await db.insert(feed).values(body).returning({ id: feed.id });

  return NextResponse.json(res[0], { status: 201 });
}
