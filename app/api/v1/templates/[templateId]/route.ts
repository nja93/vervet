import db from "@/lib/db";
import { feed, feedTemplate, template, userTemplate } from "@/lib/db/schema";
import { resourceNotFound } from "@/lib/utils/api";
import { getCount } from "@/lib/utils/db";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { templateId: string } }
) {
  let template = await db.query.template.findFirst({
    with: {
      feed: {
        columns: {
          feedId: true,
        },
      },
    },
    where: (template, { eq }) => eq(template.id, params.templateId),
  });

  if (!template) {
    return resourceNotFound("template", params.templateId);
  }

  type OptionalFeed = Partial<typeof template>;
  const temp: OptionalFeed & { feedId: string } = {
    ...template,
    feedId: template?.feed?.feedId,
  };
  delete temp.feed;

  return NextResponse.json(temp);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { templateId: string } }
) {
  const body = await req.json();
  let feedId;

  if ("feedId" in body) {
    feedId = body.feedId;
    delete body.feedId;
  }

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

  if (feedId) {
    await db
      .update(feedTemplate)
      .set({ feedId })
      .where(eq(feedTemplate.templateId, params.templateId));
  }

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
      .update(userTemplate)
      .set({ active: false })
      .where(eq(userTemplate.templateId, params.templateId))
      .returning({ id: userTemplate.templateId });
  } else if (feedTemplateExists) {
    res = await db
      .update(feedTemplate)
      .set({ active: false })
      .where(eq(feedTemplate.templateId, params.templateId))
      .returning({ id: feedTemplate.templateId });
  } else {
    return resourceNotFound("template", params.templateId);
  }

  await db
    .update(template)
    .set({ active: false })
    .where(eq(template.id, params.templateId))
    .returning({ id: template.id });

  return NextResponse.json(res[0]);
}
