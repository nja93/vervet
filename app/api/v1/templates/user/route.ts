import db from "@/lib/db";
import { template, userTemplate } from "@/lib/db/schema";
import { getLimitOffset, resourceNotFound } from "@/lib/utils/api";
import { getUserToken } from "@/lib/utils/authOptions";
import { getCount } from "@/lib/utils/db";
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

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validator = createInsertSchema(template).safeParse(body);

  if (validator.success === false) {
    return NextResponse.json(validator.error, { status: 400 });
  }

  let temp;
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

  await db.transaction(async (tx) => {
    const [_template] = await tx
      .insert(template)
      .values({ name: body.name, content: body.content })
      .returning({ id: template.id });

    await tx
      .insert(userTemplate)
      .values({ userId: userId, templateId: _template.id });

    temp = _template;
  });
  return NextResponse.json(temp, { status: 201 });
}
