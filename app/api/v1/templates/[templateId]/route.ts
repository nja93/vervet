import db from "@/lib/db";
import { resourceNotFound } from "@/lib/utils/api";
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
