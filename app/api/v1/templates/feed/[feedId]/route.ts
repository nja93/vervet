import db from "@/lib/db";
import { feedTemplate, template } from "@/lib/db/schema";
import { resourceNotFound } from "@/lib/utils/api";
import { getCount } from "@/lib/utils/db";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { feedId: string } }
) {
  const body = await req.json();
  const validator = createInsertSchema(template).safeParse(body);

  if (validator.success === false) {
    return NextResponse.json(validator.error, { status: 400 });
  }

  let temp;
  // Confirm feed exists
  const feedExists = await getCount("feed", "id", params.feedId);
  if (!feedExists) {
    return resourceNotFound("feed", params.feedId);
  }

  await db.transaction(async (tx) => {
    const [_template] = await tx
      .insert(template)
      .values({ name: body.name, content: body.content })
      .returning({ id: template.id });

    await tx
      .insert(feedTemplate)
      .values({ feedId: params.feedId, templateId: _template.id });

    temp = _template;
  });
  return NextResponse.json(temp, { status: 201 });
}
