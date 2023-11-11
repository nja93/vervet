import { canSendRequest } from "@/app/api/config/limiter";
import db from "@/lib/db";
import { getLimitOffset, resourceNotFound } from "@/lib/utils/api";
import { getUserToken } from "@/lib/utils/authOptions";
import { getCount } from "@/lib/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
  const { limit, offset } = getLimitOffset(req);
  const token = await getUserToken(req);
  const userId = token?.sub;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 404 });
  }

  // Confirm user exists
  let userExists = await getCount("user", "id", params.id);

  if (!userExists) {
    return resourceNotFound("user", params.id);
  }
  if (!(await canSendRequest("/channels"))) {
    return NextResponse.json(null, { status: 429 });
  }

  let user_one = (
    await db.query.user.findFirst({
      columns: {
        id: true,
        name: true,
        image: true,
      },
      with: {
        feeds: {
          columns: {
            id: true,
            title: true,
          },
          where: (feed, { eq }) => eq(feed.active, true),
          with: {
            userFeeds: {
              columns: {
                active: true,
              },
              where: (fields, {eq}) => eq(fields.active, true)
            },
          }
        },
      },
      where: (fields, {eq}) => eq(fields.id, params.id),
    })
  )
  
  if (user_one) {
    let feeds = user_one.feeds.map((feed)=>{
      let _feed: any = {...feed, subs: feed.userFeeds.length}
      delete _feed.userFeeds;
      return (_feed)
    })

    user_one = {...user_one, feeds: feeds}
  } else {
      return resourceNotFound("user", userId);
  }

  console.log("user_one", user_one)
  return NextResponse.json(user_one);
}
