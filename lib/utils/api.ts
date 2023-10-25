import { NextRequest, NextResponse } from "next/server";

export const getLimitOffset = (req: NextRequest) => ({
  limit: Number(req.nextUrl.searchParams.get("limit")),
  offset: Number(req.nextUrl.searchParams.get("offset")),
});

export const resourceNotFound = (model: string, id: string) =>
  NextResponse.json(
    {
      error: `Could not find ${model}`,
      data: { id, __class__: model },
    },
    { status: 404, statusText: "Could not find resource" }
  );
