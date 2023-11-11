import db from "@/lib/db";
import { feedTemplate, template, userTemplate } from "@/lib/db/schema";
import { resourceNotFound } from "@/lib/utils/api";
import { getUserToken } from "@/lib/utils/authOptions";
import { getCount } from "@/lib/utils/db";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  function getParam(param: string) {
    return Number(req.nextUrl.searchParams.get(param));
  }
  const feedLimit = getParam("feedLimit");
  const feedOffset = getParam("feedOffset");
  const userLimit = getParam("userLimit");
  const userOffset = getParam("userOffset");

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

  const feedTemplates = (
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
    .slice(feedOffset, feedLimit ? feedOffset + feedLimit : undefined)
    .map((feedTemplate) => ({
      feedId: feedTemplate.feedId,
      ...feedTemplate.template,
    }));

  const userTemplates = (
    await db.query.user.findMany({
      columns: { id: true },
      with: {
        userTemplates: {
          columns: { userId: true },
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
      where: (fields, { eq, and }) => and(eq(fields.id, userId)),
    })
  )
    .flatMap((user) => user.userTemplates)
    .slice(userOffset, userLimit ? userOffset + userLimit : undefined)
    .map((userTemplate) => ({
      userId: userTemplate.userId,
      ...userTemplate.template,
    }));

  return NextResponse.json({ userTemplates, feedTemplates });
}
