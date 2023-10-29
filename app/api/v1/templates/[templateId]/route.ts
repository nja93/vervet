import db from "@/lib/db";
import { feedTemplate, userTemplate } from "@/lib/db/schema";
import { resourceNotFound } from "@/lib/utils/api";
import { getCount } from "@/lib/utils/db";
import { eq } from "drizzle-orm";
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
