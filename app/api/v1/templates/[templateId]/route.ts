import db from "@/lib/db";
import { feedTemplate, template, userTemplate } from "@/lib/db/schema";
import { resourceNotFound } from "@/lib/utils/api";
import { getCount } from "@/lib/utils/db";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { templateId: string } }
) {
  const template_one = await db.query.template.findFirst({
    where: (template, { eq }) => eq(template.id, params.templateId),
  });

  if (!template_one) {
    return resourceNotFound("template", params.templateId);
  }
  return NextResponse.json(template_one);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { templateId: string } }
) {
  const body = await req.json();

  const validator = createInsertSchema(template)
    .omit({ id: true })
    .safeParse(body);

  if (validator.success === false) {
    return NextResponse.json(validator.error, { status: 400 });
  }

  // Confirm template exists
  const templateExists = await getCount("template", "id", params.templateId);

  if (!templateExists) {
    return resourceNotFound("template", params.templateId);
  }

  const res = await db
    .update(template)
    .set({ ...body })
    .where(eq(template.id, params.templateId))
    .returning({ id: template.id });

  console.log("res is", res);
  return NextResponse.json(res[0]);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { templateId: string } }
) {
  let res;

  const userTemplateExists = await getCount(
    "user_template",
    "template_id",
    params.templateId
  );

  const feedTemplateExists = await getCount(
    "feed_template",
    "template_id",
    params.templateId
  );

  if (userTemplateExists) {
    res = await db
      .delete(userTemplate)
      .where(eq(userTemplate.templateId, params.templateId))
      .returning({ id: userTemplate.templateId });
  } else if (feedTemplateExists) {
    res = await db
      .delete(feedTemplate)
      .where(eq(feedTemplate.templateId, params.templateId))
      .returning({ id: feedTemplate.templateId });
  } else {
    return resourceNotFound("template", params.templateId);
  }

  return NextResponse.json(res[0]);
}
