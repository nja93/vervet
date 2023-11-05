import db from "@/lib/db";
import { getLimitOffset, resourceNotFound } from "@/lib/utils/api";
import { getUserToken } from "@/lib/utils/authOptions";
import { getCount } from "@/lib/utils/db";
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
    .slice(offset, limit ? offset + limit : undefined)
    .map((userTemplate) => ({
      userId: userTemplate.userId,
      ...userTemplate.template,
    }));

  return NextResponse.json({ templates: userTemplates });
}
