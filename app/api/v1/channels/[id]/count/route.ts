import { canSendRequest } from "@/app/api/config/limiter";
import db from "@/lib/db";
import { getLimitOffset, resourceNotFound } from "@/lib/utils/api";
import { getUserToken } from "@/lib/utils/authOptions";
import { getCount } from "@/lib/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
  const token = await getUserToken(req);
  const userId = token?.sub;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 404 });
  }

  // Confirm user exists
  const userExists = await getCount("user", "id", params.id);

  if (!userExists) {
    return resourceNotFound("user", params.id);
  }
  if (!(await canSendRequest("/channels"))) {
    return NextResponse.json(null, { status: 429 });
  }

  const user_one = 
    await db.query.user.findFirst({
      columns: {},
      with: {
        feeds: {
          columns: {
            id: true
          },
          where: (feed, { eq }) => eq(feed.active, true),
        },
      },
      where: (fields, {eq}) => eq(fields.id, params.id),
    })
  

  return NextResponse.json({count:user_one?.feeds?.length ?? 0, class: "__feed__"});
}
