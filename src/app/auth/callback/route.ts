import { NextResponse } from "next/server";

// PocketBase handles OAuth via popup window, so this callback
// is mainly for fallback/redirect purposes
export async function GET(request: Request) {
  const { origin } = new URL(request.url);

  // Redirect to home page - PocketBase SDK handles auth via popup
  return NextResponse.redirect(`${origin}/`);
}
