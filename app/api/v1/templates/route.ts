import db from "@/lib/db";
import {
  feedTemplate,
  notification,
  template,
  userTemplate,
} from "@/lib/db/schema";
import { Either } from "@/lib/db/types";
import { resourceNotFound } from "@/lib/utils/api";
import { getCount } from "@/lib/utils/db";
import { createInsertSchema } from "drizzle-zod";
import { NextRequest, NextResponse } from "next/server";

// Add template
export async function POST(req: NextRequest) {
  const body = await req.json();
  const validator = createInsertSchema(template).safeParse(body);

  if (validator.success === false) {
    return NextResponse.json(validator.error, { status: 400 });
  }

  if ("userId" in body !== "feedId" in body) {
    // Confirm user exists
    const userExists = await getCount("user", "id", body.userId);
    if (!userExists) {
      return resourceNotFound("user", body.userId);
    }

    // Confirm feed exists
    const feedExists = await getCount("feed", "id", body.feedId);
    if (!feedExists) {
      return resourceNotFound("feed", body.feedId);
    }

    db.transaction(async (tx) => {
      const [_template] = await tx
        .insert(template)
        .values({ name: body.name, content: body.content })
        .returning({ id: template.id });

      if ("userId" in body) {
        await tx
          .insert(userTemplate)
          .values({ userId: body.userId, templateId: _template.id });
      } else {
        await tx
          .insert(feedTemplate)
          .values({ feedId: body.feedId, templateId: _template.id });
      }

      return NextResponse.json(_template, { status: 201 });
    });
  } else {
    return NextResponse.json(
      {
        error: `Use either the feedId OR userId`,
      },
      { status: 401 }
    );
  }
}
