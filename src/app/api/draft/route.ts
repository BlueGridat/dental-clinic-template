import { timingSafeEqual } from "node:crypto";
import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getSafeRedirectPath(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || request.nextUrl.searchParams.get("slug") || "/";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.startsWith("//") || normalized.includes("\\")) return "/";
  return normalized;
}

function secretMatches(given: string | null, expected: string) {
  if (!given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Optional draft mode: GET /api/draft?secret=<SANITY_PREVIEW_SECRET>&path=/<clinic-slug>
 * Refuses (404) when SANITY_PREVIEW_SECRET is not configured, 401 on a wrong secret.
 * Showing unpublished drafts additionally needs SANITY_API_TOKEN (Viewer) on the server.
 */
export async function GET(request: NextRequest) {
  const expected = process.env.SANITY_PREVIEW_SECRET;
  if (!expected || expected.length < 16) {
    return new Response("Draft mode is not enabled on this deployment.", { status: 404 });
  }
  if (!secretMatches(request.nextUrl.searchParams.get("secret"), expected)) {
    return new Response("Invalid preview secret", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();
  return NextResponse.redirect(new URL(getSafeRedirectPath(request), request.nextUrl.origin));
}
