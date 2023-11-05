import db from "@/lib/db";
import { getLimitOffset } from "@/lib/utils/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { feedId: string } }
) {
  const { limit, offset } = getLimitOffset(req);
  const template_many = (
    await db.query.feedTemplate.findMany({
      columns: {},
      with: {
        template: true,
      },
      where: (feedTemplate, { eq, and }) =>
        and(
          eq(feedTemplate.active, true),
          eq(feedTemplate.feedId, params.feedId)
        ),
      limit: limit,
      offset: offset,
    })
  ).map((obj) => obj.template);

  return NextResponse.json(template_many);
}
