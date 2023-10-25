import db from "@/lib/db";
import { template, userTemplate } from "@/lib/db/schema";
import { getLimitOffset } from "@/lib/utils/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { limit, offset } = getLimitOffset(req);
  const template_many = (
    await db.query.userTemplate.findMany({
      columns: {},
      with: {
        template: true,
      },
      where: (userTemplate, { eq }) => eq(userTemplate.userId, params.userId),
      limit: limit,
      offset: offset,
    })
  ).map((obj) => obj.template);

  return NextResponse.json(template_many);
}
