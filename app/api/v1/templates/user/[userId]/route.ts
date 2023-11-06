import db from "@/lib/db";
import { userTemplate, template } from "@/lib/db/schema";
import { resourceNotFound } from "@/lib/utils/api";
import { getCount } from "@/lib/utils/db";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const body = await req.json();
  const validator = createInsertSchema(template).safeParse(body);

  if (validator.success === false) {
    return NextResponse.json(validator.error, { status: 400 });
  }

  let temp;
  // Confirm user exists
  const userExists = await getCount("user", "id", params.userId);
  if (!userExists) {
    return resourceNotFound("user", params.userId);
  }

  await db.transaction(async (tx) => {
    const [_template] = await tx
      .insert(template)
      .values({ name: body.name, content: body.content })
      .returning({ id: template.id });

    await tx
      .insert(userTemplate)
      .values({ userId: params.userId, templateId: _template.id });

    temp = _template;
  });
  return NextResponse.json(temp, { status: 201 });
}
