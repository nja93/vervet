import db from "@/lib/db";
import { notification } from "@/lib/db/schema";
import { resourceNotFound } from "@/lib/utils/api";
import { getCount } from "@/lib/utils/db";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest, NextResponse } from "next/server";

// Add notification event
export async function POST(req: NextRequest) {
  const body: { templateId: string; feedId: string } = await req.json();
  const validator = createInsertSchema(notification).safeParse(body);

  if (validator.success === false) {
    return NextResponse.json(validator.error, { status: 400 });
  }

  // Confirm user exists
  const templateExists = await getCount("template", "id", body.templateId);
  if (!templateExists) {
    return resourceNotFound("template", body.templateId);
  }

  // Confirm feed exists
  const feedExists = await getCount("feed", "id", body.feedId);
  if (!feedExists) {
    return resourceNotFound("feed", body.feedId);
  }

  // TODO: Confirm if template and feed belong to same user?

  const res = await db
    .insert(notification)
    .values(body)
    .returning({ id: notification.id });

  return NextResponse.json(res[0], { status: 201 });
}
