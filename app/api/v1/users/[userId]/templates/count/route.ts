import db from "@/lib/db";
import { template, userTemplate } from "@/lib/db/schema";
import { getLimitOffset } from "@/lib/utils/api";
import { getCount } from "@/lib/utils/db";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  // const template_count = await db
  //   .select({ count: sql<number>`count(*)` })
  //   .from(userTemplate)
  //   .where(eq(userTemplate.userId, params.userId));

  const count = await getCount("user_template", "user_id", params.userId);
  return NextResponse.json({ count, __class__: "template" });
}
