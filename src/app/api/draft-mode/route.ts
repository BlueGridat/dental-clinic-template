import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function getSafeRedirectPath(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "/";

  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }

  return path;
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!process.env.SANITY_PREVIEW_SECRET || secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response("Invalid preview secret", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(getSafeRedirectPath(request), request.nextUrl.origin));
}
