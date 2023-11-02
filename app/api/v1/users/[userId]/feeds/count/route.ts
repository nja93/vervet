import { getCount } from "@/lib/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const count = await getCount("feed", "user_id", params.userId, {
    active: true,
  });

  return NextResponse.json({ count, __class__: "feed" });
}
