import { getCount } from "@/lib/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const count = await getCount("feed", "", "", { active: true });

  return NextResponse.json({ count, __class__: "feed" });
}
