import db from "@/lib/db";
import { getLimitOffset } from "@/lib/utils/api";
import { getUserToken } from "@/lib/utils/authOptions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getUserToken(req);
  const userId = token?.sub;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 404 });
  }
  const { limit, offset } = getLimitOffset(req);
  const template_many = (
    await db.query.userTemplate.findMany({
      columns: {},
      with: {
        template: true,
      },
      where: (userTemplate, { eq }) => eq(userTemplate.userId, userId),
      limit: limit,
      offset: offset,
    })
  ).map((obj) => obj.template);

  return NextResponse.json(template_many);
}
