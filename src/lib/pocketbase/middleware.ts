import PocketBase from "pocketbase";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request,
  });

  // Get PocketBase auth cookie
  const pbAuth = request.cookies.get("pb_auth");

  if (pbAuth) {
    // Validate the auth token by creating a PocketBase instance
    const pb = new PocketBase(
      process.env.POCKETBASE_URL || process.env.NEXT_PUBLIC_POCKETBASE_URL
    );

    try {
      // Load auth from cookie
      pb.authStore.loadFromCookie(`pb_auth=${pbAuth.value}`);

      // Check if auth is still valid
      if (pb.authStore.isValid) {
        // Optionally refresh the auth if needed
        // await pb.collection("users").authRefresh();
      }
    } catch {
      // If auth is invalid, clear the cookie
      response.cookies.delete("pb_auth");
    }
  }

  // Add your protected routes logic here
  // Example: redirect unauthenticated users from protected routes
  // const user = pbAuth ? true : false;
  // if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/login';
  //   return NextResponse.redirect(url);
  // }

  return response;
}
