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

  const count = (
    await db.query.feed.findMany({
      columns: { id: true },
      with: {
        feedTemplates: {
          columns: { feedId: true },
          where: (field, { eq }) => eq(field.active, true),
          with: {
            template: {
              columns: {
                active: false,
              },
            },
          },
        },
      },
      where: (fields, { eq, and }) =>
        and(eq(fields.userId, userId), eq(fields.active, true)),
    })
  )
    .flatMap((feed) => feed.feedTemplates)
    .map((feedTemplate) => ({
      feedId: feedTemplate.feedId,
      ...feedTemplate.template,
    })).length;

  return NextResponse.json({ count, __class__: "feedTemplates" });
}
