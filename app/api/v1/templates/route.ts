import db from "@/lib/db";
import { feedTemplate, template, userTemplate } from "@/lib/db/schema";
import { resourceNotFound } from "@/lib/utils/api";
import { getUserToken } from "@/lib/utils/authOptions";
import { getCount } from "@/lib/utils/db";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  function getParam(param: string) {
    return Number(req.nextUrl.searchParams.get(param));
  }
  const feedLimit = getParam("feedLimit");
  const feedOffset = getParam("feedOffset");
  const userLimit = getParam("userLimit");
  const userOffset = getParam("userOffset");

  const token = await getUserToken(req);
  const userId = token?.sub;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 404 });
  }

  // Confirm user exists
  const userExists = await getCount("user", "id", userId);

  if (!userExists) {
    return resourceNotFound("user", userId);
  }

  const feedTemplates = (
    await db.query.feed.findMany({
      columns: { id: true },
      with: {
        feedTemplates: {
          columns: { feedId: true },
          where: (field, { eq }) => eq(field.active, true),
          with: {
            template: {
              columns: {
                active: false,
              },
            },
          },
        },
      },
      where: (fields, { eq, and }) =>
        and(eq(fields.userId, userId), eq(fields.active, true)),
    })
  )
    .flatMap((feed) => feed.feedTemplates)
    .slice(feedOffset, feedLimit ? feedOffset + feedLimit : undefined)
    .map((feedTemplate) => ({
      feedId: feedTemplate.feedId,
      ...feedTemplate.template,
    }));

  const userTemplates = (
    await db.query.user.findMany({
      columns: { id: true },
      with: {
        userTemplates: {
          columns: { userId: true },
          where: (field, { eq }) => eq(field.active, true),
          with: {
            template: {
              columns: {
                active: false,
              },
            },
          },
        },
      },
      where: (fields, { eq, and }) => and(eq(fields.id, userId)),
    })
  )
    .flatMap((user) => user.userTemplates)
    .slice(userOffset, userLimit ? userOffset + userLimit : undefined)
    .map((userTemplate) => ({
      userId: userTemplate.userId,
      ...userTemplate.template,
    }));

  return NextResponse.json({ userTemplates, feedTemplates });
}

// // Add template
// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const validator = createInsertSchema(template).safeParse(body);

//   if (validator.success === false) {
//     return NextResponse.json(validator.error, { status: 400 });
//   }

//   if ("userId" in body !== "feedId" in body) {
//     let temp;
//     // Confirm user exists
//     const userExists = await getCount("user", "id", body.userId);
//     if ("userId" in body && !userExists) {
//       return resourceNotFound("user", body.userId);
//     }

//     // Confirm feed exists
//     const feedExists = await getCount("feed", "id", body.feedId);
//     if ("feedId" in body && !feedExists) {
//       return resourceNotFound("feed", body.feedId);
//     }

//     await db.transaction(async (tx) => {
//       const [_template] = await tx
//         .insert(template)
//         .values({ name: body.name, content: body.content })
//         .returning({ id: template.id });

//       if ("userId" in body) {
//         await tx
//           .insert(userTemplate)
//           .values({ userId: body.userId, templateId: _template.id });
//       } else {
//         await tx
//           .insert(feedTemplate)
//           .values({ feedId: body.feedId, templateId: _template.id });
//       }

//       temp = _template;
//     });
//     return NextResponse.json(temp, { status: 201 });
//   } else {
//     return NextResponse.json(
//       {
//         error: `Use either the feedId OR userId`,
//       },
//       { status: 401 }
//     );
//   }
// }
