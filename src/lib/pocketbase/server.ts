import PocketBase from "pocketbase";
import { cookies } from "next/headers";

export async function createServerClient(): Promise<PocketBase> {
  const pb = new PocketBase(
    process.env.POCKETBASE_URL || process.env.NEXT_PUBLIC_POCKETBASE_URL
  );

  // Load auth from cookies
  const cookieStore = await cookies();
  const pbAuth = cookieStore.get("pb_auth");

  if (pbAuth) {
    pb.authStore.loadFromCookie(`pb_auth=${pbAuth.value}`);
  }

  return pb;
}

export async function getServerUser() {
  const pb = await createServerClient();

  if (pb.authStore.isValid) {
    return pb.authStore.record;
  }

  return null;
}


