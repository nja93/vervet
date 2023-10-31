import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const getLimitOffset = (req: NextRequest) => ({
  limit: Number(req.nextUrl.searchParams.get("limit")),
  offset: Number(req.nextUrl.searchParams.get("offset")),
});

export const resourceNotFound = (model: string, id: string | undefined) =>
  NextResponse.json(
    {
      error: `Could not find ${model}`,
      data: { id, __class__: model },
    },
    { status: 404, statusText: "Could not find resource" }
  );

export const resourceDuplicate = (
  model: string,
  constraint: string,
  value: string
) =>
  NextResponse.json(
    {
      error: `Duplicate ${model} found based on constraints`,
      data: { [constraint]: value, __class__: model },
    },
    { status: 400, statusText: "Resource already exists" }
  );

export const tokenHeader = () => {
  const cookieStore = cookies(); // Get cookies object

  const token = cookieStore
    .getAll()
    .find((cookie) => cookie.name.includes("session-token"))?.value;

  const requestHeaders = new Headers();
  requestHeaders.set("Authorization", `Bearer ${token}`);
  return requestHeaders;
};
